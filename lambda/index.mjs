/* portfolio-api
   Every visitor can let go of a drop. The drop waits in DynamoDB until the
   real phone asks for it, lands on its screen, and reports back.

   POST /api/drop        public    create a drop
   GET  /api/drop/{id}   public    has it landed yet?
   GET  /api/sky         public    counters and phone status
   POST /api/phone       token     heartbeat, deliveries and pending drops
   GET  /api/health      public    liveness
*/
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand
} from '@aws-sdk/lib-dynamodb';
import { randomUUID, timingSafeEqual } from 'node:crypto';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true }
});

const TABLE = process.env.TABLE;
const TOKEN = process.env.PHONE_TOKEN || '';
const ALLOW = process.env.ALLOWED_ORIGIN || '*';
const ONLINE_MS = 30000;
const META = { pk: 'meta', sk: 'sky' };
const PHONE = { pk: 'meta', sk: 'phone' };

const HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'access-control-allow-origin': ALLOW,
  'access-control-allow-headers': 'content-type',
  'access-control-allow-methods': 'GET,POST,OPTIONS',
  'cache-control': 'no-store'
};

const reply = (statusCode, body) => ({ statusCode, headers: HEADERS, body: JSON.stringify(body) });

function parse(event) {
  const raw = event.isBase64Encoded
    ? Buffer.from(event.body || '', 'base64').toString('utf8')
    : event.body || '';
  try {
    const value = JSON.parse(raw);
    return value && typeof value === 'object' ? value : {};
  } catch {
    return {};
  }
}

/* CloudWatch embedded metric format: one log line becomes a metric */
function metric(name, value = 1, unit = 'Count', extra = {}) {
  console.log(JSON.stringify({
    _aws: {
      Timestamp: Date.now(),
      CloudWatchMetrics: [{
        Namespace: 'Portfolio/Sky',
        Dimensions: [[]],
        Metrics: [{ Name: name, Unit: unit }]
      }]
    },
    [name]: value,
    ...extra
  }));
}

function cleanZone(value) {
  const zone = typeof value === 'string' ? value : '';
  return /^[A-Za-z0-9_+\-/]{1,48}$/.test(zone) ? zone : '';
}

function placeName(zone) {
  const last = zone.split('/').pop() || '';
  return last.replace(/_/g, ' ');
}

function validToken(value) {
  if (!TOKEN || typeof value !== 'string') return false;
  const a = Buffer.from(value);
  const b = Buffer.from(TOKEN);
  return a.length === b.length && timingSafeEqual(a, b);
}

async function createDrop(event) {
  const body = parse(event);
  const zone = cleanZone(body.zone);
  const now = Date.now();
  const id = randomUUID();

  const { Attributes } = await ddb.send(new UpdateCommand({
    TableName: TABLE,
    Key: META,
    UpdateExpression: zone ? 'ADD #c :one, places :z' : 'ADD #c :one',
    ExpressionAttributeNames: { '#c': 'count' },
    ExpressionAttributeValues: zone ? { ':one': 1, ':z': new Set([zone]) } : { ':one': 1 },
    ReturnValues: 'UPDATED_NEW'
  }));
  const n = Attributes.count;
  const sk = `${String(now).padStart(15, '0')}#${id}`;

  await ddb.send(new PutCommand({ TableName: TABLE, Item: { pk: 'drop', sk: id, n, at: now, zone } }));
  await ddb.send(new PutCommand({ TableName: TABLE, Item: { pk: 'pending', sk, id, n, at: now, place: placeName(zone) } }));

  metric('DropCreated', 1, 'Count', { zone });
  return reply(201, { id, n });
}

async function readDrop(id) {
  if (!/^[0-9a-f-]{36}$/.test(id)) return reply(400, { error: 'bad id' });
  const { Item } = await ddb.send(new GetCommand({ TableName: TABLE, Key: { pk: 'drop', sk: id } }));
  if (!Item) return reply(404, { error: 'not found' });
  return reply(200, { n: Item.n, at: Item.at, landedAt: Item.landedAt || 0, landedMs: Item.landedMs ?? -1 });
}

async function readSky() {
  const [meta, phone] = await Promise.all([
    ddb.send(new GetCommand({ TableName: TABLE, Key: META })),
    ddb.send(new GetCommand({ TableName: TABLE, Key: PHONE }))
  ]);
  const now = Date.now();
  const p = phone.Item;
  return reply(200, {
    now,
    count: meta.Item?.count || 0,
    places: meta.Item?.places ? meta.Item.places.size : 0,
    lastLandedAt: meta.Item?.lastLandedAt || 0,
    phone: p
      ? {
          online: now - p.lastSeen < ONLINE_MS,
          battery: p.battery,
          charging: p.charging,
          lastSeen: p.lastSeen
        }
      : null
  });
}

async function markLanded(item, now) {
  try {
    const { Attributes } = await ddb.send(new UpdateCommand({
      TableName: TABLE,
      Key: { pk: 'drop', sk: String(item.id) },
      UpdateExpression: 'SET landedAt = :now, landedMs = :now - #at',
      ConditionExpression: 'attribute_exists(pk) AND attribute_not_exists(landedAt)',
      ExpressionAttributeNames: { '#at': 'at' },
      ExpressionAttributeValues: { ':now': now },
      ReturnValues: 'ALL_NEW'
    }));
    metric('DropLanded', Attributes.landedMs, 'Milliseconds');
  } catch (err) {
    /* the phone may report a delivery twice after a failed response */
    if (err.name !== 'ConditionalCheckFailedException') throw err;
  }
  await ddb.send(new DeleteCommand({ TableName: TABLE, Key: { pk: 'pending', sk: String(item.sk) } }));
}

async function phoneCall(event) {
  const body = parse(event);
  if (!validToken(body.token)) return reply(401, { error: 'unauthorized' });

  const now = Date.now();
  const landed = Array.isArray(body.landed) ? body.landed.slice(0, 5) : [];

  if (landed.length) {
    await Promise.all(landed.map((item) => markLanded(item, now)));
    await ddb.send(new UpdateCommand({
      TableName: TABLE,
      Key: META,
      UpdateExpression: 'SET lastLandedAt = :now',
      ExpressionAttributeValues: { ':now': now }
    }));
  }

  if (body.beat) {
    const battery = Number.isFinite(body.battery) ? Math.max(-1, Math.min(100, Math.round(body.battery))) : -1;
    await ddb.send(new PutCommand({
      TableName: TABLE,
      Item: {
        ...PHONE,
        battery,
        charging: body.charging === true,
        network: String(body.network || '').slice(0, 16),
        uptimeMs: Number(body.uptimeMs) || 0,
        lastSeen: now
      }
    }));
    metric('PhoneBeat', 1, 'Count', { battery });
  }

  const [pending, meta] = await Promise.all([
    ddb.send(new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: 'pk = :p',
      ExpressionAttributeValues: { ':p': 'pending' },
      Limit: 5
    })),
    ddb.send(new GetCommand({ TableName: TABLE, Key: META }))
  ]);

  return reply(200, {
    now,
    count: meta.Item?.count || 0,
    pending: (pending.Items || []).map((d) => ({ id: d.id, sk: d.sk, n: d.n, place: d.place }))
  });
}

export const handler = async (event) => {
  const method = event.requestContext?.http?.method || 'GET';
  const path = event.rawPath || '/';

  if (method === 'OPTIONS') return { statusCode: 204, headers: HEADERS };

  try {
    if (method === 'GET' && path === '/api/health') return reply(200, { ok: true });
    if (method === 'GET' && path === '/api/sky') return await readSky();
    if (method === 'POST' && path === '/api/drop') return await createDrop(event);
    if (method === 'GET' && path.startsWith('/api/drop/')) return await readDrop(path.slice('/api/drop/'.length));
    if (method === 'POST' && path === '/api/phone') return await phoneCall(event);
    return reply(404, { error: 'not found' });
  } catch (err) {
    console.error(JSON.stringify({ level: 'error', name: err.name, message: err.message, path }));
    metric('ApiError');
    return reply(500, { error: 'internal' });
  }
};
