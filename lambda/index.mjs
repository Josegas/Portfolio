/* portfolio-api
   Every visitor can let go of a drop. The drop waits in DynamoDB until the
   real phone asks for it, lands on its screen, and reports back.

   POST /api/drop        public    create a drop
   GET  /api/drop/{id}   public    has it landed yet?
   GET  /api/photo/{id}  public    the real photo of a landed drop
   GET  /api/sky         public    counters, recent drops and phone status
   POST /api/phone       token     heartbeat, deliveries and pending drops
   POST /api/camera      token     photographs the phone when a drop lands
   POST /api/reps        token     records practice that was really done
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
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID, timingSafeEqual } from 'node:crypto';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true }
});

const s3 = new S3Client({});

const TABLE = process.env.TABLE;
const BUCKET = process.env.BUCKET;
const TOKEN = process.env.PHONE_TOKEN || '';
const ALLOW = process.env.ALLOWED_ORIGIN || '*';
const ONLINE_MS = 30000;
const SHOT_MAX_AGE_MS = 25000;
const PHOTO_MAX_BYTES = 1200000;
const ID = /^[0-9a-f-]{36}$/;
const KINDS = ['push', 'guitar', 'aws'];
const META = { pk: 'meta', sk: 'sky' };
const PHONE = { pk: 'meta', sk: 'phone' };
const CAMERA = { pk: 'meta', sk: 'camera' };

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
  const started = Date.now();
  const body = parse(event);
  const zone = cleanZone(body.zone);
  const place = placeName(zone);
  const kind = KINDS.includes(body.kind) ? body.kind : 'push';
  const now = Date.now();
  const id = randomUUID();

  const dbStart = Date.now();
  const { Attributes } = await ddb.send(new UpdateCommand({
    TableName: TABLE,
    Key: META,
    UpdateExpression: zone ? 'ADD #c :one, #o :one, places :z' : 'ADD #c :one, #o :one',
    ExpressionAttributeNames: { '#c': 'count', '#o': `owed_${kind}` },
    ExpressionAttributeValues: zone ? { ':one': 1, ':z': new Set([zone]) } : { ':one': 1 },
    ReturnValues: 'UPDATED_NEW'
  }));
  const n = Attributes.count;
  const stamp = String(now).padStart(15, '0');

  await Promise.all([
    ddb.send(new PutCommand({ TableName: TABLE, Item: { pk: 'drop', sk: id, n, at: now, zone, kind } })),
    ddb.send(new PutCommand({ TableName: TABLE, Item: { pk: 'pending', sk: `${stamp}#${id}`, id, n, at: now, place, kind } })),
    ddb.send(new PutCommand({ TableName: TABLE, Item: { pk: 'recent', sk: `${stamp}#${id}`, n, at: now, place, kind } }))
  ]);
  const dynamoMs = Date.now() - dbStart;

  metric('DropCreated', 1, 'Count', { zone, kind });
  return reply(201, { id, n, kind, timing: { lambdaMs: Date.now() - started, dynamoMs } });
}

async function readDrop(id) {
  if (!ID.test(id)) return reply(400, { error: 'bad id' });
  const { Item } = await ddb.send(new GetCommand({ TableName: TABLE, Key: { pk: 'drop', sk: id } }));
  if (!Item) return reply(404, { error: 'not found' });
  return reply(200, {
    n: Item.n,
    at: Item.at,
    landedAt: Item.landedAt || 0,
    landedMs: Item.landedMs ?? -1,
    photo: Item.photo === true
  });
}

async function readPhoto(id) {
  if (!ID.test(id)) return reply(400, { error: 'bad id' });
  try {
    const { Body } = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: `drops/${id}.jpg` }));
    const bytes = await Body.transformToByteArray();
    return {
      statusCode: 200,
      isBase64Encoded: true,
      headers: {
        'content-type': 'image/jpeg',
        'cache-control': 'public, max-age=31536000, immutable',
        'access-control-allow-origin': ALLOW
      },
      body: Buffer.from(bytes).toString('base64')
    };
  } catch (err) {
    /* without ListBucket, S3 answers AccessDenied for a key that does not exist */
    if (err.name === 'NoSuchKey' || err.name === 'AccessDenied') return reply(404, { error: 'not found' });
    throw err;
  }
}

function repsOf(meta) {
  const out = {};
  for (const k of KINDS) out[k] = { owed: meta?.[`owed_${k}`] || 0, done: meta?.[`done_${k}`] || 0 };
  return out;
}

async function readSky() {
  const [meta, phone, camera, recent] = await Promise.all([
    ddb.send(new GetCommand({ TableName: TABLE, Key: META })),
    ddb.send(new GetCommand({ TableName: TABLE, Key: PHONE })),
    ddb.send(new GetCommand({ TableName: TABLE, Key: CAMERA })),
    ddb.send(new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: 'pk = :p',
      ExpressionAttributeValues: { ':p': 'recent' },
      ScanIndexForward: false,
      Limit: 5
    }))
  ]);
  const now = Date.now();
  const p = phone.Item;
  return reply(200, {
    now,
    count: meta.Item?.count || 0,
    places: meta.Item?.places ? meta.Item.places.size : 0,
    blocked: meta.Item?.blocked || 0,
    reps: repsOf(meta.Item),
    lastLandedAt: meta.Item?.lastLandedAt || 0,
    lastPhoto: meta.Item?.lastPhoto || null,
    cameraOnline: !!camera.Item && now - camera.Item.lastSeen < ONLINE_MS,
    recent: (recent.Items || []).map((d) => ({ n: d.n, at: d.at, place: d.place, kind: d.kind })),
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

async function markLanded(item, now, cameraOn) {
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
    if (cameraOn) {
      await ddb.send(new PutCommand({
        TableName: TABLE,
        Item: { pk: 'shot', sk: String(item.id), n: Attributes.n, place: placeName(Attributes.zone || ''), at: now }
      }));
    }
  } catch (err) {
    /* the phone may report a delivery twice after a failed response */
    if (err.name !== 'ConditionalCheckFailedException') throw err;
  }
  await ddb.send(new DeleteCommand({ TableName: TABLE, Key: { pk: 'pending', sk: String(item.sk) } }));
}

async function reject() {
  metric('TokenRejected');
  const { Attributes } = await ddb.send(new UpdateCommand({
    TableName: TABLE,
    Key: META,
    UpdateExpression: 'ADD blocked :one',
    ExpressionAttributeValues: { ':one': 1 },
    ReturnValues: 'UPDATED_NEW'
  }));
  return reply(401, { error: 'unauthorized', blocked: Attributes.blocked });
}

async function phoneCall(event) {
  const body = parse(event);
  if (!validToken(body.token)) return reject();

  const now = Date.now();
  const landed = Array.isArray(body.landed) ? body.landed.slice(0, 5) : [];

  if (landed.length) {
    const camera = await ddb.send(new GetCommand({ TableName: TABLE, Key: CAMERA }));
    const cameraOn = !!camera.Item && now - camera.Item.lastSeen < ONLINE_MS;
    await Promise.all(landed.map((item) => markLanded(item, now, cameraOn)));
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
    pending: (pending.Items || []).map((d) => ({ id: d.id, sk: d.sk, n: d.n, place: d.place, kind: d.kind }))
  });
}

async function repsCall(event) {
  const body = parse(event);
  if (!validToken(body.token)) return reject();
  const n = body.n;
  if (!KINDS.includes(body.kind) || !Number.isInteger(n) || n < 1 || n > 100) {
    return reply(400, { error: 'bad reps' });
  }
  const { Attributes } = await ddb.send(new UpdateCommand({
    TableName: TABLE,
    Key: META,
    UpdateExpression: 'ADD #d :n',
    ExpressionAttributeNames: { '#d': `done_${body.kind}` },
    ExpressionAttributeValues: { ':n': n },
    ReturnValues: 'ALL_NEW'
  }));
  metric('RepsDone', n, 'Count', { kind: body.kind });
  return reply(200, { reps: repsOf(Attributes) });
}

async function cameraCall(event) {
  const body = parse(event);
  if (!validToken(body.token)) return reject();

  const now = Date.now();
  await ddb.send(new PutCommand({ TableName: TABLE, Item: { ...CAMERA, lastSeen: now } }));

  if (body.photo && ID.test(String(body.photo.id))) {
    const id = String(body.photo.id);
    const jpeg = Buffer.from(String(body.photo.jpeg || ''), 'base64');
    const isJpeg = jpeg.length > 3 && jpeg[0] === 0xff && jpeg[1] === 0xd8;
    if (!isJpeg || jpeg.length > PHOTO_MAX_BYTES) return reply(400, { error: 'bad photo' });

    await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: `drops/${id}.jpg`, Body: jpeg, ContentType: 'image/jpeg' }));
    const { Attributes } = await ddb.send(new UpdateCommand({
      TableName: TABLE,
      Key: { pk: 'drop', sk: id },
      UpdateExpression: 'SET photo = :t',
      ConditionExpression: 'attribute_exists(pk)',
      ExpressionAttributeValues: { ':t': true },
      ReturnValues: 'ALL_NEW'
    }));
    await Promise.all([
      ddb.send(new UpdateCommand({
        TableName: TABLE,
        Key: META,
        UpdateExpression: 'SET lastPhoto = :p',
        ExpressionAttributeValues: { ':p': { id, n: Attributes.n, at: now, place: placeName(Attributes.zone || '') } }
      })),
      ddb.send(new DeleteCommand({ TableName: TABLE, Key: { pk: 'shot', sk: id } }))
    ]);
    metric('PhotoTaken');
  }

  const { Items = [] } = await ddb.send(new QueryCommand({
    TableName: TABLE,
    KeyConditionExpression: 'pk = :p',
    ExpressionAttributeValues: { ':p': 'shot' },
    Limit: 3
  }));
  const fresh = Items.filter((d) => now - d.at < SHOT_MAX_AGE_MS);
  const stale = Items.filter((d) => now - d.at >= SHOT_MAX_AGE_MS);
  await Promise.all(stale.map((d) => ddb.send(new DeleteCommand({ TableName: TABLE, Key: { pk: 'shot', sk: d.sk } }))));

  return reply(200, { now, shots: fresh.map((d) => ({ id: d.sk, n: d.n, place: d.place })) });
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
    if (method === 'POST' && path === '/api/camera') return await cameraCall(event);
    if (method === 'POST' && path === '/api/reps') return await repsCall(event);
    if (method === 'GET' && path.startsWith('/api/photo/')) return await readPhoto(path.slice('/api/photo/'.length));
    return reply(404, { error: 'not found' });
  } catch (err) {
    console.error(JSON.stringify({ level: 'error', name: err.name, message: err.message, path }));
    metric('ApiError');
    return reply(500, { error: 'internal' });
  }
};
