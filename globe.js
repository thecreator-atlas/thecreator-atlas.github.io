// The world Atlas carries: a WebGL dot globe. Messages arc from example customers to Laguna as the
// scene scrolls; the globe turns from the visitor's time zone to Laguna. Technique adapted from the
// 21st.dev "Interactive Globe" (Fibonacci dots, arcs with travelling light, drag to rotate).
import * as THREE from './vendor/three.module.min.js';

const wrap = document.getElementById('globe');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

function webgl() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); }
  catch (e) { return false; }
}

// Rough continent outlines as [lon, lat] rings. Good enough to read as Earth at dot resolution.
const LAND = [
  [[-166,68],[-156,71],[-140,70],[-128,70],[-115,68],[-95,72],[-82,73],[-78,66],[-64,60],[-56,52],[-66,45],[-70,42],[-76,38],[-76,35],[-81,31],[-80,25],[-82,28],[-84,30],[-90,29],[-97,27],[-97,22],[-94,18],[-88,16],[-84,11],[-79,9],[-82,8],[-86,12],[-92,14],[-105,20],[-110,24],[-112,29],[-115,30],[-117,32],[-120,34],[-124,40],[-124,46],[-125,49],[-130,54],[-136,58],[-145,60],[-152,59],[-158,57],[-164,55],[-162,60],[-166,62]],
  [[-73,78],[-60,82],[-30,83],[-20,80],[-20,72],[-30,68],[-42,60],[-50,64],[-55,70],[-60,76]],
  [[-80,9],[-75,11],[-62,10],[-52,5],[-50,0],[-44,-2],[-35,-6],[-35,-9],[-39,-15],[-41,-22],[-48,-26],[-53,-33],[-58,-38],[-62,-41],[-65,-45],[-68,-50],[-70,-54],[-74,-50],[-74,-42],[-73,-35],[-71,-28],[-70,-18],[-76,-14],[-81,-6],[-80,-2],[-78,2]],
  [[-85,22],[-74,20],[-77,21.5],[-82,23]],
  [[-24,65],[-14,64],[-14,66],[-22,66.5]],
  [[-10,36],[-9,43],[-2,44],[-4,48],[2,51],[5,53],[8,54],[9,57],[5,58],[5,62],[10,64],[15,68],[20,70],[28,71],[35,69],[42,67],[45,68],[60,69],[60,55],[50,46],[40,41],[29,41],[26,40],[23,36],[20,40],[15,38],[18,41],[13,45],[12,44],[16,41],[10,44],[8,44],[3,43],[0,39],[-2,37],[-6,36]],
  [[-5,50],[1,51],[2,53],[-1,55],[-2,57],[-4,58.5],[-6,57],[-5,55],[-3,54],[-4,53],[-5,52]],
  [[-10,52],[-6,52],[-6,55],[-8,55],[-10,54]],
  [[-17,21],[-16,28],[-10,30],[-6,36],[10,37],[11,33],[20,31],[25,32],[32,31],[35,28],[39,20],[43,12],[51,12],[48,5],[42,-2],[40,-10],[40,-16],[35,-24],[32,-29],[27,-34],[20,-35],[18,-30],[15,-26],[12,-17],[13,-11],[9,-1],[9,4],[5,5],[-1,5],[-8,4],[-13,8],[-17,14]],
  [[44,-25],[47,-25],[50,-15],[49,-12],[44,-16]],
  [[26,40],[36,36],[35,32],[34,28],[39,21],[43,13],[45,13],[52,16],[57,19],[59,22],[56,26],[52,24],[50,30],[56,27],[62,25],[67,24],[72,21],[73,16],[77,8],[80,13],[80,16],[87,21],[92,22],[94,17],[98,16],[98,9],[100,4],[104,1],[103,4],[101,7],[103,10],[105,9],[109,12],[108,16],[106,20],[110,21],[117,23],[121,28],[122,31],[119,35],[122,37],[118,39],[122,40],[126,38],[129,35],[130,42],[136,44],[141,48],[140,53],[135,55],[143,59],[155,59],[156,51],[163,57],[163,61],[180,65],[180,69],[170,70],[160,70],[150,72],[140,73],[128,72],[115,74],[105,78],[95,76],[85,75],[75,73],[70,73],[68,69],[60,69],[60,55],[50,46],[40,41],[29,41]],
  [[130,31],[132,34],[135,34],[140,35],[141,38],[142,41],[140,41],[139,38],[136,37],[133,35],[130,34]],
  [[140,42],[145,43],[145,44.5],[142,45.5],[140,43.5]],
  [[120.2,22.5],[121.9,25],[121,25],[120,23.5]],
  [[120,18.5],[122,18.5],[122.5,16],[124,13.5],[122,13.8],[121,14],[120.5,14.5],[120,16]],
  [[122.5,11.5],[125,11],[125,12.5],[123.5,12.5]],
  [[122,7],[126,6],[126.5,8.5],[125,9.5],[123,8.5]],
  [[109,1.5],[111,-3],[116,-4],[118,1],[117,6.5],[115,5],[111,2.5]],
  [[95,5.5],[98,4],[104,-2],[106,-6],[102,-4],[96,2]],
  [[105,-6.5],[114,-7.5],[114,-8.5],[106,-7.5]],
  [[119,-5.5],[120,1],[124,1.5],[121,-1],[123,-5]],
  [[131,-1],[141,-2.5],[150,-6],[150,-10.5],[141,-9],[137,-5],[132,-3]],
  [[80,6],[82,7],[80,9.8]],
  [[114,-22],[114,-34],[118,-35],[123,-34],[131,-31.5],[135,-35],[138,-35],[141,-38],[147,-39],[150,-37],[153,-31],[153,-25],[146,-19],[142,-11],[136,-12],[136,-15],[130,-12],[126,-14],[122,-17],[117,-20]],
  [[172,-34.5],[178,-37.5],[175,-41.5],[171,-44],[167,-46.5],[170,-46],[174,-41],[174,-37]]
];
const WATER = [
  [[-95,58],[-80,52],[-78,60],[-88,64],[-94,62]],
  [[28,42],[41,41],[40,45],[30,46]],
  [[47,45],[50,37],[54,37],[53,44]]
];
function inRing(lon, lat, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
function isLand(lon, lat) {
  if (lat < -72) return true;
  if (WATER.some(r => inRing(lon, lat, r))) return false;
  return LAND.some(r => inRing(lon, lat, r));
}
// lon 0 faces +z (the camera) when the globe is unrotated
function v3(lat, lon, r = 1) {
  const la = THREE.MathUtils.degToRad(lat), lo = THREE.MathUtils.degToRad(lon);
  return new THREE.Vector3(r * Math.cos(la) * Math.sin(lo), r * Math.sin(la), r * Math.cos(la) * Math.cos(lo));
}

const LAGUNA = [14.27, 121.41];
// Example customers for the example inbox (illustrative, not real clients)
const SENDERS = [[30.27, -97.74], [51.51, -0.13], [25.2, 55.27], [43.65, -79.38], [-33.87, 151.21]];
const ZONE_COORDS = {
  'America/Los_Angeles':[34.05,-118.24],'America/Denver':[39.74,-104.99],'America/Chicago':[41.88,-87.63],
  'America/New_York':[40.71,-74.0],'America/Toronto':[43.65,-79.38],'America/Sao_Paulo':[-23.55,-46.63],
  'Europe/London':[51.51,-0.13],'Europe/Berlin':[52.52,13.4],'Asia/Dubai':[25.2,55.27],'Asia/Kolkata':[19.07,72.88],
  'Asia/Singapore':[1.35,103.82],'Asia/Manila':[14.6,120.98],'Asia/Tokyo':[35.68,139.69],'Australia/Sydney':[-33.87,151.21],
  'Pacific/Auckland':[-36.85,174.76]
};
function zoneCoords(zone) {
  if (ZONE_COORDS[zone]) return ZONE_COORDS[zone];
  const off = window.atlasOffset ? window.atlasOffset(zone) : -new Date().getTimezoneOffset();
  return [25, Math.max(-179, Math.min(179, off / 4))];
}

if (wrap && webgl()) start();

function start() {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  wrap.innerHTML = '';
  wrap.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
  camera.position.set(0, 0, 4.4);

  const world = new THREE.Group();
  scene.add(world);

  // occluder hides the far side's dots
  world.add(new THREE.Mesh(new THREE.SphereGeometry(0.985, 64, 64), new THREE.MeshBasicMaterial({ color: 0x14070f })));

  // land dots on a Fibonacci sphere
  const N = 26000, pos = [], golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2, rad = Math.sqrt(1 - y * y), th = golden * i;
    const x = Math.cos(th) * rad, z = Math.sin(th) * rad;
    const lat = THREE.MathUtils.radToDeg(Math.asin(y));
    const lon = THREE.MathUtils.radToDeg(Math.atan2(x, z));
    if (isLand(lon, lat)) pos.push(x, y, z);
  }
  const dotGeo = new THREE.BufferGeometry();
  dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  const dotMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { uSize: { value: 3.2 }, uPR: { value: renderer.getPixelRatio() }, uColor: { value: new THREE.Color(0xf6dbe8) } },
    vertexShader: `uniform float uSize; uniform float uPR; varying float vF;
      void main(){ vec3 n = normalize(normalMatrix * position); vF = n.z;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = uSize * uPR * (0.55 + 0.45 * max(n.z, 0.0));
        gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform vec3 uColor; varying float vF;
      void main(){ vec2 c = gl_PointCoord - 0.5; if (dot(c,c) > 0.25) discard;
        gl_FragColor = vec4(uColor, smoothstep(-0.05, 0.55, vF) * 0.95); }`
  });
  world.add(new THREE.Points(dotGeo, dotMat));

  // markers
  const PINK = 0xff488b;
  function marker(color, size) {
    const g = new THREE.Group();
    const dot = new THREE.Mesh(new THREE.SphereGeometry(size, 16, 16), new THREE.MeshBasicMaterial({ color }));
    const ring = new THREE.Mesh(new THREE.RingGeometry(size * 1.6, size * 2.1, 40), new THREE.MeshBasicMaterial({ color, transparent: true, side: THREE.DoubleSide }));
    g.add(dot, ring); g.userData.ring = ring; world.add(g); return g;
  }
  function place(g, lat, lon) {
    const p = v3(lat, lon, 1.005); g.position.copy(p); g.lookAt(p.clone().multiplyScalar(2));
  }
  const home = marker(PINK, 0.022); place(home, ...LAGUNA);
  const you = marker(0xffffff, 0.016);

  // arcs from example senders to Laguna
  const target = v3(...LAGUNA);
  const arcs = SENDERS.map(([la, lo]) => {
    const a = v3(la, lo), pts = [];
    const ang = a.angleTo(target);
    for (let i = 0; i <= 80; i++) {
      const t = i / 80;
      const p = new THREE.Vector3().copy(a).lerp(target, t).normalize();
      p.multiplyScalar(1 + Math.sin(Math.PI * t) * (0.12 + ang * 0.16));
      pts.push(p);
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: PINK, transparent: true, opacity: 0.9 }));
    geo.setDrawRange(0, 0);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.014, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    head.visible = false;
    const src = marker(0xf6dbe8, 0.01); place(src, la, lo);
    world.add(line, head);
    return { pts, geo, head };
  });

  // view: start facing the visitor, turn to Laguna as the scene scrolls
  let youLL = zoneCoords(window.atlasZone || 'UTC');
  function setYou() { youLL = zoneCoords(window.atlasZone || 'UTC'); place(you, ...youLL); }
  setYou();
  addEventListener('atlas:zone', setYou);

  let dragY = 0, dragX = 0, drag = null, idle = 0;
  const cv = renderer.domElement;
  cv.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, dy: dragY, dx: dragX }; cv.setPointerCapture(e.pointerId); });
  cv.addEventListener('pointermove', e => {
    if (!drag) return;
    dragY = drag.dy + (e.clientX - drag.x) * 0.006;
    dragX = Math.max(-0.6, Math.min(0.6, drag.dx + (e.clientY - drag.y) * 0.004));
  });
  const end = () => { drag = null; };
  cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);

  function resize() {
    const w = wrap.clientWidth, h = wrap.clientHeight || w;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    dotMat.uniforms.uSize.value = w < 500 ? 2.4 : 3.2;
  }
  new ResizeObserver(resize).observe(wrap); resize();

  let visible = true;
  new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { rootMargin: '200px' }).observe(wrap);

  const ease = t => 1 - Math.pow(1 - t, 3);
  let rotY = 0, rotX = 0, clock = 0, last = performance.now();
  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!visible) return;
    clock += dt;
    const p = window.atlasCarry ?? 1;
    const turn = ease(Math.min(1, p / 0.85));
    const fromLon = youLL[1], toLon = LAGUNA[1];
    let dLon = toLon - fromLon; if (dLon > 180) dLon -= 360; if (dLon < -180) dLon += 360;
    const lon = fromLon + dLon * turn, lat = youLL[0] + (LAGUNA[0] - youLL[0]) * turn;
    const drift = reduce ? 0 : Math.sin(clock * 0.15) * 0.08;
    const goalY = -THREE.MathUtils.degToRad(lon) + dragY + drift;
    const goalX = THREE.MathUtils.degToRad(lat) * 0.8 + dragX;
    rotY += (goalY - rotY) * (reduce ? 1 : 0.08);
    rotX += (goalX - rotX) * (reduce ? 1 : 0.08);
    world.rotation.set(rotX, rotY, 0, 'XYZ');

    arcs.forEach((a, i) => {
      const s = 0.04 + i * 0.16, k = Math.max(0, Math.min(1, (p - s) / 0.12));
      const n = Math.floor(k * (a.pts.length - 1));
      a.geo.setDrawRange(0, n + 1);
      a.head.visible = k > 0 && k < 1;
      if (a.head.visible) a.head.position.copy(a.pts[n]);
    });
    if (!reduce) {
      const pulse = (clock * 0.8) % 1;
      home.userData.ring.scale.setScalar(1 + pulse * 1.6);
      home.userData.ring.material.opacity = 1 - pulse;
      you.userData.ring.material.opacity = 0.6;
    }
    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
}
