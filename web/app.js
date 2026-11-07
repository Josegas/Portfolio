/* Page runtime: language, the day that follows the scroll, and the drop. */
(function () {
  'use strict';

  var API = String((window.PORTFOLIO && window.PORTFOLIO.api) || '').replace(/\/+$/, '');
  var $ = function (id) { return document.getElementById(id); };
  var all = function (q) { return Array.prototype.slice.call(document.querySelectorAll(q)); };

  /* language ---------------------------------------------------------- */
  var ES = {
    skip: 'Saltar al contenido',
    navAbout: 'Sobre mí', navSkills: 'Habilidades', navProjects: 'Proyectos', navDrop: 'Tu gota', navContact: 'Contacto',
    heroLead: 'Estudiante de Ingeniería en Sistemas, especializado en cómputo en la nube, seguridad en la nube e infraestructura en AWS.',
    heroSub: 'Disponible para empleos, prácticas y colaboraciones.',
    heroCta: 'Ver mis proyectos',
    heroCta2: 'Soltar una gota',
    aboutTitle: 'Construyo soluciones seguras y escalables en la nube.',
    about1: 'Curso el noveno semestre de Ingeniería en Sistemas en el Instituto Tecnológico de Culiacán, enfocado en arquitectura en la nube, seguridad en la nube e infraestructura en AWS.',
    about2: 'Me interesan SecOps, DevSecOps y el diseño de sistemas, y aprendo con laboratorios prácticos y proyectos reales: aplicaciones serverless, flujos de datos y agentes de IA desplegados en AWS.',
    about3: 'Entré a tecnología porque podemos crear casi cualquier cosa para resolver una necesidad real. Me quedé por la nube: no se puede tocar y, aun así, casi todo lo que nos rodea se apoya en ella.',
    focusTitle: 'En qué me enfoco',
    f1: 'Arquitectura en la nube con AWS', f2: 'IAM y seguridad en la nube', f3: 'VPC e infraestructura',
    f4: 'SecOps y DevSecOps', f5: 'Diseño de sistemas', f6: 'Operaciones de datos',
    where: 'Radico en Culiacán, México. Español e inglés (B2).',
    skillsTitle: 'Superpoderes técnicos',
    skillsIntro: 'Las tecnologías con las que trabajo.',
    cSec: 'Seguridad', cSecV: 'IAM, VPC, mínimo privilegio, servicios de seguridad de AWS',
    cIac: 'Infraestructura como código', cOps: 'Automatización y herramientas', cCode: 'Programación',
    cFw: 'Frameworks', cData: 'Datos e IA',
    cDocs: 'Análisis', cDocsV: 'Requisitos, casos de uso, diagramas, documentación técnica',
    cLang: 'Idiomas', cLangV: 'Español, inglés B2',
    projectsTitle: 'Proyectos',
    live: 'Sitio en vivo', code: 'Código', try: 'Pruébalo',
    m0: '6 de 6', m0t: 'gotas cayeron en el teléfono real después de esperar hasta 64 minutos en la cola',
    m1t: 'adultos mayores en Culiacán viven a más de 15 minutos a pie de un refugio fresco',
    m2: '0 inseguras', m2t: 'respuestas en 26 preguntas públicas reales, contra 2 en la primera prueba',
    p0: 'Este portafolio. Un sistema IoT serverless en AWS: la gota de cada visitante viaja por una API hasta un teléfono real de 2015, y una cola la guarda mientras el teléfono está apagado.',
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
    drop1: 'Este teléfono es real. Es un LG de 2015, está en mi cuarto en Culiacán y su pantalla es un pedacito de este cielo. Suelta una gota y caerá ahí, en el mundo real, estés donde estés.',
    dropBtn: 'Soltar una gota',
    pickTitle: 'Cada gota me pone a practicar. ¿Qué me pides?',
    kPush: '1 lagartija', kGuitar: '1 minuto de guitarra', kAws: '1 minuto de AWS',
    meTitle: 'Cuando cierro la laptop',
    meIntro: 'Esta es la persona detrás de los proyectos.',
    t1: 'Amo al Real Madrid y a Cristiano Ronaldo. La playera de la imagen no es casualidad.',
    tMusic: 'Música', t2: 'The Beatles, Luis Miguel y Michael Jackson viven en mis audífonos, y estoy aprendiendo guitarra.',
    t3: 'Naruto, Death Note, Dragon Ball y Supercampeones. Por eso este cielo parece de película.',
    tGames: 'Videojuegos', t4: 'FIFA y Fortnite son mi forma de desconectarme.',
    tTrain: 'Entrenar', t5: 'Me gusta cuidar mi cuerpo. Si arriba pediste una lagartija, la hago de verdad.',
    tFamily: 'Familia', t6: 'Amo a mi familia y haría todo por ellos.',
    phoneCap: 'Este es el teléfono real. Su pantalla aquí refleja la que está en mi cuarto.',
    realCap: 'Grabado en mi cuarto: las gotas 4 y 5 cayendo en el teléfono real. Medido ahí, una gota tarda de 5 a 9 segundos en llegar.',
    dropFine: 'Sin cuentas y sin cookies. Solo guardo el número de la gota, su hora y tu zona horaria. Cuando la cámara está encendida, fotografía la pantalla del teléfono al caer una gota, y cada foto se borra a los 30 días.',
    howTitle: 'Cómo corre este sitio en AWS',
    howIntro: 'Este diagrama está vivo. Cada número sale de tu propia gota.',
    n1: 'Tu navegador', n1t: 'Servido por AWS Amplify',
    n2t: 'HTTPS con límite de peticiones',
    n3t: 'Cuenta la gota y la pone en cola',
    n4t: 'Guarda la cola',
    n5: 'LG en Culiacán', n5t: 'Pide gotas cada 3 segundos',
    n6t: 'Guarda la foto real',
    traceBtn: 'Enviar una gota por aquí',
    traceWatch: 'CloudWatch registra cada paso, con un panel y una alarma de errores.',
    howSec: 'Decisiones de seguridad',
    s1: 'El rol de Lambda solo alcanza una tabla de DynamoDB, una carpeta de S3 y sus propios logs.',
    s2: 'El teléfono y la cámara se autentican con un token que nunca llega al repositorio.',
    s3: 'El bucket de fotos es privado, está cifrado y bloquea todo acceso público.',
    s4: 'La API admite 20 peticiones por segundo y valida cada entrada.',
    s5: 'Un usuario de IAM dedicado, sin permisos de administrador, despliega el proyecto.',
    policyBtn: 'Ver la política IAM real',
    tryTitle: 'Intenta hacerte pasar por el teléfono',
    tryText: 'Envía a la API una petición falsa como si fueras mi LG. Es una llamada real y pasa por la misma revisión que el teléfono.',
    tryBtn: 'Enviar petición falsa',
    contactTitle: 'Trabajemos juntos.',
    contact1: 'Disponible para empleos, prácticas y colaboraciones en nube, seguridad y software.',
    foot: 'Tu dispositivo pinta este cielo en vivo. Alojado en AWS Amplify, con API Gateway, Lambda, DynamoDB, S3 y CloudWatch.',
    footCode: 'Código fuente'
  };
  var MSG = {
    en: {
      awake: 'The phone is awake. Battery {b}%, last heard {t}.',
      awakeNoBat: 'The phone is awake. Last heard {t}.',
      asleep: 'The phone is asleep. Last heard {t}. Your drop will wait for it.',
      never: 'The phone hasn\'t woken up yet. Your drop will wait for it.',
      falling: 'Falling toward Culiacán.',
      reached: 'It reached AWS in {ms} ms. Now it is waiting for the phone in Culiacán.',
      secretsCount: 'Hidden in this sky: {n} of 5',
      secretsHint: 'Five things are hidden across the day. Look up, touch what catches your eye and keep scrolling.',
      secretsDone: 'You found all five. One last thing I believe: if I practice, I can.',
      sec_cloud: 'You touched the cloud, and it moved.',
      sec_sun: 'This sun is code. There are no images or video in this sky: your device paints all of it.',
      sec_plane: 'You caught the plane. It crosses the sky every 95 seconds, and it is easy to miss.',
      sec_cables: 'The cloud is not in the sky. It runs through cables like these, all the way to my room.',
      sec_moon: 'This moonlight is the same one you see on the water of my phone.',
      waiting: 'Drop {n} is waiting for the phone to wake up. I already owe you {ask}.',
      landed: 'Drop {n} landed in Culiacán after {s} s. I owe you {ask}.',
      failed: 'The drop did not reach AWS. Check your connection and let go of another one.',
      count: '{n} drops from {p} places so far.',
      countPlace: '{n} drops from one place so far.',
      countOne: 'The first drop has fallen.',
      first: 'This cloud is waiting for its first drop.',
      hero: 'This cloud holds {n} drops. Touch it.',
      heroOne: 'This cloud holds 1 drop. Touch it.',
      heroZero: 'Nobody has ever touched the cloud. Try it.',
      again: 'Let go of another',
      dockCount: '{n} drops', dockOne: '1 drop', dockZero: 'Let go of a drop',
      dockAwake: 'The real phone is awake', dockAsleep: 'The real phone is asleep',
      fellFrom: 'A drop just fell from {p}.', fell: 'A drop just fell.',
      yours: 'This is your drop, photographed in my room seconds ago.',
      lastPhoto: 'Last photo of a real drop: number {n}{from}, {t}.',
      from: ' from {p}',
      askpush: 'one push-up', askguitar: 'one minute of guitar', askaws: 'one minute of AWS',
      repspush: 'push-ups', repsguitar: 'minutes of guitar', repsaws: 'minutes of AWS',
      repsDone: '{d} of {o} done',
      soundOn: 'Sound on', soundOff: 'Sound off',
      sending: 'Sending the forged request...',
      blocked: '{n} forged requests blocked so far.', blockedOne: '1 forged request blocked so far.',
      attackFail: 'The request did not reach AWS. Try again.',
      seconds: '{n} s ago', minutes: '{n} min ago', hours: '{n} h ago', days: '{n} d ago', now: 'just now'
    },
    es: {
      awake: 'El teléfono está despierto. Batería {b}%, reportó {t}.',
      awakeNoBat: 'El teléfono está despierto. Reportó {t}.',
      asleep: 'El teléfono está dormido. Reportó {t}. Tu gota lo esperará.',
      never: 'El teléfono aún no despierta. Tu gota lo esperará.',
      falling: 'Cayendo hacia Culiacán.',
      reached: 'Llegó a AWS en {ms} ms. Ahora espera al teléfono en Culiacán.',
      secretsCount: 'Escondidos en este cielo: {n} de 5',
      secretsHint: 'Hay cinco cosas escondidas a lo largo del día. Mira arriba, toca lo que te llame la atención y sigue bajando.',
      secretsDone: 'Encontraste las cinco. Una última cosa en la que creo: si practico, puedo.',
      sec_cloud: 'Tocaste la nube, y se movió.',
      sec_sun: 'Este sol es código. En este cielo no hay imágenes ni video: tu dispositivo lo pinta todo.',
      sec_plane: 'Atrapaste el avión. Cruza el cielo cada 95 segundos y es fácil no verlo.',
      sec_cables: 'La nube no está en el cielo. Corre por cables como estos, hasta llegar a mi cuarto.',
      sec_moon: 'Esta luz de luna es la misma que ves sobre el agua de mi teléfono.',
      waiting: 'La gota {n} espera a que despierte el teléfono. Ya te debo {ask}.',
      landed: 'La gota {n} cayó en Culiacán después de {s} s. Te debo {ask}.',
      failed: 'La gota no llegó a AWS. Revisa tu conexión y suelta otra.',
      count: '{n} gotas desde {p} lugares hasta ahora.',
      countPlace: '{n} gotas desde un lugar hasta ahora.',
      countOne: 'Ya cayó la primera gota.',
      first: 'Esta nube espera su primera gota.',
      hero: 'Esta nube guarda {n} gotas. Tócala.',
      heroOne: 'Esta nube guarda 1 gota. Tócala.',
      heroZero: 'Nadie ha tocado la nube. Inténtalo.',
      again: 'Soltar otra',
      dockCount: '{n} gotas', dockOne: '1 gota', dockZero: 'Soltar una gota',
      dockAwake: 'El teléfono real está despierto', dockAsleep: 'El teléfono real está dormido',
      fellFrom: 'Acaba de caer una gota desde {p}.', fell: 'Acaba de caer una gota.',
      yours: 'Esta es tu gota, fotografiada en mi cuarto hace unos segundos.',
      lastPhoto: 'Última foto de una gota real: la número {n}{from}, {t}.',
      from: ' desde {p}',
      askpush: 'una lagartija', askguitar: 'un minuto de guitarra', askaws: 'un minuto de AWS',
      repspush: 'lagartijas', repsguitar: 'minutos de guitarra', repsaws: 'minutos de AWS',
      repsDone: '{d} de {o} hechas',
      soundOn: 'Sonido sí', soundOff: 'Sonido no',
      sending: 'Enviando la petición falsa...',
      blocked: '{n} peticiones falsas bloqueadas hasta ahora.', blockedOne: '1 petición falsa bloqueada hasta ahora.',
      attackFail: 'La petición no llegó a AWS. Inténtalo otra vez.',
      seconds: 'hace {n} s', minutes: 'hace {n} min', hours: 'hace {n} h', days: 'hace {n} d', now: 'justo ahora'
    }
  };
  var EN = {};
  all('[data-t]').forEach(function (el) { EN[el.getAttribute('data-t')] = el.textContent; });

  var lang = '';
  try { lang = localStorage.getItem('lang') || ''; } catch (e) { lang = ''; }
  if (!lang) lang = /^es/i.test(navigator.language || '') ? 'es' : 'en';

  function say(key, vars) {
    var s = MSG[lang][key];
    Object.keys(vars || {}).forEach(function (k) { s = s.split('{' + k + '}').join(vars[k]); });
    return s;
  }
  function num(n) { return Number(n).toLocaleString(lang); }

  /* state ---------------------------------------------------------------- */
  var state = {
    count: null, places: 0, blocked: 0, phone: null, skew: 0, seenLanded: 0, lastRecent: 0,
    lastPhoto: null, cameraOnline: false, mine: {}, proofIsMine: false, reps: null
  };

  function setLang(next) {
    lang = next;
    document.documentElement.lang = lang;
    var d = lang === 'es' ? ES : EN;
    all('[data-t]').forEach(function (el) {
      var k = el.getAttribute('data-t');
      if (d[k] != null) el.textContent = d[k];
    });
    all('[data-lang]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang));
    });
    try { localStorage.setItem('lang', lang); } catch (e) { /* optional */ }
    renderSound();
    renderSecrets();
    renderStatus();
  }

  /* the sky follows the page ------------------------------------------- */
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var sky = null;
  try { sky = window.Sky && window.Sky($('sky')); } catch (e) { sky = null; }
  if (!sky) $('sky').style.display = 'none';

  /* section, time of day, how far the clouds sink, how much the scene dims for reading */
  var STOPS = [
    ['home', 0, innerWidth < 860 ? .62 : .24, 0], ['about', .27, 1.05, 1], ['skills', .46, 1.2, .95],
    ['projects', .64, 1.2, .6], ['drop', .8, .34, .12], ['how', .88, 1.2, .7], ['me', .94, 1.15, .75], ['contact', .985, 1.1, .85]
  ];
  /* time shown by the small clock for each stop, in minutes after midnight */
  var CLOCK = [[0, 930], [.27, 1110], [.46, 1180], [.64, 1290], [.8, 1420], [.88, 1560], [.94, 1720], [.985, 1820]];
  var anchors = [];
  function measure() {
    anchors = STOPS.map(function (s) {
      return { y: $(s[0]).offsetTop - innerHeight * .28, d: s[1], g: s[2], v: s[3] };
    });
    anchors[0].y = 0;
    var end = document.documentElement.scrollHeight - innerHeight;
    anchors[anchors.length - 1].y = Math.min(anchors[anchors.length - 1].y, end);
  }
  function ease(t) { return t * t * (3 - 2 * t); }
  function renderClock(day) {
    var mins = CLOCK[CLOCK.length - 1][1];
    for (var i = 0; i < CLOCK.length - 1; i++) {
      if (day <= CLOCK[i + 1][0]) {
        var t = (day - CLOCK[i][0]) / (CLOCK[i + 1][0] - CLOCK[i][0]);
        mins = CLOCK[i][1] + (CLOCK[i + 1][1] - CLOCK[i][1]) * Math.max(0, t);
        break;
      }
    }
    var m = Math.round(mins / 5) * 5 % 1440, h = Math.floor(m / 60), label = h >= 12 ? 'pm' : 'am';
    var h12 = h % 12 || 12, mm = String(m % 60).padStart(2, '0');
    $('clock').textContent = h12 + ':' + mm + ' ' + label;
  }
  var sections = ['about', 'skills', 'projects', 'drop', 'how', 'me', 'contact'];
  function onScroll() {
    var y = scrollY, a = anchors[0], b = anchors[anchors.length - 1], i;
    for (i = 0; i < anchors.length - 1; i++) {
      if (y >= anchors[i].y && y <= anchors[i + 1].y) { a = anchors[i]; b = anchors[i + 1]; break; }
    }
    if (y > anchors[anchors.length - 1].y) a = b = anchors[anchors.length - 1];
    var t = b.y > a.y ? ease((y - a.y) / (b.y - a.y)) : 0;
    var day = a.d + (b.d - a.d) * t;
    if (sky) {
      sky.setDay(day);
      sky.setGrow(a.g + (b.g - a.g) * t);
      sky.setVeil(a.v + (b.v - a.v) * t);
      if (calm) sky.frame(20);
    }
    $('wires').style.opacity = Math.max(0, Math.min(1, (day - .56) / .16));
    placeSpots(day);
    renderClock(day);
    document.querySelector('.top').classList.toggle('solid', y > innerHeight * .6);
    var active = '';
    sections.forEach(function (id) { if ($(id).offsetTop - innerHeight * .4 <= y) active = id; });
    all('.top nav a').forEach(function (l) {
      l.classList.toggle('on', l.getAttribute('href') === '#' + (active === 'how' ? 'drop' : active === 'me' ? 'about' : active));
    });
    var box = $('phone').getBoundingClientRect();
    $('dock').classList.toggle('away', box.top < innerHeight * .8 && box.bottom > innerHeight * .2);
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
    if (++touched === 40) { $('touchHint').classList.add('done'); discover('cloud'); }
  }
  addEventListener('pointermove', feel, { passive: true });
  addEventListener('pointerdown', feel, { passive: true });

  /* five things hidden across the day: instant, and independent of the phone */
  var found = {}, SECRET_TOTAL = 5;
  try { found = JSON.parse(localStorage.getItem('secrets') || '{}') || {}; } catch (e) { found = {}; }
  function foundCount() { return Object.keys(found).length; }
  function renderSecrets() {
    var b = $('secrets'), n = foundCount();
    b.textContent = say('secretsCount', { n: n });
    b.classList.toggle('done', n >= SECRET_TOTAL);
  }
  function discover(id) {
    var isNew = !found[id];
    found[id] = 1;
    try { localStorage.setItem('secrets', JSON.stringify(found)); } catch (e) { /* optional */ }
    renderSecrets();
    toast(say('sec_' + id));
    plink();
    if (isNew && foundCount() >= SECRET_TOTAL) setTimeout(function () { toast(say('secretsDone')); }, 5200);
  }
  function place(id, x, y, on) {
    var s = $(id);
    s.classList.toggle('on', on);
    if (on) s.style.transform = 'translate(' + Math.round(x) + 'px,' + Math.round(y) + 'px)';
  }
  var dayNow = 0;
  function placeSpots(day) {
    dayNow = day;
    var w = innerWidth, h = $('sky').clientHeight || innerHeight;
    place('spotSun', w * .52, h * .1, day < .14);
    place('spotMoon', w * .84, h * .2, day > .6 && day < .9);
    var pole = $('pole').getBoundingClientRect();
    place('spotCables', pole.left + pole.width / 2, pole.top + 70, day > .66 && pole.width > 0);
  }
  /* the same path the shader draws for the plane */
  function trackPlane(now) {
    var w = innerWidth, h = $('sky').clientHeight || innerHeight, A = w / h;
    var ph = ((calm ? 20 : now / 1000) / 95) % 1;
    var ux = -.72 * A + (1.58 * A) * ph, uy = -.02 + .44 * ph;
    place('spotPlane', w / 2 + ux * h, h / 2 - uy * h, dayNow < .34 && ph > .02);
    requestAnimationFrame(trackPlane);
  }
  [['spotSun', 'sun'], ['spotPlane', 'plane'], ['spotCables', 'cables'], ['spotMoon', 'moon']].forEach(function (p) {
    $(p[0]).addEventListener('click', function () { discover(p[1]); });
  });
  $('secrets').addEventListener('click', function () {
    toast(foundCount() >= SECRET_TOTAL ? say('secretsDone') : say('secretsHint'));
  });

  /* sound: off until the visitor asks for it ----------------------------- */
  var soundOn = false, audio = null;
  function renderSound() {
    var b = $('sound');
    b.textContent = say(soundOn ? 'soundOn' : 'soundOff');
    b.setAttribute('aria-pressed', String(soundOn));
  }
  $('sound').addEventListener('click', function () {
    soundOn = !soundOn;
    renderSound();
    if (soundOn) plink();
  });
  function plink() {
    if (!soundOn) return;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      audio = audio || new AC();
      var t = audio.currentTime;
      [[1250, .24], [880, .1]].forEach(function (n, i) {
        var o = audio.createOscillator(), g = audio.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(n[0], t + i * .07);
        o.frequency.exponentialRampToValueAtTime(n[0] * .46, t + i * .07 + .22);
        g.gain.setValueAtTime(n[1], t + i * .07);
        g.gain.exponentialRampToValueAtTime(.0008, t + i * .07 + .55);
        o.connect(g); g.connect(audio.destination);
        o.start(t + i * .07); o.stop(t + i * .07 + .6);
      });
    } catch (e) { /* sound is optional */ }
  }

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
    sc.fillText(state.count != null ? num(state.count) : '', 180, 112);
    sc.font = '500 19px "Shippori Mincho", serif';
    sc.fillStyle = 'rgba(255,255,255,.7)';
    var one = state.count === 1;
    sc.fillText(lang === 'es' ? (one ? 'gota en la nube' : 'gotas en la nube') : (one ? 'drop in the cloud' : 'drops in the cloud'), 180, 146);
  }
  function loopScreen(now) {
    var box = screen.getBoundingClientRect();
    if (box.bottom > 0 && box.top < innerHeight) paintScreen(now);
    requestAnimationFrame(loopScreen);
  }

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
  function phoneInView() {
    var b = screen.getBoundingClientRect();
    return b.top < innerHeight * .8 && b.bottom > innerHeight * .2;
  }
  function letFall(done) {
    var dockBox = $('dockBtn').getBoundingClientRect(), box = screen.getBoundingClientRect();
    var inView = phoneInView();
    var tx = inView ? box.left + box.width / 2 : dockBox.left + 27;
    var ty = inView ? box.top + box.height * .68 : dockBox.top + 28;
    var x0 = Math.max(40, tx - innerWidth * .1), y0 = -30;
    if (calm) { done(); return; }
    var t0 = performance.now(), dur = 1150;
    (function step(now) {
      var t = Math.min(1, (now - t0) / dur), e = t * t;
      var x = x0 + (tx - x0) * t, y = y0 + (ty - y0) * e;
      fc.clearRect(0, 0, innerWidth, innerHeight);
      var trail = fc.createLinearGradient(x, y - 170 * e - 20, x, y);
      trail.addColorStop(0, 'rgba(180,205,255,0)'); trail.addColorStop(1, 'rgba(200,220,255,.6)');
      fc.strokeStyle = trail; fc.lineWidth = 2; fc.beginPath();
      fc.moveTo(x - (tx - x0) / dur * 170 * e, y - 170 * e - 20); fc.lineTo(x, y); fc.stroke();
      dropShape(x, y, 1.15);
      if (t < 1) { requestAnimationFrame(step); return; }
      fc.clearRect(0, 0, innerWidth, innerHeight);
      done();
    })(t0);
  }
  function ripple() {
    ripples.push({ x: 180, y: 430, t: performance.now() });
    var p = $('phone'), d = $('dock');
    p.classList.add('hit'); d.classList.add('hit');
    setTimeout(function () { p.classList.remove('hit'); d.classList.remove('hit'); }, 650);
    plink();
  }

  var toastTimer = 0;
  function toast(text) {
    var t = $('toast');
    t.textContent = text;
    t.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('on'); }, 6000);
  }
  /* the same message for whoever is watching: the section if it's on screen, a toast if not */
  function report(text) {
    $('result').textContent = text;
    $('reply').hidden = false;
    if (!phoneInView()) toast(text);
  }

  /* status ----------------------------------------------------------------- */
  function ago(ts) {
    var s = Math.max(0, Math.round((Date.now() + state.skew - ts) / 1000));
    if (s < 8) return say('now');
    if (s < 60) return say('seconds', { n: s });
    if (s < 3600) return say('minutes', { n: Math.round(s / 60) });
    if (s < 86400) return say('hours', { n: Math.round(s / 3600) });
    return say('days', { n: Math.round(s / 86400) });
  }
  function renderStatus() {
    var el = $('status'), p = state.phone, count = state.count;
    if (!el) return;
    var txt, awake = false;
    if (!p || !p.lastSeen) txt = say('never');
    else if (p.online) {
      awake = true;
      txt = p.battery >= 0 ? say('awake', { b: p.battery, t: ago(p.lastSeen) }) : say('awakeNoBat', { t: ago(p.lastSeen) });
    } else txt = say('asleep', { t: ago(p.lastSeen) });
    el.className = 'status' + (awake ? ' awake' : '');
    el.innerHTML = '<i aria-hidden="true"></i>';
    el.appendChild(document.createTextNode(txt));

    var ds = $('dockState');
    ds.textContent = say(awake ? 'dockAwake' : 'dockAsleep');
    ds.className = awake ? 'awake' : '';

    renderReps();
    /* the photo step only exists while a camera is running or a photo was taken */
    $('trace').classList.toggle('with-photo', !!(state.cameraOnline || state.lastPhoto));
    if (count == null) return;
    $('caption').textContent = count === 0 ? say('first') :
      say(count === 1 ? 'countOne' : state.places <= 1 ? 'countPlace' : 'count', { n: num(count), p: num(state.places) });
    $('dockCount').textContent = count === 0 ? say('dockZero') : count === 1 ? say('dockOne') : say('dockCount', { n: num(count) });
    $('heroCount').textContent = count === 0 ? say('heroZero') : count === 1 ? say('heroOne') : say('hero', { n: num(count) });
    if (sky) sky.setMass(Math.log(1 + count) / Math.log(10));
    if (state.blocked) $('blocked').textContent = say(state.blocked === 1 ? 'blockedOne' : 'blocked', { n: num(state.blocked) });
    renderProof();
  }
  function renderReps() {
    var r = state.reps;
    if (!r) return;
    all('#reps li').forEach(function (li) {
      var k = li.getAttribute('data-kind'), x = r[k] || { owed: 0, done: 0 };
      li.querySelector('b').textContent = say('reps' + k);
      li.querySelector('span').textContent = say('repsDone', { d: num(x.done), o: num(x.owed) });
      li.querySelector('u').style.width = (x.owed ? Math.min(100, x.done / x.owed * 100) : 0) + '%';
    });
  }
  function renderProof() {
    var p = state.lastPhoto;
    if (!p || state.proofIsMine) return;
    var img = $('proofImg'), src = API + '/api/photo/' + p.id;
    if (img.getAttribute('src') !== src) {
      img.src = src;
      img.alt = 'Photo of the real phone showing drop ' + p.n;
    }
    $('proofCap').textContent = say('lastPhoto', {
      n: num(p.n), t: ago(p.at), from: p.place ? say('from', { p: p.place }) : ''
    });
    $('proof').hidden = false;
  }
  function showMyPhoto(id, n) {
    state.proofIsMine = true;
    var img = $('proofImg');
    img.src = API + '/api/photo/' + id;
    img.alt = 'Photo of the real phone showing drop ' + n;
    $('proofCap').textContent = say('yours');
    $('proof').hidden = false;
    if (!phoneInView()) toast(say('yours'));
  }
  function refresh() {
    fetch(API + '/api/sky', { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (d) {
      state.skew = (d.now || Date.now()) - Date.now();
      state.count = d.count; state.places = d.places; state.phone = d.phone;
      state.blocked = d.blocked || 0; state.lastPhoto = d.lastPhoto; state.cameraOnline = d.cameraOnline;
      state.reps = d.reps || state.reps;
      if (state.seenLanded && d.lastLandedAt > state.seenLanded) ripple();
      state.seenLanded = d.lastLandedAt || state.seenLanded;

      /* other people's drops, so the page feels inhabited */
      var fresh = (d.recent || [])[0];
      if (fresh) {
        if (state.lastRecent && fresh.n > state.lastRecent && !state.mine[fresh.n]) {
          toast(fresh.place ? say('fellFrom', { p: fresh.place }) : say('fell'));
        }
        state.lastRecent = Math.max(state.lastRecent, fresh.n);
      }
      renderStatus();
    }).catch(function () { renderStatus(); });
  }

  /* the live trace --------------------------------------------------------- */
  function step(name, label) {
    var li = document.querySelector('.trace [data-step="' + name + '"]');
    if (!li) return;
    li.classList.add('lit');
    if (label != null) li.querySelector('em').textContent = label;
  }
  function clearTrace() {
    all('.trace li').forEach(function (li) { li.classList.remove('lit'); li.querySelector('em').textContent = ''; });
  }

  /* letting go of a drop ---------------------------------------------------- */
  function zone() {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { return ''; }
  }
  function waitForPhoto(id, n) {
    var tries = 0;
    (function poll() {
      fetch(API + '/api/drop/' + id, { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (d) {
        if (d.photo) { step('s3', ((Date.now() + state.skew - d.at) / 1000).toFixed(1) + ' s'); showMyPhoto(id, n); return; }
        if (++tries < 12) setTimeout(poll, 800);
      }).catch(function () { /* the photo is a bonus */ });
    })();
  }
  function chosen() {
    var c = document.querySelector('input[name="kind"]:checked');
    return c ? c.value : 'push';
  }
  function waitForLanding(id, n, kind) {
    var tries = 0;
    (function poll() {
      fetch(API + '/api/drop/' + id, { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (d) {
        if (d.landedAt) {
          ripple();
          var secs = (Math.max(d.landedMs, 0) / 1000).toFixed(1);
          step('phone', secs + ' s');
          report(say('landed', { n: num(n), s: secs, ask: say('ask' + kind) }));
          refresh();
          if (state.cameraOnline) waitForPhoto(id, n);
          return;
        }
        if (++tries < 20) setTimeout(poll, 900);
        else report(say('waiting', { n: num(n), ask: say('ask' + kind) }));
      }).catch(function () { report(say('waiting', { n: num(n), ask: say('ask' + kind) })); });
    })();
  }

  var busy = false, buttons = ['release', 'heroDrop', 'traceBtn', 'dockBtn'];
  function release() {
    if (busy) return;
    busy = true;
    buttons.forEach(function (id) { $(id).disabled = true; });
    clearTrace();
    state.proofIsMine = false;
    var kind = chosen();
    report(say('falling'));
    step('browser');

    var t0 = performance.now();
    var sent = fetch(API + '/api/drop', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ zone: zone(), lang: lang, kind: kind })
    }).then(function (r) { if (!r.ok) throw new Error('drop'); return r.json(); }).then(function (d) {
      var rtt = Math.round(performance.now() - t0), tm = d.timing || {};
      d.rtt = rtt;
      state.mine[d.n] = true;
      step('browser', rtt + ' ms');
      setTimeout(function () { step('api', Math.max(0, rtt - (tm.lambdaMs || 0)) + ' ms'); }, 160);
      setTimeout(function () { step('lambda', (tm.lambdaMs != null ? tm.lambdaMs : '') + ' ms'); }, 320);
      setTimeout(function () { step('dynamo', (tm.dynamoMs != null ? tm.dynamoMs : '') + ' ms'); }, 480);
      return d;
    });

    letFall(function () {
      sent.then(function (d) {
        state.count = d.n;
        state.lastRecent = Math.max(state.lastRecent, d.n);
        if (state.reps && state.reps[kind]) state.reps[kind].owed += 1;
        renderStatus();
        ripple();
        if (state.phone && state.phone.online) {
          report(say('reached', { ms: d.rtt }));
          waitForLanding(d.id, d.n, kind);
        } else {
          report(say('waiting', { n: num(d.n), ask: say('ask' + kind) }));
        }
        finish();
      }).catch(function () {
        report(say('failed'));
        finish();
      });
    });
    function finish() {
      setTimeout(function () {
        busy = false;
        buttons.forEach(function (id) { $(id).disabled = false; });
        $('release').textContent = say('again');
      }, 2200);
    }
  }
  buttons.forEach(function (id) { $(id).addEventListener('click', release); });

  /* the forged request: a real call that the API must refuse --------------- */
  $('attack').addEventListener('click', function () {
    var btn = this, out = $('attackOut');
    btn.disabled = true;
    out.textContent = say('sending');
    var t0 = performance.now();
    fetch(API + '/api/phone', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ token: 'forged-' + Math.random().toString(16).slice(2, 10), beat: true, battery: 100 })
    }).then(function (r) {
      return r.json().then(function (b) {
        var ms = Math.round(performance.now() - t0);
        out.textContent = 'HTTP ' + r.status + ' in ' + ms + ' ms\n' + JSON.stringify({ error: b.error }, null, 2);
        if (b.blocked) { state.blocked = b.blocked; renderStatus(); }
      });
    }).catch(function () {
      out.textContent = say('attackFail');
    }).then(function () {
      setTimeout(function () { btn.disabled = false; }, 1200);
    });
  });

  /* the real footage plays while it is on screen; a tap opens it full size */
  var real = $('realVideo');
  if (calm) {
    real.controls = true;
  } else if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { var p = real.play(); if (p) p.catch(function () {}); } else real.pause();
    }, { threshold: .35 }).observe(real);
  }
  real.addEventListener('click', function () {
    if (real.requestFullscreen) real.requestFullscreen().catch(function () {});
  });

  /* start ------------------------------------------------------------------ */
  all('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  fitFall();
  measure();
  setLang(lang);
  onScroll();
  refresh();
  setInterval(refresh, 8000);
  requestAnimationFrame(loopScreen);
  requestAnimationFrame(trackPlane);
  if (sky) { if (calm) sky.frame(20); else sky.start(); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  addEventListener('load', function () { measure(); onScroll(); });
})();
