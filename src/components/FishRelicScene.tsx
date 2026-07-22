import type { MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type FishRelicSceneProps = {
  progress: MotionValue<number>;
};

const UP = new THREE.Vector3(0, 1, 0);

function addBone(
  parent: THREE.Object3D,
  start: THREE.Vector3,
  end: THREE.Vector3,
  radius: number,
  material: THREE.Material,
  segments = 12,
) {
  const direction = end.clone().sub(start);
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, direction.length(), segments, 1),
    material,
  );

  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(UP, direction.normalize());
  parent.add(mesh);
  return mesh;
}

function addCurve(
  parent: THREE.Object3D,
  points: THREE.Vector3[],
  radius: number,
  material: THREE.Material,
) {
  const curve = new THREE.CatmullRomCurve3(points);
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 30, radius, 8, false), material);
  parent.add(mesh);
  return mesh;
}

export default function FishRelicScene({ progress }: FishRelicSceneProps) {
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
    renderer.toneMappingExposure = 1.35;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.065);

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
    camera.position.set(0, 0, 11);

    const root = new THREE.Group();
    const fish = new THREE.Group();
    const halo = new THREE.Group();
    const needle = new THREE.Group();
    root.add(halo, fish, needle);
    scene.add(root);

    const chrome = new THREE.MeshPhysicalMaterial({
      color: 0x353432,
      metalness: 0.95,
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
    });
    const paleMetal = new THREE.MeshPhysicalMaterial({
      color: 0xc8c0b5,
      metalness: 0.88,
      roughness: 0.24,
      clearcoat: 0.8,
    });
    const oxblood = new THREE.MeshStandardMaterial({
      color: 0x7c0811,
      emissive: 0x3d0005,
      emissiveIntensity: 1.4,
      metalness: 0.72,
      roughness: 0.27,
    });
    const voidMaterial = new THREE.MeshStandardMaterial({
      color: 0x010101,
      metalness: 0.15,
      roughness: 0.65,
    });
    const ghostMaterial = new THREE.MeshBasicMaterial({
      color: 0x8f111b,
      opacity: 0.13,
      side: THREE.DoubleSide,
      transparent: true,
    });
    const lineMaterial = new THREE.MeshBasicMaterial({
      color: 0xd8cfc2,
      opacity: 0.15,
      transparent: true,
    });

    const skull = new THREE.Group();
    skull.position.set(2.05, 0.02, 0);
    fish.add(skull);

    const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.88, 48, 32), chrome);
    cranium.scale.set(1.3, 0.88, 0.7);
    skull.add(cranium);

    const snout = new THREE.Mesh(new THREE.SphereGeometry(0.58, 36, 24), chrome);
    snout.position.set(0.82, -0.08, 0);
    snout.scale.set(1.15, 0.55, 0.62);
    skull.add(snout);

    const brow = addCurve(
      skull,
      [
        new THREE.Vector3(-0.16, 0.3, 0.55),
        new THREE.Vector3(0.22, 0.52, 0.59),
        new THREE.Vector3(0.64, 0.29, 0.51),
      ],
      0.055,
      paleMetal,
    );
    brow.rotation.z = -0.05;

    const eyeVoid = new THREE.Mesh(new THREE.SphereGeometry(0.27, 28, 20), voidMaterial);
    eyeVoid.position.set(0.28, 0.2, 0.55);
    eyeVoid.scale.set(1.15, 0.92, 0.35);
    skull.add(eyeVoid);

    const eyeRing = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.035, 12, 48), paleMetal);
    eyeRing.position.set(0.28, 0.2, 0.64);
    eyeRing.scale.set(1.15, 0.92, 1);
    skull.add(eyeRing);

    const eyeInner = new THREE.Mesh(new THREE.TorusGeometry(0.205, 0.018, 10, 40), oxblood);
    eyeInner.position.set(0.28, 0.2, 0.675);
    eyeInner.scale.set(1.15, 0.92, 1);
    skull.add(eyeInner);

    addCurve(
      skull,
      [
        new THREE.Vector3(-0.2, -0.28, 0.42),
        new THREE.Vector3(0.28, -0.58, 0.48),
        new THREE.Vector3(0.84, -0.38, 0.36),
      ],
      0.07,
      paleMetal,
    );

    for (let index = 0; index < 4; index += 1) {
      const tooth = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.22, 10), paleMetal);
      tooth.position.set(0.45 + index * 0.15, -0.37 + Math.sin(index) * 0.025, 0.38);
      tooth.rotation.z = Math.PI;
      skull.add(tooth);
    }

    const vertebrae: THREE.Mesh[] = [];
    const spinePoints: THREE.Vector3[] = [];
    for (let index = 0; index < 14; index += 1) {
      const x = 1.15 - index * 0.29;
      const y = Math.sin(index * 0.42) * 0.045;
      const radius = 0.2 - index * 0.0045;
      const vertebra = new THREE.Mesh(new THREE.IcosahedronGeometry(radius, 1), paleMetal);
      vertebra.position.set(x, y, 0);
      vertebra.scale.set(1.25, 0.8, 0.78);
      vertebra.rotation.set(index * 0.12, index * 0.16, index * 0.09);
      vertebra.userData.baseY = y;
      vertebrae.push(vertebra);
      spinePoints.push(vertebra.position.clone());
      fish.add(vertebra);

      if (index > 0) {
        addBone(fish, spinePoints[index - 1], spinePoints[index], 0.052, chrome, 10);
      }
    }

    for (let index = 1; index < 10; index += 1) {
      const x = 1.15 - index * 0.29;
      const spread = 0.66 + Math.sin((index / 10) * Math.PI) * 0.58;
      const taper = 1 - index * 0.035;

      addCurve(
        fish,
        [
          new THREE.Vector3(x, 0.02, 0.05),
          new THREE.Vector3(x - 0.06, spread * 0.58, 0.2),
          new THREE.Vector3(x - 0.24, spread, 0.32),
          new THREE.Vector3(x - 0.48, spread * 0.28, 0.4),
        ],
        0.035 * taper,
        chrome,
      );
      addCurve(
        fish,
        [
          new THREE.Vector3(x, -0.02, 0.05),
          new THREE.Vector3(x - 0.06, -spread * 0.58, 0.2),
          new THREE.Vector3(x - 0.24, -spread, 0.32),
          new THREE.Vector3(x - 0.48, -spread * 0.28, 0.4),
        ],
        0.035 * taper,
        chrome,
      );
    }

    for (let index = 0; index < 7; index += 1) {
      const x = 0.75 - index * 0.39;
      const height = 0.95 - index * 0.06;
      addBone(
        fish,
        new THREE.Vector3(x, 0.08, -0.02),
        new THREE.Vector3(x - 0.24, height, -0.12),
        0.028,
        paleMetal,
        8,
      );
    }

    const tailRoot = new THREE.Vector3(-2.7, 0, 0);
    const tailTips = [
      new THREE.Vector3(-4.15, 1.5, -0.08),
      new THREE.Vector3(-4.42, 0.76, 0.08),
      new THREE.Vector3(-4.52, 0, 0.15),
      new THREE.Vector3(-4.42, -0.76, 0.08),
      new THREE.Vector3(-4.15, -1.5, -0.08),
    ];
    tailTips.forEach((tip, index) => {
      addBone(fish, tailRoot, tip, index === 2 ? 0.055 : 0.035, paleMetal, 10);
    });

    const tailGeometry = new THREE.BufferGeometry();
    tailGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(
        [
          -2.72, 0, -0.04,
          -4.15, 1.5, -0.08,
          -4.52, 0, 0.15,
          -4.15, -1.5, -0.08,
        ],
        3,
      ),
    );
    tailGeometry.setIndex([0, 1, 2, 0, 2, 3]);
    tailGeometry.computeVertexNormals();
    fish.add(new THREE.Mesh(tailGeometry, ghostMaterial));

    const needleStart = new THREE.Vector3(-3.45, -1.9, 1.2);
    const needleEnd = new THREE.Vector3(3.65, 1.85, -0.72);
    addBone(needle, needleStart, needleEnd, 0.037, paleMetal, 14);
    addBone(
      needle,
      new THREE.Vector3(1.75, 0.86, -0.2),
      new THREE.Vector3(2.9, 1.47, -0.53),
      0.13,
      oxblood,
      20,
    );
    const needleTip = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.56, 14), paleMetal);
    const needleDirection = needleStart.clone().sub(needleEnd).normalize();
    needleTip.position.copy(needleStart).addScaledVector(needleDirection, 0.27);
    needleTip.quaternion.setFromUnitVectors(UP, needleDirection);
    needle.add(needleTip);

    [2.9, 3.35, 3.8].forEach((radius, index) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, index === 1 ? 0.012 : 0.02, 8, 120),
        index === 1 ? lineMaterial : oxblood,
      );
      ring.rotation.x = 0.12 + index * 0.22;
      ring.rotation.y = -0.24 + index * 0.18;
      ring.userData.speed = index % 2 === 0 ? 1 : -0.65;
      halo.add(ring);
    });

    const particleCount = 130;
    const particlePositions = new Float32Array(particleCount * 3);
    let seed = 41;
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let index = 0; index < particleCount; index += 1) {
      const radius = 2.7 + random() * 3.2;
      const angle = random() * Math.PI * 2;
      particlePositions[index * 3] = Math.cos(angle) * radius;
      particlePositions[index * 3 + 1] = Math.sin(angle) * radius * 0.64;
      particlePositions[index * 3 + 2] = (random() - 0.5) * 4;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: 0xbcb3a7,
        opacity: 0.28,
        size: 0.018,
        sizeAttenuation: true,
        transparent: true,
      }),
    );
    scene.add(particles);

    scene.add(new THREE.HemisphereLight(0xd8d0c4, 0x120003, 1.15));
    const keyLight = new THREE.DirectionalLight(0xfff3df, 3.6);
    keyLight.position.set(4, 5, 7);
    scene.add(keyLight);
    const redLight = new THREE.PointLight(0xb10f1c, 42, 14, 1.7);
    redLight.position.set(-3.5, -1.7, 3.5);
    scene.add(redLight);
    const rimLight = new THREE.PointLight(0xc9d3e0, 32, 14, 1.8);
    rimLight.position.set(3.5, 1.5, -4);
    scene.add(rimLight);

    const pointer = new THREE.Vector2();
    const pointerTarget = new THREE.Vector2();
    let smoothProgress = progress.get();
    let active = true;
    let frame = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clock = new THREE.Clock();

    const resize = () => {
      const { width, height } = viewport.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, width < 720 ? 1.35 : 1.8));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.z = width < 720 ? 13.8 : 10.6;
      camera.updateProjectionMatrix();
      const scale = width < 720 ? 0.62 : Math.min(1.04, 0.83 + width / 4200);
      root.scale.setScalar(scale);
    };

    const handlePointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerTarget.set(
        ((event.clientX - rect.left) / rect.width - 0.5) * 2,
        ((event.clientY - rect.top) / rect.height - 0.5) * 2,
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
      { rootMargin: "20% 0px" },
    );
    visibilityObserver.observe(viewport);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(viewport);
    canvas.addEventListener("pointermove", handlePointer);
    canvas.addEventListener("pointerleave", handlePointerLeave);
    canvas.addEventListener("webglcontextlost", handleContextLost);
    resize();

    const render = () => {
      frame = window.requestAnimationFrame(render);
      if (!active || document.hidden) return;

      const elapsed = clock.getElapsedTime();
      const scrollTarget = progress.get();
      smoothProgress += (scrollTarget - smoothProgress) * (reducedMotion ? 0.22 : 0.075);
      pointer.lerp(pointerTarget, reducedMotion ? 0.18 : 0.055);

      root.rotation.y = -0.72 + smoothProgress * 1.44 + pointer.x * 0.23;
      root.rotation.x = 0.18 - smoothProgress * 0.32 - pointer.y * 0.13;
      root.rotation.z = -0.12 + smoothProgress * 0.21;
      root.position.y = 0.38 - smoothProgress * 0.72;
      root.position.x = Math.sin(smoothProgress * Math.PI) * 0.18;

      fish.rotation.y = Math.sin(elapsed * 0.42) * (reducedMotion ? 0.015 : 0.055);
      needle.rotation.z = Math.sin(elapsed * 0.5) * (reducedMotion ? 0.006 : 0.025);
      halo.children.forEach((ring) => {
        ring.rotation.z = elapsed * 0.035 * Number(ring.userData.speed) + smoothProgress * 0.7;
      });
      vertebrae.forEach((vertebra, index) => {
        vertebra.position.y =
          Number(vertebra.userData.baseY) +
          Math.sin(elapsed * 0.8 + index * 0.46) * (reducedMotion ? 0.002 : 0.018);
      });
      particles.rotation.z = elapsed * 0.012;
      particles.rotation.y = smoothProgress * 0.18;

      camera.position.x = pointer.x * 0.32;
      camera.position.y = -pointer.y * 0.2;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };

    render();

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      canvas.removeEventListener("pointermove", handlePointer);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      canvas.removeEventListener("webglcontextlost", handleContextLost);

      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          geometries.add(object.geometry);
          const objectMaterials = Array.isArray(object.material) ? object.material : [object.material];
          objectMaterials.forEach((material) => materials.add(material));
        }
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      renderer.dispose();
    };
  }, [progress]);

  if (failed) {
    return (
      <div className="fish-relic-fallback" role="img" aria-label="Abstraktný symbol BLACK FISH">
        <span>BLACK</span>
        <span>FISH</span>
      </div>
    );
  }

  return (
    <div
      className="fish-relic-scene"
      role="img"
      aria-label="Interaktívna trojrozmerná kostra ryby prepichnutá tetovacou ihlou"
    >
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}
