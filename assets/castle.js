// The castle: one part per chapter. Unbuilt parts are a hologram; built parts are a lit model.
// Drawn live with three.js; every colour comes from the page's tokens.
import * as THREE from './vendor/three.module.min.js';

const PARTS = 6; // one per chapter
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;

function readTokens() {
  const c = document.createElement('canvas');
  c.width = c.height = 1;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  const css = getComputedStyle(document.documentElement);
  return (name) => {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = css.getPropertyValue(name).trim();
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return new THREE.Color().setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace);
  };
}

// Flagstones for the plaza, drawn once on a canvas in the paving and stone colours.
function pavingTexture(paving, stone) {
  const size = 1024, c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  g.fillStyle = `#${paving.getHexString(THREE.SRGBColorSpace)}`;
  g.fillRect(0, 0, size, size);
  g.strokeStyle = `#${stone.getHexString(THREE.SRGBColorSpace)}`;
  g.lineWidth = 3;
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const n = 9, step = size / n, pts = [];
  for (let y = 0; y <= n; y++) for (let x = 0; x <= n; x++) {
    const edge = x === 0 || y === 0 || x === n || y === n;
    pts.push([x * step + (edge ? 0 : (rnd() - 0.5) * step * 0.6), y * step + (edge ? 0 : (rnd() - 0.5) * step * 0.6)]);
  }
  const p = (x, y) => pts[y * (n + 1) + x];
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const q = [p(x, y), p(x + 1, y), p(x + 1, y + 1), p(x, y + 1)];
    g.beginPath(); g.moveTo(...q[0]); q.slice(1).forEach((v) => g.lineTo(...v)); g.closePath(); g.stroke();
    if (rnd() > 0.6) { g.beginPath(); g.moveTo(...q[0]); g.lineTo(...q[2]); g.stroke(); }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

// Geometry helpers. Every piece stands on y = 0 so it can rise from its base.
const up = (geo, h) => geo.translate(0, h / 2, 0);
const cyl = (r, h, rTop = r, seg = 40) => up(new THREE.CylinderGeometry(rTop, r, h, seg), h);
const box = (w, h, d) => up(new THREE.BoxGeometry(w, h, d), h);
const cone = (r, h, seg = 40) => up(new THREE.ConeGeometry(r, h, seg), h);
const halfDisc = (r, h) => up(new THREE.CylinderGeometry(r, r, h, 40, 1, false, -Math.PI / 2, Math.PI), h);
function arch(w, h, depth = 0.16) {
  const s = new THREE.Shape(), r = w / 2;
  s.moveTo(-r, 0); s.lineTo(r, 0); s.lineTo(r, h - r);
  s.absarc(0, h - r, r, 0, Math.PI, false);
  s.lineTo(-r, 0);
  return new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 16 }).translate(0, 0, -depth / 2);
}
function roundedSlab(w, d, r, h) {
  const s = new THREE.Shape(), x = w / 2, z = d / 2;
  s.moveTo(-x + r, -z); s.lineTo(x - r, -z); s.quadraticCurveTo(x, -z, x, -z + r);
  s.lineTo(x, z - r); s.quadraticCurveTo(x, z, x - r, z); s.lineTo(-x + r, z);
  s.quadraticCurveTo(-x, z, -x, z - r); s.lineTo(-x, -z + r); s.quadraticCurveTo(-x, -z, -x + r, -z);
  const geo = new THREE.ExtrudeGeometry(s, { depth: h - 0.5, bevelEnabled: true, bevelThickness: 0.25, bevelSize: 0.35, bevelSegments: 4, curveSegments: 12 });
  geo.rotateX(-Math.PI / 2).translate(0, 0.25, 0);
  return geo;
}
function gable(w, h, d) {
  const s = new THREE.Shape();
  s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(0, h); s.lineTo(-w / 2, 0);
  return new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false }).translate(0, 0, -d / 2);
}
function flagGeo() {
  const geo = new THREE.PlaneGeometry(2.2, 1.1, 14, 4).translate(1.1, 0, 0);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) { // a swallowtail notch at the free end
    const x = pos.getX(i), y = pos.getY(i);
    if (x > 1.6) pos.setX(i, x - 0.55 * (1 - Math.abs(y) / 0.55) * ((x - 1.6) / 0.6));
  }
  geo.userData.rest = Float32Array.from(pos.array);
  return geo;
}

// The plan: each piece is { geo, mat, part, x, y, z, ry }.
function plan(M) {
  const P = [];
  const add = (geo, mat, part, x, y, z, ry = 0, extra = {}) => P.push({ geo, mat, part, x, y, z, ry, ...extra });

  // foundations: the paved plaza
  add(roundedSlab(28, 28, 4, 1.2), M.paving, 0, 0, 0, 0);
  const G = 1.2;

  // the plan: the stone footing of the walls, towers and keep
  const corners = [[-8, -8], [8, -8], [-8, 8], [8, 8]];
  [-8, 8].forEach((z) => add(box(16, 1.1, 1.4), M.stone, 1, 0, G, z));
  [-8, 8].forEach((x) => add(box(1.4, 1.1, 16), M.stone, 1, x, G, 0));
  corners.forEach(([x, z]) => add(cyl(3.0, 1.3), M.stone, 1, x, G, z));
  add(cyl(4.0, 0.9), M.stone, 1, 0, G, -1.5);

  // the walls and their battlements
  [-8, 8].forEach((z) => add(box(16, 4.6, 1.2), M.wall, 2, 0, G + 1.1, z));
  [-8, 8].forEach((x) => add(box(1.2, 4.6, 16), M.wall, 2, x, G + 1.1, 0));
  const top = G + 5.7;
  for (let i = -4.8; i <= 4.81; i += 1.6) {
    if (Math.abs(i) > 3.4) add(box(0.9, 0.9, 1.3), M.wall, 2, i, top, 8);
    add(box(0.9, 0.9, 1.3), M.wall, 2, i, top, -8);
    add(box(1.3, 0.9, 0.9), M.wall, 2, -8, top, i);
    add(box(1.3, 0.9, 0.9), M.wall, 2, 8, top, i);
  }

  // the towers: four of one component
  corners.forEach(([x, z]) => {
    add(cyl(2.6, 8.4), M.wall, 3, x, G + 1.3, z);
    add(cyl(2.7, 1.3, 3.15), M.stone, 3, x, G + 9.7, z);
    add(cyl(3.15, 0.8), M.wall, 3, x, G + 11.0, z);
  });

  // the gate: gatehouse, gable, door and steps
  add(box(6.4, 7.2, 4.2), M.wall, 4, 0, G, 8.4);
  add(gable(7.2, 3.4, 4.8), M.roof, 4, 0, G + 7.2, 8.4);
  add(arch(2.6, 3.8, 0.3), M.wood, 4, 0, G, 10.55);
  add(halfDisc(2.6, 0.35), M.stone, 4, 0, G, 10.6);
  add(halfDisc(2.0, 0.7), M.stone, 4, 0, G, 10.6);
  add(halfDisc(1.4, 1.05), M.stone, 4, 0, G, 10.6);

  // the keep, its balcony and bell turret, and two slender turrets
  const K = [0, -1.5], kh = 12;
  add(cyl(3.5, kh), M.wall, 5, K[0], G + 0.9, K[1]);
  add(cyl(3.6, 1.6, 4.2), M.stone, 5, K[0], G + 0.9 + kh, K[1]);
  add(cyl(4.2, 0.9), M.wall, 5, K[0], G + 2.5 + kh, K[1]);
  add(cyl(2.3, 3.6), M.wall, 5, K[0], G + 2.5 + kh, K[1]);
  const turrets = [[-5.4, 2.2], [5.4, -4.6]];
  turrets.forEach(([x, z]) => {
    add(cyl(1.25, 13.5), M.wall, 5, x, G, z);
    add(cyl(1.3, 0.9, 1.6), M.stone, 5, x, G + 13.5, z);
  });

  // the roofs and banners
  const spire = (x, y, z, r, h) => {
    add(cone(r, h), M.roof, 6, x, y, z);
    add(cyl(0.12, 2.6, 0.12, 10), M.gold, 6, x, y + h - 0.3, z);
    add(new THREE.SphereGeometry(0.22, 14, 10).translate(0, 0.2, 0), M.gold, 6, x, y + h + 2.3, z);
    add(flagGeo(), M.flag, 6, x + 0.1, y + h + 1.5, z, -0.6, { flag: true });
  };
  corners.forEach(([x, z]) => spire(x, G + 11.8, z, 3.4, 5.6));
  spire(K[0], G + 6.1 + kh, K[1], 2.9, 4.8);
  turrets.forEach(([x, z]) => spire(x, G + 14.4, z, 1.8, 4.2));

  // the lights: arched windows on every tower, turret and the keep
  const ring = (cx, cz, r, y, angles, w = 0.75, h = 1.4) => angles.forEach((a) => {
    add(arch(w, h), M.glass, 7, cx + Math.sin(a) * (r + 0.02), y, cz + Math.cos(a) * (r + 0.02), a, { window: true });
  });
  corners.forEach(([x, z]) => {
    const out = Math.atan2(x, z);
    ring(x, z, 2.6, G + 4.2, [out - 0.5, out + 0.5]);
    ring(x, z, 2.6, G + 7.2, [out]);
  });
  ring(K[0], K[1], 3.5, G + 6.5, [0.35, -0.35, 1.2, -1.2]);
  ring(K[0], K[1], 3.5, G + 10, [0, 0.9, -0.9]);
  ring(K[0], K[1], 2.3, G + 3.4 + kh, [0.4, -0.4, 1.3, -1.3], 0.6, 1.1);
  turrets.forEach(([x, z]) => ring(x, z, 1.25, G + 11.4, [0.4, -0.4, 1.6, -1.6], 0.42, 0.85));
  [-1.9, 1.9].forEach((x) => add(arch(0.8, 1.5), M.glass, 7, x, G + 4.3, 10.53, 0, { window: true }));

  // Research and ideation are one chapter, so the footing is built with the foundations and every later part moves down one.
  P.forEach((o) => { o.part = Math.max(0, o.part - 1); });
  // the last chapter also lights the windows
  P.forEach((o) => { o.part = Math.min(o.part, PARTS - 1); });

  // Build order inside a part: low before high, centre before edge.
  for (let p = 0; p < PARTS; p++) {
    const set = P.filter((o) => o.part === p).sort((a, c) => (a.y - c.y) || (Math.hypot(a.x, a.z) - Math.hypot(c.x, c.z)));
    set.forEach((o, i) => {
      o.start = p + 0.06 + 0.66 * (i / Math.max(1, set.length - 1));
      o.end = o.start + 0.26;
    });
  }
  return P;
}

/**
 * mountCastle(canvas, { mode: 'scroll' | 'still', part })
 * scroll: fixed behind the home page, built by [data-part] bands.
 * still: built up to `part`, with that part outlined, for a chapter page.
 */
export function mountCastle(canvas, { mode = 'scroll', part = 0 } = {}) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) {
    return null;
  }
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x000000, 0);

  const tok = readTokens();
  const C = {
    wall: tok('--castle-wall'), stone: tok('--castle-stone'), paving: tok('--castle-paving'), roof: tok('--castle-roof'),
    gold: tok('--castle-gold'), wood: tok('--castle-wood'), glass: tok('--castle-glass'), glow: tok('--castle-glow'),
    key: tok('--castle-key'), sky: tok('--castle-sky'), ground: tok('--castle-ground'),
    ink: tok('--color-ink'), accent: tok('--color-accent'),
  };
  const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.82, metalness: 0, ...o });
  const M = {
    wall: std(C.wall), stone: std(C.stone), roof: std(C.roof, { roughness: 0.7 }), gold: std(C.gold, { roughness: 0.4, metalness: 0.35 }),
    wood: std(C.wood), glass: std(C.glass, { emissive: C.glow, emissiveIntensity: 0 }), flag: std(C.roof, { side: THREE.DoubleSide, roughness: 0.9 }),
    paving: std(C.paving, { map: pavingTexture(C.paving, C.stone) }),
  };
  M.paving.map.repeat.set(1 / 28, 1 / 28);
  M.paving.map.offset.set(0.5, 0.5);

  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(C.sky, C.ground, 1.5));
  const sun = new THREE.DirectionalLight(C.key, 2.6);
  sun.position.set(-16, 30, 20);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -22, right: 22, top: 22, bottom: -22, near: 1, far: 90 });
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.03;
  sun.shadow.radius = 4;
  scene.add(sun);
  const rim = new THREE.DirectionalLight(C.accent, 0.5);
  rim.position.set(20, 8, -12);
  scene.add(rim);

  // Each piece: a solid that rises from its base, and a hologram (lines and a faint glow) that fades as it does.
  const pieces = plan(M).map((o) => {
    const solid = new THREE.Mesh(o.geo, o.mat);
    solid.castShadow = !o.window && !o.flag;
    solid.receiveShadow = true;
    const pivot = new THREE.Group();
    pivot.position.set(o.x, o.y, o.z);
    pivot.rotation.y = o.ry;
    pivot.add(solid);
    scene.add(pivot);

    const holo = new THREE.Group();
    holo.position.copy(pivot.position);
    holo.rotation.y = o.ry;
    const lineMat = new THREE.LineBasicMaterial({ color: C.ink, transparent: true, opacity: 0, depthWrite: false });
    const glowMat = new THREE.MeshBasicMaterial({ color: C.ink, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
    holo.add(new THREE.LineSegments(new THREE.EdgesGeometry(o.geo, 24), lineMat));
    if (!o.window) holo.add(new THREE.Mesh(o.geo, glowMat));
    scene.add(holo);
    return { ...o, pivot, solid, lineMat, glowMat };
  });
  const flags = pieces.filter((o) => o.flag);

  const camera = new THREE.PerspectiveCamera(28, 1, 1, 600);
  const target = new THREE.Vector3(0, 8.5, 0);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Opening the home page: the camera rushes in on the castle, streaked by a radial zoom blur, then lands.
  const rush = mode === 'scroll' && !reduce && window.scrollY < 40;
  const RUSH_MS = 1900;
  let blurTarget = null;
  const blurMat = new THREE.ShaderMaterial({
    uniforms: { tDiffuse: { value: null }, uStrength: { value: 0 }, uCenter: { value: new THREE.Vector2(0.5, 0.5) } },
    vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
    fragmentShader: `
      uniform sampler2D tDiffuse; uniform float uStrength; uniform vec2 uCenter; varying vec2 vUv;
      void main() {
        vec2 dir = vUv - uCenter;
        vec4 acc = vec4(0.0); float total = 0.0;
        for (int i = 0; i < 28; i++) {
          float k = float(i) / 27.0, w = 1.0 - 0.6 * k;
          acc += texture2D(tDiffuse, vUv - dir * k * uStrength) * w; total += w;
        }
        // the target holds linear, premultiplied colour: convert it as the direct render would, then premultiply again
        vec4 c = acc / total;
        gl_FragColor = vec4(c.a > 0.0001 ? c.rgb / c.a : vec3(0.0), c.a);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        gl_FragColor.rgb *= gl_FragColor.a;
      }`,
    blending: THREE.NoBlending, depthTest: false, depthWrite: false,
  });
  const blurScene = new THREE.Scene();
  blurScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), blurMat));
  const blurCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const easeInOut = (x) => (x < 0.5 ? 8 * x ** 4 : 1 - (-2 * x + 2) ** 4 / 2);

  let W = 1, H = 1, dist = 80, wide = true;
  function resize() {
    W = canvas.clientWidth || 1;
    H = canvas.clientHeight || 1;
    wide = mode === 'still' || W >= 960;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(W, H, false);
    const aspect = W / H;
    const fillW = mode === 'still' ? 0.9 : wide ? 0.5 : 0.92;
    dist = Math.max(mode === 'still' ? 74 : 86, 34 / (fillW * 0.4988 * aspect));
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    if (blurTarget) blurTarget.setSize(W * renderer.getPixelRatio(), H * renderer.getPixelRatio());
    kick();
  }

  const s = { p: 0, offX: 0, offY: 0, wave: 0, zoom: 1, dim: 1 };
  const goal = { p: 0, offX: 0, offY: 0, zoom: 1, dim: 1 };
  let first = true, last = performance.now(), running = false, t = 0;
  const born = performance.now();
  const bands = mode === 'scroll' ? [...document.querySelectorAll('[data-part]')] : [];
  const finish = document.querySelector('[data-castle="finish"]');

  function measure() {
    if (mode === 'still') { goal.p = part + 1; goal.offX = 0; goal.offY = 0.02; goal.zoom = 1; goal.dim = 1; return; }
    const vh = window.innerHeight;
    let p = 0;
    // a band starts building as it enters and is done once its text reaches the middle of the screen
    bands.forEach((el) => { p += clamp((vh * 0.85 - el.getBoundingClientRect().top) / (vh * 0.62)); });
    goal.p = reduce ? PARTS : p;
    const s1 = clamp(window.scrollY / (vh * 0.7));
    const fr = finish ? finish.getBoundingClientRect() : null;
    const s2 = fr ? clamp((vh - fr.top) / (vh * 0.8)) : 0;
    const s3 = fr ? clamp(-fr.top / vh, 0, 1.5) : 0; // past the statement, the castle leaves with the page
    goal.dim = lerp(0.3, 1, s1); // behind the headline the hologram stays quiet
    if (wide) {
      const tight = clamp((1440 - W) / 480) * 0.06; // narrower screens push the castle further from the text
      goal.offX = lerp(lerp(0, -0.245 - tight, s1), 0, s2);
      goal.offY = lerp(0.02, 0.03, s2) + s3;
      goal.zoom = lerp(lerp(0.95, 0.9, s1), 0.86, s2);
    } else {
      goal.offX = 0;
      goal.offY = lerp(lerp(0.06, 0.27, s1), 0.04, s2) + s3;
      goal.zoom = lerp(1.05, 1, s1);
    }
  }

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    measure();
    if (first) { Object.assign(s, goal); first = false; } // a reload mid-page starts where the page is
    const k = reduce ? 1 : 1 - Math.exp(-dt * 3.2), kl = reduce ? 1 : 1 - Math.exp(-dt * 5);
    const prevP = s.p;
    s.p = lerp(s.p, goal.p, k);
    s.offX = lerp(s.offX, goal.offX, kl);
    s.offY = lerp(s.offY, goal.offY, kl);
    s.zoom = lerp(s.zoom, goal.zoom, kl);
    s.dim = lerp(s.dim, goal.dim, kl);
    const vel = Math.abs(s.p - prevP) / Math.max(dt, 0.001);
    s.wave = reduce ? 0 : lerp(s.wave, clamp(vel * 1.4), 1 - Math.exp(-dt * 2.5));
    t += dt * (0.4 + s.wave);

    const rt = rush ? clamp((now - born) / RUSH_MS) : 1;
    const q = easeInOut(rt);
    const speed = rush && rt < 1 ? (easeInOut(clamp((now - born + 16) / RUSH_MS)) - q) * (RUSH_MS / 16) : 0;
    const intro = reduce ? 1 : rush ? clamp(rt * 1.6) : 1 - Math.pow(1 - clamp((now - born) / 1600), 3);
    // the part being built, or the one just finished, is the band being read
    const active = mode === 'still' ? part : s.p < 0.03 || s.p > PARTS - 0.03 ? -1 : Math.min(PARTS - 1, Math.ceil(s.p - 0.001) - 1);
    pieces.forEach((o) => {
      const raw = clamp((s.p - o.start) / (o.end - o.start));
      const e = 1 - Math.pow(1 - raw, 3);
      o.pivot.visible = raw > 0;
      o.pivot.scale.y = Math.max(e, 0.001);
      const act = o.part === active;
      const ghost = (1 - raw) * intro * s.dim;
      o.lineMat.opacity = ghost * (act ? 0.85 : 0.3);
      o.lineMat.color.copy(act ? C.accent : C.ink);
      o.glowMat.opacity = ghost * (act ? 0.05 : 0.018);
      o.glowMat.color.copy(act ? C.accent : C.ink);
    });
    M.glass.emissiveIntensity = clamp((s.p - (PARTS - 0.7)) / 0.6) * 1.6;

    flags.forEach((o) => { // flags ripple when the page moves
      const pos = o.solid.geometry.attributes.position, rest = o.solid.geometry.userData.rest;
      for (let i = 0; i < pos.count; i++) {
        const u = rest[i * 3] / 2.2;
        pos.setZ(i, (Math.sin(t * 2.6 + u * 4.2) * 0.45 * s.wave + Math.sin(u * 3.0) * 0.14) * u);
      }
      pos.needsUpdate = true;
    });

    const az = (mode === 'still' ? 0.62 : 0.78 - s.p * (0.52 / PARTS)) + (1 - q) * 0.55;
    const el = 0.42 + (1 - q) * 0.22;
    const d = dist * lerp(5, 1, q); // the rush: from far away to the hero's framing
    camera.position.set(Math.sin(az) * Math.cos(el) * d, target.y + Math.sin(el) * d, Math.cos(az) * Math.cos(el) * d);
    camera.lookAt(target);
    camera.zoom = s.zoom;
    camera.setViewOffset(W, H, s.offX * W, s.offY * H, W, H);
    const blur = clamp(speed * 0.11, 0, 0.32);
    if (blur > 0.004) {
      if (!blurTarget) blurTarget = new THREE.WebGLRenderTarget(W * renderer.getPixelRatio(), H * renderer.getPixelRatio(), { type: THREE.HalfFloatType });
      renderer.setRenderTarget(blurTarget);
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      blurMat.uniforms.tDiffuse.value = blurTarget.texture;
      blurMat.uniforms.uStrength.value = blur;
      blurMat.uniforms.uCenter.value.set(0.5 + s.offX, 0.5 + s.offY);
      renderer.render(blurScene, blurCam);
    } else {
      renderer.render(scene, camera);
    }

    const settled = Math.abs(s.p - goal.p) < 0.0005 && Math.abs(s.offX - goal.offX) < 0.0005 && Math.abs(s.offY - goal.offY) < 0.0005 && Math.abs(s.zoom - goal.zoom) < 0.0005 && Math.abs(s.dim - goal.dim) < 0.002 && s.wave < 0.002 && intro >= 1 && rt >= 1;
    if (settled) { running = false; return; }
    requestAnimationFrame(frame);
  }

  function kick() {
    if (running) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  if (mode === 'scroll') window.addEventListener('scroll', kick, { passive: true });
  canvas.classList.add('is-ready');
  return { kick };
}
