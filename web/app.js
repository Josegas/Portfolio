/* Page runtime: language, the day that follows the scroll, and the drop. */
(function () {
  'use strict';

  var API = String((window.PORTFOLIO && window.PORTFOLIO.api) || '').replace(/\/+$/, '');
  var PREVIEW = !API;
  var $ = function (id) { return document.getElementById(id); };

  /* language ---------------------------------------------------------- */
  var ES = {
    skip: 'Saltar al contenido',
    navAbout: 'Sobre mí', navSkills: 'Habilidades', navProjects: 'Proyectos', navDrop: 'Tu gota', navContact: 'Contacto',
    heroLead: 'Estudiante de Ingeniería en Sistemas, especializado en cómputo en la nube, seguridad en la nube e infraestructura en AWS.',
    heroSub: 'Disponible para empleos, prácticas y colaboraciones.',
    heroCta: 'Ver mis proyectos',
    heroCta2: 'Deja tu gota',
    heroHint: 'Nadie ha tocado la nube. Inténtalo.',
    aboutTitle: 'Construyo soluciones seguras y escalables en la nube.',
    about1: 'Curso el noveno semestre de Ingeniería en Sistemas en el Instituto Tecnológico de Culiacán, enfocado en arquitectura en la nube, seguridad en la nube e infraestructura en AWS.',
    about2: 'Me interesan SecOps, DevSecOps y el diseño de sistemas, y aprendo con laboratorios prácticos y proyectos reales: aplicaciones serverless, flujos de datos y agentes de IA desplegados en AWS.',
    about3: 'Entré a tecnología porque podemos crear casi cualquier cosa para resolver una necesidad real. Me quedé por la nube: no se puede tocar y, aun así, casi todo lo que nos rodea se apoya en ella.',
    aboutOff: 'Fuera de la pantalla: Real Madrid, The Beatles, Luis Miguel, Michael Jackson, guitarra, anime y entrenar. Y mi familia, antes que todo.',
    focusTitle: 'En qué me enfoco',
    f1: 'Arquitectura en la nube con AWS', f2: 'IAM y seguridad en la nube', f3: 'VPC e infraestructura',
    f4: 'SecOps y DevSecOps', f5: 'Diseño de sistemas', f6: 'Operaciones de datos',
    where: 'Radico en Culiacán, México. Español e inglés (B2).',
    skillsTitle: 'Superpoderes técnicos',
    skillsIntro: 'Tecnologías que he usado en proyectos reales.',
    cSec: 'Seguridad', cSecV: 'IAM, VPC, mínimo privilegio, servicios de seguridad de AWS',
    cIac: 'Infraestructura como código', cOps: 'Automatización y herramientas', cCode: 'Programación',
    cFw: 'Frameworks', cData: 'Datos e IA',
    cDocs: 'Análisis', cDocsV: 'Requisitos, casos de uso, diagramas, documentación técnica',
    cLang: 'Idiomas', cLangV: 'Español, inglés B2',
    projectsTitle: 'Proyectos',
    live: 'Sitio en vivo', code: 'Código', try: 'Pruébalo',
    p0: 'Este portafolio. Un sistema IoT serverless en AWS: la gota de cada visitante viaja por una API hasta un teléfono real de 2014, y una cola la guarda mientras el teléfono está apagado.',
    p0r: 'Proyecto individual: arquitectura, despliegue y cliente del teléfono.',
    p1: 'Mapa de tiempos a pie hacia refugios frescos para adultos mayores en tres ciudades de México, construido con datos abiertos en AWS y aprovisionado con Terraform.',
    p1r: 'Proyecto individual: flujo de datos, infraestructura y mapa.',
    p2: 'Agente de IA en AWS que le dice a las familias hasta qué hora la comida cocinada es segura. Decide un motor de reglas probado, y el modelo solo explica.',
    p2r: 'Proyecto individual: agente, motor de reglas, infraestructura y CI.',
    p3: 'Sistema logístico para empresas con varias sucursales: registra, asigna y rastrea envíos desde su origen hasta su destino.',
    p3r: 'Proyecto en equipo. Mi parte: requisitos, casos de uso, diagramas y documentación.',
    p4: 'Plataforma web y móvil que conecta a pacientes con una red de farmacias para completar una receta entre varias de ellas.',
    p4r: 'Proyecto en equipo. Mi parte: la devolución de medicamentos a su farmacia de origen.',
    p5t: 'Reconstrucción hidrometeorológica',
    p5: 'Reconstruye valores faltantes en registros históricos de estaciones climatológicas de Sinaloa, comparando modelos estadísticos y de IA generativa con datos oficiales del SMN/CONAGUA.',
    p5r: 'Proyecto en pareja. Trabajé en las etapas 1 a 7: descarga, estructuración, limpieza y normalización de datos, división del dataset y tensores de PyTorch.',
    p6: 'Sistema de gestión para optimizar procesos administrativos, presentado en la Feria de Ingenierías.',
    p6r: 'Proyecto en equipo.',
    dropTitle: 'Toda nube está hecha de gotas. Deja la tuya.',
    drop1: 'Este teléfono es real. Es de 2014, está en mi cuarto en Culiacán y su pantalla es un pedacito de este cielo. Suelta una gota y caerá ahí, en el mundo real, estés donde estés.',
    dropBtn: 'Soltar una gota',
    phoneCap: 'Este es el teléfono real. Su pantalla aquí refleja la que está en mi cuarto.',
    dropFine: 'Sin cuentas y sin cookies. Solo guardo el número de la gota, su hora y tu zona horaria.',
    howTitle: 'Cómo corre este sitio en AWS',
    howPath: 'El camino de una gota',
    h1: 'AWS Amplify sirve esta página, y tu navegador llama a un endpoint de API Gateway.',
    h2: 'Una función Lambda cuenta la gota y la guarda en una cola en DynamoDB.',
    h3: 'El teléfono pide las gotas pendientes cada 3 segundos, las recibe y confirma la entrega.',
    h4: 'CloudWatch registra cada paso, con un panel y una alarma de errores.',
    howSec: 'Decisiones de seguridad',
    s1: 'El rol de Lambda solo alcanza una tabla de DynamoDB y sus propios logs.',
    s2: 'El teléfono se autentica con un token que nunca llega al repositorio.',
    s3: 'La API admite 20 peticiones por segundo y valida cada entrada.',
    s4: 'Un usuario de IAM dedicado, sin permisos de administrador, despliega el proyecto.',
    contactTitle: 'Trabajemos juntos.',
    contact1: 'Disponible para empleos, prácticas y colaboraciones en nube, seguridad y software.',
    foot: 'Tu dispositivo pinta este cielo en vivo. Alojado en AWS Amplify, con API Gateway, Lambda, DynamoDB y CloudWatch.',
    footCode: 'Código fuente'
  };
  var MSG = {
    en: {
      awake: 'The phone is awake. Battery {b}%, last heard {t}.',
      awakeNoBat: 'The phone is awake. Last heard {t}.',
      asleep: 'The phone is asleep. Last heard {t}. Your drop will wait for it.',
      never: 'The phone hasn\'t woken up yet. Your drop will wait for it.',
      preview: 'Preview: the phone is simulated on this page.',
      falling: 'Falling toward Culiacán.',
      waiting: 'Drop {n} is waiting. It lands as soon as the phone wakes up.',
      landed: 'Drop {n} landed in Culiacán after {s} s. It is part of this cloud now.',
      left: 'Drop {n} is already in the cloud. Thank you.',
      failed: 'The drop did not reach AWS. Check your connection and let go of another one.',
      count: '{n} drops from {p} places so far.',
      countPlace: '{n} drops from one place so far.',
      countOne: 'The first drop has fallen.',
      first: 'This cloud is waiting for its first drop.',
      again: 'Let go of another',
      seconds: '{n} s ago', minutes: '{n} min ago', hours: '{n} h ago', days: '{n} d ago', now: 'just now'
    },
    es: {
      awake: 'El teléfono está despierto. Batería {b}%, reportó {t}.',
      awakeNoBat: 'El teléfono está despierto. Reportó {t}.',
      asleep: 'El teléfono está dormido. Reportó {t}. Tu gota lo esperará.',
      never: 'El teléfono aún no despierta. Tu gota lo esperará.',
      preview: 'Vista previa: el teléfono está simulado en esta página.',
      falling: 'Cayendo hacia Culiacán.',
      waiting: 'La gota {n} está esperando. Cae en cuanto el teléfono despierte.',
      landed: 'La gota {n} cayó en Culiacán después de {s} s. Ya es parte de esta nube.',
      left: 'La gota {n} ya está en la nube. Gracias.',
      failed: 'La gota no llegó a AWS. Revisa tu conexión y suelta otra.',
      count: '{n} gotas desde {p} lugares hasta ahora.',
      countPlace: '{n} gotas desde un lugar hasta ahora.',
      countOne: 'Ya cayó la primera gota.',
      first: 'Esta nube espera su primera gota.',
      again: 'Soltar otra',
      seconds: 'hace {n} s', minutes: 'hace {n} min', hours: 'hace {n} h', days: 'hace {n} d', now: 'justo ahora'
    }
  };
  var EN = {};
  Array.prototype.forEach.call(document.querySelectorAll('[data-t]'), function (el) { EN[el.getAttribute('data-t')] = el.textContent; });

  var lang = 'en';
  try { lang = localStorage.getItem('lang') || ''; } catch (e) { lang = ''; }
  if (!lang) lang = /^es/i.test(navigator.language || '') ? 'es' : 'en';

  function say(key, vars) {
    var s = MSG[lang][key];
    Object.keys(vars || {}).forEach(function (k) { s = s.split('{' + k + '}').join(vars[k]); });
    return s;
  }
  function setLang(next) {
    lang = next;
    document.documentElement.lang = lang;
    var d = lang === 'es' ? ES : EN;
    Array.prototype.forEach.call(document.querySelectorAll('[data-t]'), function (el) {
      var k = el.getAttribute('data-t');
      if (d[k] != null) el.textContent = d[k];
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-lang]'), function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang));
    });
    try { localStorage.setItem('lang', lang); } catch (e) { /* optional */ }
    renderStatus();
  }

  /* the sky follows the page ------------------------------------------- */
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var sky = null;
  try { sky = window.Sky && window.Sky($('sky')); } catch (e) { sky = null; }
  if (!sky) $('sky').style.display = 'none';

  /* each stop: section, time of day, how far the clouds sink, how much the scene dims for reading */
  var STOPS = [
    ['home', 0, 0, 0], ['about', .27, .95, .8], ['skills', .46, 1.15, .78],
    ['projects', .64, 1.2, .5], ['drop', .8, .34, .12], ['how', .88, 1, .5], ['contact', .985, .95, .42]
  ];
  var anchors = [];
  function measure() {
    anchors = STOPS.map(function (s) {
      var el = $(s[0]);
      return { y: el.offsetTop - innerHeight * .28, d: s[1], g: s[2], v: s[3] };
    });
    anchors[0].y = 0;
    var end = document.documentElement.scrollHeight - innerHeight;
    anchors[anchors.length - 1].y = Math.min(anchors[anchors.length - 1].y, end);
  }
  function ease(t) { return t * t * (3 - 2 * t); }
  var sections = ['about', 'skills', 'projects', 'drop', 'how', 'contact'];
  function onScroll() {
    var y = scrollY, a = anchors[0], b = anchors[anchors.length - 1], i;
    for (i = 0; i < anchors.length - 1; i++) {
      if (y >= anchors[i].y && y <= anchors[i + 1].y) { a = anchors[i]; b = anchors[i + 1]; break; }
    }
    if (y > anchors[anchors.length - 1].y) a = b = anchors[anchors.length - 1];
    var t = b.y > a.y ? ease((y - a.y) / (b.y - a.y)) : 0;
    if (sky) {
      sky.setDay(a.d + (b.d - a.d) * t);
      sky.setGrow(a.g + (b.g - a.g) * t);
      sky.setVeil(a.v + (b.v - a.v) * t);
      if (calm) sky.frame(20);
    }
    var dayNow = a.d + (b.d - a.d) * t;
    $('wires').style.opacity = Math.max(0, Math.min(1, (dayNow - .56) / .16));
    document.querySelector('.top').classList.toggle('solid', y > innerHeight * .6);
    var active = '';
    sections.forEach(function (id) { if ($(id).offsetTop - innerHeight * .4 <= y) active = id; });
    Array.prototype.forEach.call(document.querySelectorAll('.top nav a'), function (l) {
      l.classList.toggle('on', l.getAttribute('href') === '#' + active);
    });
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', function () { measure(); onScroll(); fitFall(); });

  /* touching the cloud */
  var lastTouch = 0, touched = 0;
  function feel(e) {
    var now = performance.now();
    if (!sky || now - lastTouch < 45) return;
    lastTouch = now;
    sky.touch(e.clientX, e.clientY);
    if (++touched === 14) $('touchHint').classList.add('done');
  }
  addEventListener('pointermove', feel, { passive: true });
  addEventListener('pointerdown', feel, { passive: true });

  /* the phone's screen: same water the real phone shows ----------------- */
  var screen = $('screen'), sc = screen.getContext('2d');
  var ripples = [], glints = [];
  (function () {
    var seed = 7;
    function r() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    for (var i = 0; i < 70; i++) glints.push({ x: r() * 360, y: r() * 420, s: .4 + r() * 1.1, p: r() * 6.3 });
  })();
  function paintScreen(now) {
    var g = sc.createLinearGradient(0, 0, 0, 640);
    g.addColorStop(0, '#040b28'); g.addColorStop(.46, '#0c2062'); g.addColorStop(1, '#2a4fb4');
    sc.fillStyle = g; sc.fillRect(0, 0, 360, 640);
    var i, p;
    for (i = 0; i < glints.length; i++) {
      p = glints[i];
      sc.globalAlpha = .35 + .35 * Math.sin(now / 900 + p.p);
      sc.fillStyle = '#dbe6ff';
      sc.fillRect(p.x, p.y, p.s, p.s);
    }
    sc.globalAlpha = 1;

    /* moonlight on the water */
    for (i = 0; i < 46; i++) {
      var ly = 300 + i * 7.4, wob = Math.sin(now / 520 + i * 1.7) * 9, half = 12 + (i * 1.15) + 7 * Math.sin(i * 2.3 + now / 800);
      sc.globalAlpha = .1 + .34 * Math.abs(Math.sin(i * 1.3 + now / 700));
      sc.fillStyle = '#c9d8ff';
      sc.fillRect(180 + wob - half, ly, half * 2, 1.7);
    }
    sc.globalAlpha = 1;
    for (i = ripples.length - 1; i >= 0; i--) {
      var w = ripples[i], age = (now - w.t) / 2600;
      if (age >= 1) { ripples.splice(i, 1); continue; }
      for (var k = 0; k < 3; k++) {
        var a = age - k * .08;
        if (a <= 0) continue;
        sc.beginPath();
        sc.ellipse(w.x, w.y, a * 230, a * 96, 0, 0, Math.PI * 2);
        sc.strokeStyle = 'rgba(190,212,255,' + (.8 * (1 - age) * (1 - k * .28)) + ')';
        sc.lineWidth = 2.4 - k * .5;
        sc.stroke();
      }
    }
    sc.fillStyle = 'rgba(255,255,255,.95)';
    sc.textAlign = 'center';
    sc.font = '500 62px "Shippori Mincho", serif';
    sc.fillText(sky2Line(), 180, 112);
    sc.font = '500 19px "Shippori Mincho", serif';
    sc.fillStyle = 'rgba(255,255,255,.7)';
    sc.fillText(lang === 'es' ? 'gotas en la nube' : 'drops in the cloud', 180, 146);
  }
  function sky2Line() { return state.count != null ? state.count.toLocaleString(lang) : ''; }
  function loopScreen(now) { paintScreen(now); requestAnimationFrame(loopScreen); }

  /* a drop falling across the viewport ---------------------------------- */
  var fall = $('fall'), fc = fall.getContext('2d');
  function fitFall() {
    var d = Math.min(devicePixelRatio || 1, 2);
    fall.width = innerWidth * d; fall.height = innerHeight * d;
    fc.setTransform(d, 0, 0, d, 0, 0);
  }
  function dropShape(x, y, s) {
    fc.beginPath();
    fc.moveTo(x, y - 15 * s);
    fc.bezierCurveTo(x + 2 * s, y - 8 * s, x + 8 * s, y - 2 * s, x + 8 * s, y + 4 * s);
    fc.arc(x, y + 4 * s, 8 * s, 0, Math.PI);
    fc.bezierCurveTo(x - 8 * s, y - 2 * s, x - 2 * s, y - 8 * s, x, y - 15 * s);
    var g = fc.createRadialGradient(x - 2.6 * s, y + 1 * s, .5, x, y + 4 * s, 10 * s);
    g.addColorStop(0, '#fff'); g.addColorStop(.55, '#bcd3ff'); g.addColorStop(1, '#6d92ff');
    fc.fillStyle = g; fc.fill();
  }
  function letFall(done) {
    var box = screen.getBoundingClientRect();
    var tx = box.left + box.width / 2, ty = box.top + box.height * .68;
    var x0 = Math.max(40, tx - innerWidth * .08), y0 = -30;
    if (calm) { done(); return; }
    var t0 = performance.now(), dur = 1150;
    (function step(now) {
      var t = Math.min(1, (now - t0) / dur), e = t * t;
      var x = x0 + (tx - x0) * t, y = y0 + (ty - y0) * e;
      fc.clearRect(0, 0, innerWidth, innerHeight);
      var trail = fc.createLinearGradient(x, y - 150 * e - 20, x, y);
      trail.addColorStop(0, 'rgba(180,205,255,0)'); trail.addColorStop(1, 'rgba(200,220,255,.55)');
      fc.strokeStyle = trail; fc.lineWidth = 2; fc.beginPath();
      fc.moveTo(x - (tx - x0) / dur * 150 * e, y - 150 * e - 20); fc.lineTo(x, y); fc.stroke();
      dropShape(x, y, 1.15);
      if (t < 1) { requestAnimationFrame(step); return; }
      fc.clearRect(0, 0, innerWidth, innerHeight);
      done();
    })(t0);
  }
  function land() {
    ripples.push({ x: 180, y: 430, t: performance.now() });
    var p = $('phone');
    p.classList.add('hit');
    setTimeout(function () { p.classList.remove('hit'); }, 650);
  }

  /* state and the API ---------------------------------------------------- */
  var state = { count: null, places: null, phone: null, skew: 0, offset: 0, seenRecent: 0 };
  function ago(ts) {
    var s = Math.max(0, Math.round((Date.now() + state.skew - ts) / 1000));
    if (s < 8) return say('now');
    if (s < 60) return say('seconds', { n: s });
    if (s < 3600) return say('minutes', { n: Math.round(s / 60) });
    if (s < 86400) return say('hours', { n: Math.round(s / 3600) });
    return say('days', { n: Math.round(s / 86400) });
  }
  function renderStatus() {
    var el = $('status'), cap = $('caption'), p = state.phone;
    if (!el) return;
    var txt, awake = false;
    if (PREVIEW) txt = say('preview');
    else if (!p || !p.lastSeen) txt = say('never');
    else if (p.online) {
      awake = true;
      txt = p.battery >= 0 ? say('awake', { b: p.battery, t: ago(p.lastSeen) }) : say('awakeNoBat', { t: ago(p.lastSeen) });
    } else txt = say('asleep', { t: ago(p.lastSeen) });
    el.className = 'status' + (awake ? ' awake' : '');
    el.innerHTML = '<i aria-hidden="true"></i>';
    el.appendChild(document.createTextNode(txt));
    cap.textContent = state.count == null ? '' : state.count === 0 ? say('first') :
      say(state.count === 1 ? 'countOne' : (state.places || 0) <= 1 ? 'countPlace' : 'count', { n: state.count.toLocaleString(lang), p: (state.places || 1).toLocaleString(lang) });
    if (sky && state.count != null) sky.setMass(Math.log(1 + state.count) / Math.log(10));
  }
  function refresh() {
    if (PREVIEW) {
      if (state.count == null) { state.count = 128; state.places = 23; }
      renderStatus();
      return;
    }
    fetch(API + '/api/sky', { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (d) {
      state.skew = (d.now || Date.now()) - Date.now();
      state.count = d.count; state.places = d.places; state.phone = d.phone;
      if (state.seenRecent && d.lastLandedAt > state.seenRecent) land();
      state.seenRecent = d.lastLandedAt || state.seenRecent;
      renderStatus();
    }).catch(function () { renderStatus(); });
  }

  function zone() {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { return ''; }
  }
  function waitForLanding(id, n, t0) {
    var tries = 0;
    (function poll() {
      fetch(API + '/api/drop/' + encodeURIComponent(id), { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (d) {
        if (d.landedAt) {
          land();
          $('result').textContent = say('landed', { n: n.toLocaleString(lang), s: (Math.max(d.landedMs, 0) / 1000).toFixed(1) });
          refresh();
          return;
        }
        if (++tries < 8) setTimeout(poll, 1500);
        else $('result').textContent = say('waiting', { n: n.toLocaleString(lang) });
      }).catch(function () {
        $('result').textContent = say('waiting', { n: n.toLocaleString(lang) });
      });
    })();
  }

  var btn = $('release');
  btn.addEventListener('click', function () {
    btn.disabled = true;
    $('result').textContent = say('falling');
    var finish = function () { setTimeout(function () { btn.disabled = false; btn.textContent = say('again'); }, 1800); };

    if (PREVIEW) {
      letFall(function () {
        land();
        state.count += 1;
        renderStatus();
        $('result').textContent = say('landed', { n: state.count.toLocaleString(lang), s: '1.8' });
        finish();
      });
      return;
    }
    var sent = fetch(API + '/api/drop', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ zone: zone(), lang: lang })
    }).then(function (r) { if (!r.ok) throw new Error('drop'); return r.json(); });

    letFall(function () {
      sent.then(function (d) {
        state.count = d.n; renderStatus();
        if (state.phone && state.phone.online) {
          land();
          $('result').textContent = say('falling');
          waitForLanding(d.id, d.n);
        } else {
          $('result').textContent = say('waiting', { n: d.n.toLocaleString(lang) });
        }
        finish();
      }).catch(function () {
        $('result').textContent = say('failed');
        finish();
      });
    });
  });

  /* start ------------------------------------------------------------------ */
  Array.prototype.forEach.call(document.querySelectorAll('[data-lang]'), function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  fitFall();
  measure();
  setLang(lang);
  onScroll();
  refresh();
  setInterval(refresh, 10000);
  requestAnimationFrame(loopScreen);
  if (sky) { if (calm) sky.frame(20); else sky.start(); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  addEventListener('load', function () { measure(); onScroll(); });
})();
