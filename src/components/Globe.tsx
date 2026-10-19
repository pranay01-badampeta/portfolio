import { useEffect, useRef } from "react";
import type * as T from "three";

type Three = typeof import("three");

/**
 * A planet made of dots with two orbiting satellites. It spins on its own, can be dragged a full
 * 360° in any direction, and leans towards the pointer. Three.js is loaded on demand so the first
 * paint stays fast; the animation pauses when the globe is off-screen or the tab is hidden.
 */
export default function Globe({ className = "" }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    import("three").then((THREE) => {
      if (!disposed && host.current) cleanup = mount(THREE, host.current);
    });
    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <div ref={host} className={`touch-pan-y ${className}`} aria-hidden="true" />;
}

// Latitude/longitude (degrees) to a point on the unit sphere, matching the dot layout below.
const fromLatLng = (lat: number, lng: number, r = 1): [number, number, number] => {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return [-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta)];
};

const HYDERABAD = { lat: 17.385, lng: 78.4867 };
const PARIS = { lat: 48.8566, lng: 2.3522 };

function mount(THREE: Three, el: HTMLDivElement) {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  el.appendChild(renderer.domElement);
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0, 5.2);

  const world = new THREE.Group(); // tilt + drag
  const planet = new THREE.Group(); // spin
  world.rotation.z = 0.32;
  world.add(planet);
  scene.add(world);

  // Dots on a Fibonacci sphere: even spacing, no seams at the poles.
  const N = 4200;
  const pos: number[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = golden * i;
    pos.push(Math.cos(t) * r, y, Math.sin(t) * r);
  }
  const dotGeo = new THREE.BufferGeometry();
  dotGeo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  planet.add(new THREE.Points(dotGeo, new THREE.PointsMaterial({ size: 0.021, color: "#a8d6ff", transparent: true, opacity: 0.8, depthWrite: false })));
  // A dark core hides the dots on the far side, so the planet reads as solid.
  // Its edge glows blue (a "fresnel" rim), like an atmosphere lit from behind.
  const core = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        float rim = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.6);
        vec3 base = vec3(0.035, 0.05, 0.075);
        gl_FragColor = vec4(mix(base, vec3(0.49, 0.77, 1.0), rim * 0.85), 1.0);
      }`,
  });
  planet.add(new THREE.Mesh(new THREE.SphereGeometry(0.985, 64, 64), core));

  // Home → Paris: two glowing markers joined by an arc, with a light travelling along it.
  const a = new THREE.Vector3(...fromLatLng(HYDERABAD.lat, HYDERABAD.lng, 1.01));
  const b = new THREE.Vector3(...fromLatLng(PARIS.lat, PARIS.lng, 1.01));
  const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(1.45);
  const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
  planet.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(80)), new THREE.LineBasicMaterial({ color: "#7cc4ff", transparent: true, opacity: 0.8 })));
  const markers: T.Mesh[] = [];
  for (const p of [a, b]) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.028, 16, 16), new THREE.MeshBasicMaterial({ color: "#ffffff" }));
    m.position.copy(p);
    planet.add(m);
    const halo = new THREE.Mesh(new THREE.RingGeometry(0.04, 0.055, 32), new THREE.MeshBasicMaterial({ color: "#7cc4ff", transparent: true, side: THREE.DoubleSide }));
    halo.position.copy(p);
    halo.lookAt(p.clone().multiplyScalar(2));
    planet.add(halo);
    markers.push(halo);
  }
  const traveller = new THREE.Mesh(new THREE.SphereGeometry(0.02, 12, 12), new THREE.MeshBasicMaterial({ color: "#ffffff" }));
  planet.add(traveller);
  // Start with the arc facing the viewer.
  planet.rotation.y = -((HYDERABAD.lng + PARIS.lng) / 2 + 90) * (Math.PI / 180);

  // Soft glow behind the planet.
  const glowCanvas = document.createElement("canvas");
  glowCanvas.width = glowCanvas.height = 256;
  const gctx = glowCanvas.getContext("2d")!;
  const grad = gctx.createRadialGradient(128, 128, 40, 128, 128, 128);
  grad.addColorStop(0.42, "rgba(124,196,255,0.16)");
  grad.addColorStop(0.6, "rgba(61,143,214,0.06)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  gctx.fillStyle = grad;
  gctx.fillRect(0, 0, 256, 256);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(glowCanvas), depthWrite: false, transparent: true }));
  glow.scale.set(3.4, 3.4, 1);
  glow.position.z = -0.6;
  scene.add(glow);

  // Two orbits, each with a satellite.
  const orbits: { pivot: T.Group; speed: number }[] = [];
  const addOrbit = (radius: number, tiltX: number, tiltZ: number, speed: number) => {
    const ring = new THREE.Group();
    ring.rotation.set(tiltX, 0, tiltZ);
    const pts = Array.from({ length: 160 }, (_, i) => {
      const a = (i / 160) * Math.PI * 2;
      return new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius);
    });
    const line = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color: "#7cc4ff", transparent: true, opacity: 0.22 }),
    );
    ring.add(line);
    const pivot = new THREE.Group();
    const sat = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 16), new THREE.MeshBasicMaterial({ color: "#ffffff" }));
    sat.position.x = radius;
    pivot.add(sat);
    ring.add(pivot);
    world.add(ring);
    orbits.push({ pivot, speed });
  };
  addOrbit(1.32, 1.15, 0.25, 0.006);
  addOrbit(1.55, 1.9, -0.5, -0.0042);

  // Size to the container.
  const resize = () => {
    const { clientWidth: w, clientHeight: h } = el;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(el);
  resize();

  // Drag to spin (any direction), with inertia; the pointer elsewhere tilts it slightly.
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let velY = reduceMotion ? 0 : 0.0016;
  let velX = 0;
  let leanX = 0;
  let leanY = 0;
  const idleSpin = reduceMotion ? 0 : 0.0016;
  const onDown = (e: PointerEvent) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    el.setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent) => {
    if (dragging) {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      velY = dx * 0.006;
      velX = e.pointerType === "touch" ? 0 : dy * 0.006;
      planet.rotation.y += velY;
      world.rotation.x = THREE.MathUtils.clamp(world.rotation.x + velX, -1.2, 1.2);
    }
  };
  const onUp = () => (dragging = false);
  const onLean = (e: PointerEvent) => {
    leanX = (e.clientY / innerHeight - 0.5) * 0.25;
    leanY = (e.clientX / innerWidth - 0.5) * 0.35;
  };
  el.addEventListener("pointerdown", onDown);
  el.addEventListener("pointermove", onMove);
  el.addEventListener("pointerup", onUp);
  el.addEventListener("pointercancel", onUp);
  if (!reduceMotion) addEventListener("pointermove", onLean);

  // Render only while visible.
  let visible = true;
  const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
  io.observe(el);

  let raf = 0;
  const tick = () => {
    raf = requestAnimationFrame(tick);
    if (!visible || document.hidden) return;
    if (!dragging) {
      velY += (idleSpin - velY) * 0.03; // ease back to the idle spin after a throw
      planet.rotation.y += velY;
      world.rotation.x += (leanX - world.rotation.x) * 0.03;
    }
    world.rotation.y += (leanY - world.rotation.y) * 0.03;
    for (const o of orbits) o.pivot.rotation.y += reduceMotion ? 0 : o.speed;
    const t = (performance.now() / 2600) % 1;
    traveller.position.copy(curve.getPoint(t));
    markers.forEach((m, i) => m.scale.setScalar(1 + ((t + i * 0.5) % 1) * 1.6));
    markers.forEach((m, i) => ((m.material as T.MeshBasicMaterial).opacity = 1 - ((t + i * 0.5) % 1)));
    renderer.render(scene, camera);
  };
  tick();

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    removeEventListener("pointermove", onLean);
    scene.traverse((o) => {
      const m = o as T.Mesh;
      m.geometry?.dispose();
      const mat = m.material as T.Material | T.Material[] | undefined;
      (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((x) => x.dispose());
    });
    renderer.dispose();
    renderer.domElement.remove();
  };
}
