/* The sky. A painted cumulus sky rendered in real time on the visitor's GPU.
   One value drives everything: `day`, from 0 (bright afternoon) to 1 (dawn).
   The page scroll moves it, so reading the portfolio takes you through a day. */
(function () {
  'use strict';

  var VERT = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';

  var FRAG = [
    'precision highp float;',
    'uniform vec2 R;uniform float T,D,G,C,V;uniform sampler2D N;uniform vec3 P[6];',
    'const mat2 M=mat2(.8,.6,-.6,.8);',
    'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return texture2D(N,(i+f+.5)/256.).r;}',
    'float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*n(p);p=M*p*2.03+7.1;a*=.5;}return s;}',
    /* a field of spheres: every puff of the cloud is a real ball with its own normal */
    'vec3 puffs(vec2 p,out float ht){vec2 i=floor(p),f=fract(p);float bh=0.;vec3 ns=vec3(0.,0.,.012);',
    ' for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 g=vec2(float(x),float(y));',
    '  vec4 c=texture2D(N,(mod(i+g,256.)+.5)/256.);vec2 o=g+c.rg*.9+.05-f;float r=.56+.42*c.b;',
    '  float z=r*r-dot(o,o);if(z>0.){float hz=sqrt(z);float w=z*z*z;ns+=vec3(-o,hz)*w;if(hz>bh)bh=hz;}}',
    ' ht=bh;return normalize(ns);}',

    /* palette keyed by time of day */
    'vec3 k(vec3 a,vec3 b,vec3 c,vec3 d,vec3 e,float t){',
    ' if(t<.3)return mix(a,b,smoothstep(0.,.3,t));',
    ' if(t<.52)return mix(b,c,smoothstep(.3,.52,t));',
    ' if(t<.76)return mix(c,d,smoothstep(.52,.76,t));',
    ' return mix(d,e,smoothstep(.76,1.,t));}',

    'float tower(vec2 p,vec2 c,vec2 r){vec2 q=(p-c)/r;return exp(-dot(q,q));}',

    /* positive inside the cloud. Towers follow the aspect so phones keep the composition */
    'float A;',
    'float body(vec2 p,float s){',
    ' float h=-.4+.05*sin(p.x*1.1+s)+.03*sin(p.x*2.7+s*2.);',
    ' float tall=clamp(A*.72+.08,.3,1.);',
    ' if(s<.5){',
    '  h+=.88*tall*tower(p,vec2(.33*A,-.4),vec2(.1*A+.13,.8));',
    '  h+=.42*tall*tower(p,vec2(.52*A,-.42),vec2(.09*A+.09,.54));',
    '  h+=.32*tower(p,vec2(.15*A,-.42),vec2(.08*A+.09,.42));',
    '  h+=.05*tower(p,vec2(-.3*A,-.42),vec2(.12*A+.1,.3));',
    ' }else if(s<1.5){',
    '  h+=.24*tall*tower(p,vec2(.1*A,-.36),vec2(.1*A+.1,.46));',
    '  h+=.12*tower(p,vec2(-.3*A,-.36),vec2(.1*A+.08,.3));',
    ' }else{',
    '  h+=.13*tower(p,vec2(.12*A,-.26),vec2(.3*A+.1,.26));',
    ' }',
    ' return h-p.y;}',

    'float touch(vec2 uv){float t=0.;for(int i=0;i<6;i++){vec2 d=uv-P[i].xy;t+=P[i].z*exp(-dot(d,d)/.02);}return t;}',

    'void main(){',
    ' A=R.x/R.y;vec2 uv=(gl_FragCoord.xy-.5*R)/R.y;',
    ' float d=D;',
    ' float tw=touch(uv);',

    /* sky */
    ' vec3 top=k(vec3(.02,.2,.72),vec3(.12,.2,.58),vec3(.1,.08,.36),vec3(.008,.014,.075),vec3(.05,.08,.28),d);',
    ' vec3 mid=k(vec3(.13,.5,.96),vec3(.5,.45,.72),vec3(.52,.2,.5),vec3(.02,.04,.16),vec3(.32,.26,.55),d);',
    ' vec3 low=k(vec3(.72,.92,1.),vec3(1.,.72,.46),vec3(1.,.42,.3),vec3(.08,.1,.28),vec3(1.,.66,.46),d);',
    ' float y=uv.y+.5;',
    ' vec3 c=mix(low,mid,smoothstep(0.,.5,y));c=mix(c,top,smoothstep(.42,1.05,y));',

    /* sun or moon */
    ' vec2 sun=vec2(mix(.02*A,.1,smoothstep(0.,.5,d)),mix(.4,-.62,smoothstep(0.,.55,d)));',
    ' if(d>.76)sun=vec2(.1+.3*(d-.76),mix(-.62,-.5,smoothstep(.76,1.,d)));',
    ' vec3 sunC=k(vec3(1.,.97,.86),vec3(1.,.78,.46),vec3(1.,.5,.3),vec3(.5,.6,1.),vec3(1.,.72,.5),d);',
    ' float nightF=smoothstep(.56,.72,d)*(1.-smoothstep(.86,1.,d));',
    ' float dS=length(uv-sun);',
    ' c+=sunC*(.34*exp(-dS*2.2)+.42*exp(-dS*7.)+1.1*exp(-dS*26.))*(1.-.82*nightF);',

    /* stars */
    ' if(nightF>.01){vec2 g=uv*140.;vec2 id=floor(g);float r=texture2D(N,(id+.5)/256.).g;',
    '  float s=step(.982,r)*smoothstep(.34,.05,length(fract(g)-.5));',
    '  float tw2=.6+.4*sin(T*1.7+r*90.);c+=vec3(.85,.9,1.)*s*tw2*nightF*smoothstep(-.28,.25,uv.y);',
    '  float band=fbm(M*uv*2.+vec2(3.,1.));c+=vec3(.14,.17,.36)*smoothstep(.4,.74,band)*nightF*.55;',
    '  vec2 mo=vec2(.34*A,.3);float m=length(uv-mo);c=mix(c,vec3(.93,.95,1.),smoothstep(.045,.041,m)*nightF);c+=vec3(.4,.5,.9)*exp(-m*7.)*.34*nightF;',
    ' }',

    /* cloud palette */
    ' vec3 cS=k(vec3(.44,.6,.92),vec3(.46,.4,.74),vec3(.22,.14,.46),vec3(.012,.02,.09),vec3(.26,.22,.52),d);',
    ' vec3 cM=k(vec3(.9,.95,1.),vec3(1.,.74,.62),vec3(.78,.34,.5),vec3(.05,.08,.2),vec3(.8,.5,.62),d);',
    ' vec3 cL=k(vec3(1.,1.,.99),vec3(1.,.93,.76),vec3(1.,.62,.42),vec3(.2,.28,.52),vec3(1.,.84,.68),d);',
    ' vec3 cR=k(vec3(1.,.97,.84),vec3(1.,.84,.52),vec3(1.,.66,.36),vec3(.52,.64,1.),vec3(1.,.9,.7),d);',

    ' vec3 lightDir=normalize(vec3(sun-vec2(.3*A,.0),.55));',

    /* a contrail crossing the sky */
    ' {float ph=fract(T/95.);vec2 st=vec2(-.72*A,-.02),en=vec2(.86*A,.42);vec2 pl=mix(st,en,ph);',
    '  vec2 ab=en-st;float tt=clamp(dot(uv-st,ab)/dot(ab,ab),0.,ph);vec2 pr=st+ab*tt;float age=ph-tt;',
    '  float wd=.0016+age*.016+.003*n(vec2(tt*40.,T*.1));float tr=smoothstep(wd,wd*.25,length(uv-pr))*(1.-smoothstep(.0,.42,age));',
    '  float vis=(1.-smoothstep(.34,.52,d));c=mix(c,cL,tr*.8*vis);c+=vec3(1.)*smoothstep(.0035,.0012,length(uv-pl))*vis;}',

    /* high cirrus: long brushed streaks */
    ' vec2 ci=vec2(uv.x*.7+T*.004,uv.y*3.2);float cf=fbm(ci+vec2(fbm(ci*1.7)*1.1,0.));',
    ' c=mix(c,cL,smoothstep(.5,.78,cf)*.55*smoothstep(-.1,.3,uv.y)*(1.-.75*nightF));',

    /* layers, far to near */
    ' for(int L=2;L>=0;L--){',
    '  float s=float(L);',
    '  vec2 p=uv*(1.+s*.5);p.y-=s*.02;p.y+=G*(.08+.26*(2.-s));',
    '  p.x+=T*(.004+.0035*(2.-s));',
    '  if(body(p,s)<-.3)continue;',
    '  vec2 w=vec2(fbm(p*1.15+s*4.),fbm(p*1.15+s*4.+5.2))-.47;',
    '  vec2 q=p+w*.13;',
    '  float hG,hB,hM,hS;',
    '  vec3 nG=puffs(q*1.9+s*17.,hG);',
    '  vec3 nB=puffs(q*4.3+s*11.,hB);',
    '  vec3 nM=puffs(q*9.7+s*5.,hM);',
    '  vec3 nS=vec3(0.,0.,1.);hS=.5;if(L<2)nS=puffs(q*22.+s*3.,hS);',
    '  float H=hG*.5+hB*.42+hM*.2+hS*.09;',
    '  float b=body(p+w*.14,s);',
    '  float h=b+(H-.6)*.42+C*.05-tw*(.62-.2*s);',
    '  float a=smoothstep(0.,max(.0065,3./R.y),h);',
    '  if(a<=0.)continue;',
    '  vec3 nn=normalize(nG*1.1+nB*.72+nM*.3+nS*.1);',
    '  float l=clamp(dot(nn,lightDir)*.92+.1,0.,1.);',
    /* the body of the cloud falls into shade below the sunlit crown */
    '  float form=smoothstep(.02,.42,b);',
    '  l=l*mix(1.,.56,form)+.1*(1.-form);',
    '  vec3 col=mix(cS,cM,smoothstep(.1,.56,l));col=mix(col,cL,smoothstep(.5,.8,l));',
    /* gold line on the edges that face the light */
    '  float rim=smoothstep(.05,.0,h);',
    '  col+=cR*rim*.42*(1.-.5*nightF);',
    '  col+=sunC*.12*exp(-dS*1.5)*(1.-nightF);',
    /* air between the layers */
    '  col=mix(col,mix(low,mid,.4),s*.24);',
    '  col*=1.-V*.56;',
    '  c=mix(c,col,a);',
    ' }',

    /* a little light where the visitor is touching */
    ' c+=cR*tw*.05;',

    /* flare and film grain */
    ' c+=sunC*.1*exp(-abs(uv.y-sun.y)*42.)*exp(-abs(uv.x-sun.x)*1.6)*(1.-nightF);',
    ' c+=(texture2D(N,gl_FragCoord.xy/256.+fract(T*7.)).b-.5)*.018;',
    ' c=pow(max(c,0.),vec3(.96));c*=1.-V*.2;',
    ' gl_FragColor=vec4(c,1.);',
    '}'
  ].join('\n');

  function shader(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(s));
    }
    return s;
  }

  function noiseTexture(gl) {
    var size = 256, data = new Uint8Array(size * size * 4), seed = 1337;
    function r() {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed >>> 24;
    }
    for (var i = 0; i < data.length; i++) data[i] = r();
    var t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    return t;
  }

  window.Sky = function (canvas, opts) {
    opts = opts || {};
    var gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' });
    if (!gl) return null;

    var prog = gl.createProgram();
    gl.attachShader(prog, shader(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, shader(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    noiseTexture(gl);
    var u = {};
    ['R', 'T', 'D', 'G', 'C', 'V'].forEach(function (n) { u[n] = gl.getUniformLocation(prog, n); });
    u.P = gl.getUniformLocation(prog, 'P');

    var state = {
      day: 0, target: 0, grow: 0, growTarget: 0, mass: 1, veil: 0, veilTarget: 0,
      scale: opts.scale || 1,
      trail: new Float32Array(18),
      head: 0, last: 0, frames: 0, spent: 0, tick: 0, every: 2,
      running: true
    };

    function resize() {
      var w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight;
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      var cap = 1400 / Math.max(w, h);
      var s = Math.min(1, cap) * dpr * state.scale;
      canvas.width = Math.max(2, Math.round(w * s));
      canvas.height = Math.max(2, Math.round(h * s));
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    addEventListener('resize', resize);

    function draw(now) {
      var t = now / 1000;
      state.day += (state.target - state.day) * 0.14;
      state.grow += (state.growTarget - state.grow) * 0.14;
      state.veil += (state.veilTarget - state.veil) * 0.14;
      for (var i = 2; i < 18; i += 3) state.trail[i] *= 0.984;
      gl.uniform2f(u.R, canvas.width, canvas.height);
      gl.uniform1f(u.T, t);
      gl.uniform1f(u.D, state.day);
      gl.uniform1f(u.G, state.grow);
      gl.uniform1f(u.C, state.mass);
      gl.uniform1f(u.V, state.veil);
      gl.uniform3fv(u.P, state.trail);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    /* keep the frame rate by lowering resolution, never by dropping the sky */
    function loop(now) {
      if (!state.running) return;
      requestAnimationFrame(loop);
      if (document.hidden) return;
      state.tick = (state.tick + 1) % state.every;
      if (state.tick) return;
      if (state.last) {
        state.spent += now - state.last;
        if (++state.frames === 30) {
          var ms = state.spent / 30;
          state.ms = ms;
          if (ms > 48 && state.scale > 0.55) { state.scale *= 0.85; resize(); }
          else if (ms > 70 && state.every < 4) { state.every += 1; }
          state.frames = 0; state.spent = 0;
        }
      }
      state.last = now;
      draw(now);
    }

    return {
      start: function () { requestAnimationFrame(loop); },
      frame: function (t) { state.day = state.target; state.grow = state.growTarget; state.veil = state.veilTarget; draw((t || 20) * 1000); },
      setDay: function (d) { state.target = d; },
      setGrow: function (g) { state.growTarget = g; },
      setVeil: function (v) { state.veilTarget = v; },
      setMass: function (m) { state.mass = m; },
      touch: function (x, y) {
        var uvx = (x - canvas.clientWidth / 2) / canvas.clientHeight;
        var uvy = (canvas.clientHeight / 2 - y) / canvas.clientHeight;
        var i = state.head * 3;
        state.trail[i] = uvx; state.trail[i + 1] = uvy; state.trail[i + 2] = 1;
        state.head = (state.head + 1) % 6;
      },
      state: state
    };
  };
})();
