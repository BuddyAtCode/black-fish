import type { MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import BrandMark from "./BrandMark";
import { createTattooHand, poseTattooHand } from "./TattooHand";

const VIEW_HEIGHT = 5.8;

export default function InksoulArtifactScene({ progress }: { progress: MotionValue<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (failed) return;
    const canvas = canvasRef.current;
    const viewport = canvas?.parentElement;
    if (!canvas || !viewport) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    } catch {
      setFailed(true);
      return;
    }
    renderer.setClearColor(0x050505, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-5, 5, VIEW_HEIGHT / 2, -VIEW_HEIGHT / 2, 0.1, 60);
    camera.position.set(0, 0, 16);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, 0.04);
    room.dispose();
    scene.environment = environment.texture;
    scene.environmentIntensity = 0.72;
    const hand = createTattooHand();
    scene.add(hand);

    scene.add(new THREE.HemisphereLight(0xece8df, 0x17131c, 1.2));
    const key = new THREE.DirectionalLight(0xfff4e6, 3.2);
    key.position.set(-3, 5, 7);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xaebdd0, 2.4);
    rim.position.set(2, 1, -4);
    scene.add(rim);
    const red = new THREE.PointLight(0xd31625, 22, 10, 2);
    red.position.set(-1, -3, 2);
    scene.add(red);

    const particlePositions = new Float32Array(140 * 3);
    let seed = 17;
    const random = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    for (let i = 0; i < particlePositions.length; i += 3) {
      particlePositions[i] = (random() - 0.5) * 15;
      particlePositions[i + 1] = (random() - 0.5) * 7;
      particlePositions[i + 2] = -random() * 4;
    }
    const particles = new THREE.Points(
      new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(particlePositions, 3)),
      new THREE.PointsMaterial({ color: 0xbeb6ac, opacity: 0.2, size: 0.012, transparent: true, depthWrite: false }),
    );
    scene.add(particles);

    const pointer = new THREE.Vector2();
    const pointerTarget = new THREE.Vector2();
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let smoothProgress = progress.get();
    let active = false;
    let frame = 0;
    let previousTime = 0;
    let elapsed = 0;
    let mobile = false;
    const resize = () => {
      const { width, height } = viewport.getBoundingClientRect();
      if (!width || !height) return;
      mobile = width <= 720;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.65));
      renderer.setSize(width, height, false);
      const halfWidth = VIEW_HEIGHT * width / height / 2;
      camera.left = -halfWidth;
      camera.right = halfWidth;
      camera.updateProjectionMatrix();
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pointerTarget.set((event.clientX / window.innerWidth - 0.5) * 2, (event.clientY / window.innerHeight - 0.5) * 2);
    };
    const leave = () => pointerTarget.set(0, 0);
    const contextLost = (event: Event) => { event.preventDefault(); setFailed(true); };

    const stop = () => {
      window.cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
    };
    const render = (time: number) => {
      if (!active || document.hidden) { stop(); return; }
      const delta = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 1 / 60;
      previousTime = time;
      const reduced = motionPreference.matches;
      if (!reduced) elapsed += delta;
      smoothProgress = reduced ? progress.get() : THREE.MathUtils.lerp(smoothProgress, progress.get(), 1 - Math.exp(-8 * delta));
      pointer.lerp(pointerTarget, 1 - Math.exp(-5 * delta));
      const p = THREE.MathUtils.clamp(smoothProgress, 0, 1);
      const drift = reduced ? 0 : Math.sin(elapsed * 0.6) * 0.022;
      poseTattooHand(hand, p, camera.right, mobile, reduced ? 0 : pointer.x, drift);
      particles.rotation.z = elapsed * 0.004;
      red.position.x = hand.position.x - 2;
      canvas.style.opacity = String(Math.min(THREE.MathUtils.smoothstep(p, 0, 0.045), 1 - THREE.MathUtils.smoothstep(p, 0.84, 0.99)));
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(render);
    };
    const start = () => { if (!frame && active && !document.hidden) frame = window.requestAnimationFrame(render); };
    const visibility = () => { if (document.hidden) stop(); else start(); };
    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      if (active) start(); else stop();
    });
    const resizeObserver = new ResizeObserver(resize);
    observer.observe(viewport);
    resizeObserver.observe(viewport);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    document.documentElement.addEventListener("pointerleave", leave);
    canvas.addEventListener("webglcontextlost", contextLost);
    resize();
    return () => {
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", move);
      document.removeEventListener("visibilitychange", visibility);
      document.documentElement.removeEventListener("pointerleave", leave);
      canvas.removeEventListener("webglcontextlost", contextLost);
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          geometries.add(object.geometry);
          (Array.isArray(object.material) ? object.material : [object.material]).forEach((material) => materials.add(material));
        }
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      environment.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, [progress, failed]);

  if (failed) return <div className="artifact-fallback" role="img" aria-label="Symbol .INKSOUL."><BrandMark /></div>;
  return <div className="inksoul-artifact-scene" role="img" aria-label="Trojrozmerná kostrová ruka držiaca tetovacie pero"><canvas ref={canvasRef} aria-hidden="true" /></div>;
}
