import type { MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type BlackFishArtifactSceneProps = {
  progress: MotionValue<number>;
};

const TIMELINE = [0, 0.1, 0.3, 0.49, 0.68, 0.84, 1];

function timelineValue(progress: number, values: number[]) {
  const clamped = THREE.MathUtils.clamp(progress, 0, 1);

  for (let index = 1; index < TIMELINE.length; index += 1) {
    if (clamped <= TIMELINE[index]) {
      const segment =
        (clamped - TIMELINE[index - 1]) / (TIMELINE[index] - TIMELINE[index - 1]);
      const eased = segment * segment * (3 - 2 * segment);
      return THREE.MathUtils.lerp(values[index - 1], values[index], eased);
    }
  }

  return values[values.length - 1];
}

function createNeedle(material: THREE.Material, accent: THREE.Material) {
  const group = new THREE.Group();
  const profile = [
    new THREE.Vector2(0.018, -2.75),
    new THREE.Vector2(0.035, -2.2),
    new THREE.Vector2(0.055, -1.6),
    new THREE.Vector2(0.12, -1.32),
    new THREE.Vector2(0.18, -0.9),
    new THREE.Vector2(0.2, 0.55),
    new THREE.Vector2(0.15, 1.18),
    new THREE.Vector2(0.09, 1.62),
    new THREE.Vector2(0.052, 2.18),
  ];
  const body = new THREE.Mesh(new THREE.LatheGeometry(profile, 40), material);
  group.add(body);

  for (let index = 0; index < 7; index += 1) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.205 - index * 0.009, 0.018, 8, 36),
      index === 0 || index === 6 ? accent : material,
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.67 + index * 0.17;
    group.add(ring);
  }

  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.78, 18), material);
  tip.position.y = -3.08;
  tip.rotation.z = Math.PI;
  group.add(tip);

  const glow = new THREE.Mesh(
    new THREE.CylinderGeometry(0.028, 0.012, 0.94, 16),
    accent,
  );
  glow.position.y = -2.48;
  group.add(glow);

  return group;
}

function createInkThreads(material: THREE.LineBasicMaterial) {
  const group = new THREE.Group();

  for (let threadIndex = 0; threadIndex < 11; threadIndex += 1) {
    const points: THREE.Vector3[] = [];
    const offset = (threadIndex / 11) * Math.PI * 2;

    for (let pointIndex = 0; pointIndex < 9; pointIndex += 1) {
      const t = pointIndex / 8;
      const y = THREE.MathUtils.lerp(-2.25, 2.2, t);
      const angle = offset + y * 0.78 + Math.sin(t * Math.PI * 2 + offset) * 0.18;
      const radius = 1.58 + Math.sin(t * Math.PI * 3 + offset) * 0.18;
      points.push(
        new THREE.Vector3(
          Math.cos(angle) * radius,
          y,
          Math.sin(angle) * radius * 0.72,
        ),
      );
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(90));
    const line = new THREE.Line(geometry, material);
    line.rotation.z = (threadIndex - 5) * 0.025;
    line.userData.speed = 0.55 + threadIndex * 0.045;
    group.add(line);
  }

  return group;
}

export default function BlackFishArtifactScene({
  progress,
}: BlackFishArtifactSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const viewport = canvas?.parentElement;
    if (!canvas || !viewport) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      setFailed(true);
      return;
    }

    renderer.setClearColor(0x050505, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.052);

    const camera = new THREE.PerspectiveCamera(29, 1, 0.1, 60);
    camera.position.set(0, 0, 10.4);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, 0.035).texture;
    scene.environment = environment;

    const artifact = new THREE.Group();
    const skull = new THREE.Group();
    const needle = createNeedle(
      new THREE.MeshPhysicalMaterial({
        color: 0xc9c2b9,
        metalness: 1,
        roughness: 0.18,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
      }),
      new THREE.MeshStandardMaterial({
        color: 0xa20715,
        emissive: 0x6f0009,
        emissiveIntensity: 2.4,
        metalness: 0.72,
        roughness: 0.2,
      }),
    );
    const rings = new THREE.Group();
    const inkThreads = createInkThreads(
      new THREE.LineBasicMaterial({
        color: 0xd11a27,
        opacity: 0.32,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );

    artifact.add(skull, needle, rings, inkThreads);
    scene.add(artifact);

    const skullMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x332e2e,
      metalness: 0.76,
      roughness: 0.25,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      iridescence: 0.36,
      iridescenceIOR: 1.45,
      iridescenceThicknessRange: [120, 420],
      side: THREE.DoubleSide,
    });
    let skullSurface: THREE.Object3D | null = null;
    let disposed = false;

    const configureModel = (object: THREE.Group) => {
      const authoredLines: THREE.Object3D[] = [];
      object.traverse((child) => {
        if (child instanceof THREE.Line || child instanceof THREE.Points) {
          authoredLines.push(child);
        }
      });
      authoredLines.forEach((line) => line.parent?.remove(line));

      const bounds = new THREE.Box3().setFromObject(object);
      const center = bounds.getCenter(new THREE.Vector3());
      const size = bounds.getSize(new THREE.Vector3());
      const modelScale = 4.25 / Math.max(size.x, size.y, size.z);

      object.scale.setScalar(modelScale);
      object.position.copy(center).multiplyScalar(-modelScale);
      object.rotation.set(-0.08, 0, 0.02);
      object.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        if (!child.geometry.attributes.normal) child.geometry.computeVertexNormals();
        child.material = skullMaterial;
        child.castShadow = true;
        child.receiveShadow = true;
      });

      skullSurface = object;
      skull.add(object);
    };

    const loader = new GLTFLoader();
    const modelRequest = new AbortController();
    fetch("/models/blackfish-skull.glb", { signal: modelRequest.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Model request failed");
        return response.arrayBuffer();
      })
      .then((source) => {
        if (disposed) return;
        loader.parse(
          source,
          "",
          (model) => {
            if (!disposed) configureModel(model.scene);
          },
          () => {
            if (!disposed) setFailed(true);
          },
        );
      })
      .catch((error: unknown) => {
        if (!disposed && !(error instanceof DOMException && error.name === "AbortError")) {
          setFailed(true);
        }
      });

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xe0d9cf,
      opacity: 0.11,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const redRingMaterial = new THREE.MeshBasicMaterial({
      color: 0xbe0f1c,
      opacity: 0.28,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    [
      { radius: 2.7, tube: 0.012, x: 0.25, y: -0.38, material: ringMaterial },
      { radius: 3.35, tube: 0.019, x: -0.32, y: 0.5, material: redRingMaterial },
      { radius: 4.05, tube: 0.009, x: 0.62, y: 0.18, material: ringMaterial },
    ].forEach((config, index) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(config.radius, config.tube, 8, 180),
        config.material,
      );
      ring.rotation.x = config.x;
      ring.rotation.y = config.y;
      ring.userData.speed = index % 2 === 0 ? 1 : -0.7;
      rings.add(ring);
    });

    const particleCount = 420;
    const particlePositions = new Float32Array(particleCount * 3);
    let seed = 17;
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let index = 0; index < particleCount; index += 1) {
      const radius = 2.7 + random() * 6.8;
      const angle = random() * Math.PI * 2;
      particlePositions[index * 3] = Math.cos(angle) * radius;
      particlePositions[index * 3 + 1] = (random() - 0.5) * 9;
      particlePositions[index * 3 + 2] = Math.sin(angle) * radius - random() * 3;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3),
    );
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: 0xd4cbc0,
        opacity: 0.28,
        size: 0.022,
        sizeAttenuation: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    scene.add(particles);

    scene.add(new THREE.HemisphereLight(0xe4ddd3, 0x160003, 0.9));
    const keyLight = new THREE.SpotLight(0xffead3, 95, 24, 0.52, 0.48, 1.4);
    keyLight.position.set(5, 6, 8);
    keyLight.target.position.set(0, 0, 0);
    scene.add(keyLight, keyLight.target);

    const redLight = new THREE.PointLight(0xd00c1c, 92, 16, 1.55);
    redLight.position.set(-3.6, -1.8, 3.2);
    scene.add(redLight);

    const rimLight = new THREE.PointLight(0x8794a8, 48, 18, 1.8);
    rimLight.position.set(4.2, 2.4, -4.5);
    scene.add(rimLight);

    const pointer = new THREE.Vector2();
    const pointerTarget = new THREE.Vector2();
    const clock = new THREE.Clock();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let smoothProgress = progress.get();
    let active = true;
    let frame = 0;
    let mobileFactor = 1;

    const resize = () => {
      const { width, height } = viewport.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, width < 720 ? 1.25 : 1.65));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.z = width < 720 ? 12.2 : 10.4;
      camera.updateProjectionMatrix();
      mobileFactor = width < 720 ? 0.22 : width < 1100 ? 0.74 : 1;
    };

    const handlePointer = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pointerTarget.set(
        (event.clientX / window.innerWidth - 0.5) * 2,
        (event.clientY / window.innerHeight - 0.5) * 2,
      );
    };
    const handlePointerLeave = () => pointerTarget.set(0, 0);
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      setFailed(true);
    };

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
      },
      { rootMargin: "30% 0px" },
    );
    const resizeObserver = new ResizeObserver(resize);

    visibilityObserver.observe(viewport);
    resizeObserver.observe(viewport);
    window.addEventListener("pointermove", handlePointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", handlePointerLeave);
    canvas.addEventListener("webglcontextlost", handleContextLost);
    resize();

    const render = () => {
      frame = window.requestAnimationFrame(render);
      if (!active || document.hidden) return;

      const elapsed = clock.getElapsedTime();
      const scrollTarget = progress.get();
      smoothProgress +=
        (scrollTarget - smoothProgress) * (reducedMotion ? 0.2 : 0.072);
      pointer.lerp(pointerTarget, reducedMotion ? 0.16 : 0.052);

      const p = THREE.MathUtils.clamp(smoothProgress, 0, 1);
      const x =
        timelineValue(p, [5, 2.35, 1.55, -2.1, 1.55, 2.15, -4.3]) *
        mobileFactor;
      const y = timelineValue(p, [0.55, 0.1, -0.18, -0.58, 0.42, -0.08, 1.5]);
      const z = timelineValue(p, [-1.2, 0.1, 0.72, -0.4, -1.25, 0.15, -2.4]);
      const scale =
        timelineValue(p, [0.54, 0.88, 1.04, 0.7, 0.65, 0.9, 0.44]) *
        (mobileFactor < 0.7 ? 0.84 : 1);

      artifact.position.set(
        x + pointer.x * 0.2,
        y - pointer.y * 0.14,
        z,
      );
      artifact.scale.setScalar(scale);
      artifact.rotation.set(
        timelineValue(p, [0.24, 0.08, -0.12, 0.18, -0.16, 0.06, 0.28]) -
          pointer.y * 0.045,
        timelineValue(p, [-1.25, -0.28, 0.38, 1.18, 2.28, 2.05, 4.05]) +
          pointer.x * 0.12,
        timelineValue(p, [-0.16, -0.04, 0.08, -0.12, 0.1, -0.04, 0.18]),
      );

      skull.rotation.y = Math.sin(elapsed * 0.34) * (reducedMotion ? 0.008 : 0.04);
      skull.rotation.x = Math.sin(elapsed * 0.22) * (reducedMotion ? 0.004 : 0.018);

      needle.position.set(2.18, -0.12, 0.35);
      needle.rotation.set(0.38, -0.42, -0.68 + Math.sin(elapsed * 0.42) * 0.025);
      needle.scale.setScalar(0.78);

      inkThreads.rotation.y = elapsed * 0.035 + p * 1.2;
      inkThreads.rotation.z = -0.12 + p * 0.24;
      inkThreads.children.forEach((thread, index) => {
        thread.rotation.y =
          Math.sin(elapsed * Number(thread.userData.speed) + index) * 0.035;
      });

      rings.children.forEach((ring) => {
        ring.rotation.z =
          elapsed * 0.026 * Number(ring.userData.speed) + p * Math.PI * 0.85;
      });

      if (skullSurface) skullSurface.rotation.z = Math.sin(elapsed * 0.2) * 0.005;

      redLight.position.x = -3.6 + Math.sin(elapsed * 0.5) * 1.1;
      redLight.position.y = -1.8 + Math.cos(elapsed * 0.37) * 0.65;
      particles.rotation.y = elapsed * 0.008 + p * 0.22;
      particles.rotation.z = elapsed * 0.004;

      camera.position.x = pointer.x * 0.2;
      camera.position.y = -pointer.y * 0.14;
      camera.lookAt(0, 0, 0);

      const fadeIn = THREE.MathUtils.smoothstep(p, 0, 0.055);
      const fadeOut = 1 - THREE.MathUtils.smoothstep(p, 0.9, 1);
      canvas.style.opacity = String(Math.min(fadeIn, fadeOut));
      renderer.render(scene, camera);
    };

    render();

    return () => {
      disposed = true;
      modelRequest.abort();
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener("pointermove", handlePointer);
      document.documentElement.removeEventListener("pointerleave", handlePointerLeave);
      canvas.removeEventListener("webglcontextlost", handleContextLost);

      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.Line) {
          geometries.add(object.geometry);
          const objectMaterials = Array.isArray(object.material)
            ? object.material
            : [object.material];
          objectMaterials.forEach((material) => materials.add(material));
        }
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      environment.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, [progress]);

  if (failed) {
    return (
      <div
        className="artifact-fallback"
        role="img"
        aria-label="Abstraktný symbol BLACK FISH"
      >
        <span>Blac<i className="brand-k">K</i></span>
        <span>Fish</span>
      </div>
    );
  }

  return (
    <div
      className="blackfish-artifact-scene"
      role="img"
      aria-label="Interaktívna trojrozmerná chrómová lebka s tetovacou ihlou"
    >
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}
