import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

type Point = [number, number, number];

const TIMELINE = [0, 0.1, 0.3, 0.49, 0.68, 0.84, 1];

function timelineValue(progress: number, values: number[]) {
  for (let index = 1; index < TIMELINE.length; index++) {
    if (progress <= TIMELINE[index]) {
      const t = (progress - TIMELINE[index - 1]) / (TIMELINE[index] - TIMELINE[index - 1]);
      return THREE.MathUtils.lerp(values[index - 1], values[index], t * t * (3 - 2 * t));
    }
  }
  return values[values.length - 1];
}

export function poseTattooHand(hand: THREE.Group, progress: number, rightEdge: number, mobile: boolean, pointerX = 0, drift = 0) {
  const p = THREE.MathUtils.clamp(progress, 0, 1);
  hand.scale.setScalar(timelineValue(p, mobile ? [0.68, 0.78, 0.82, 0.72, 0.76, 0.7, 0.65] : [1, 1.26, 1.35, 1.1, 1.25, 1.05, 0.9]));
  const inset = timelineValue(p, mobile ? [-1.4, -0.05, 0.15, -0.2, 0.04, -0.2, -2] : [-2, 0.7, 1, 0.2, 1.2, 0.4, -3]);
  hand.rotation.set(
    timelineValue(p, [-0.2, -0.1, 0.08, 0.2, 0.04, -0.15, 0.1]),
    timelineValue(p, [-0.12, 0.2, -0.15, 0.22, -0.1, 0.1, -0.3]) + pointerX * 0.035,
    timelineValue(p, [-0.17, 0.05, 0.2, -0.13, 0.12, -0.12, -0.25]) + drift,
  );
  // Anchor to the screen edge. The restricted rotation never turns the cut
  // toward the camera, and the pen inherits exactly the same transform.
  hand.position.set(rightEdge - inset,
    timelineValue(p, mobile ? [-0.7, -0.7, -0.7, -0.3, -0.6, -0.9, -1.2] : [-0.4, 0.05, -0.5, 0.5, -0.3, -0.8, -1.1]) + drift, 0);
}

// A continuous, bowed shaft with flared articular ends, rather than capsules
// joined by spheres. All bones share one mesh and one material.
function boneGeometry(start: Point, end: Point, radius: number, seed: number, terminal = false) {
  const a = new THREE.Vector3(...start);
  const b = new THREE.Vector3(...end);
  const direction = b.clone().sub(a);
  const length = direction.length();
  const orientation = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0), direction.normalize(),
  );
  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const rings = 36;
  const sides = 20;
  const point = new THREE.Vector3();
  const shade = new THREE.Color();

  for (let row = 0; row <= rings; row++) {
    const t = row / rings;
    const base = Math.exp(-Math.pow((t - 0.07) / 0.12, 2));
    const head = Math.exp(-Math.pow((t - 0.92) / 0.13, 2));
    const cap = Math.pow(Math.sin(Math.PI * t), 0.22);
    const width = radius * (0.66 + 0.48 * base + (terminal ? 0.34 : 0.55) * head) * cap;
    const bow = Math.sin(t * Math.PI) * length * 0.025;
    for (let side = 0; side <= sides; side++) {
      const angle = side / sides * Math.PI * 2;
      const ridge = 1 + 0.085 * Math.cos(angle * 3 + seed) * Math.sin(t * Math.PI);
      const condyles = 1 + head * 0.16 * Math.cos(angle * 2);
      point.set(
        Math.cos(angle) * width * ridge * condyles + bow,
        t * length,
        Math.sin(angle) * width * (0.79 + base * 0.08) + bow * 0.3,
      ).applyQuaternion(orientation).add(a);
      positions.push(point.x, point.y, point.z);
      const patina = 0.80 + 0.15 * Math.sin(t * Math.PI) + 0.035 * Math.sin(angle * 3 + t * 14 + seed);
      shade.setRGB(patina, patina * 0.976, patina * 0.935);
      colors.push(shade.r, shade.g, shade.b);
      if (row < rings && side < sides) {
        const here = row * (sides + 1) + side;
        const next = here + sides + 1;
        indices.push(here, next, here + 1, here + 1, next, next + 1);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function carpalGeometry(center: Point, size: Point, seed: number) {
  const geometry = new THREE.SphereGeometry(1, 20, 14);
  geometry.deleteAttribute("uv");
  const positions = geometry.attributes.position;
  const colors: number[] = [];
  const p = new THREE.Vector3();
  for (let index = 0; index < positions.count; index++) {
    p.fromBufferAttribute(positions, index);
    const irregularity = 1 + 0.10 * Math.sin(p.x * 4 + seed) * Math.cos(p.y * 3) + 0.055 * p.z;
    p.multiplyScalar(irregularity);
    positions.setXYZ(index, center[0] + p.x * size[0], center[1] + p.y * size[1], center[2] + p.z * size[2]);
    colors.push(0.88, 0.86, 0.82);
  }
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
}

function lathe(profile: Point[], material: THREE.Material) {
  const ordered = profile[0][1] > profile[profile.length - 1][1] ? [...profile].reverse() : profile;
  return new THREE.Mesh(new THREE.LatheGeometry(ordered.map(([r, y]) => new THREE.Vector2(r, y)), 56), material);
}

function createTattooPen() {
  const pen = new THREE.Group();
  const graphite = new THREE.MeshPhysicalMaterial({ color: 0x15171b, metalness: 0.88, roughness: 0.31, clearcoat: 0.35 });
  const silver = new THREE.MeshStandardMaterial({ color: 0xa9adb2, metalness: 1, roughness: 0.23 });
  const red = new THREE.MeshStandardMaterial({ color: 0x9c0718, metalness: 0.72, roughness: 0.24 });
  const cartridge = new THREE.MeshPhysicalMaterial({ color: 0x9babb4, metalness: 0.36, roughness: 0.24, clearcoat: 1 });
  pen.add(lathe([
    [0, 1.75, 0], [0.16, 1.75, 0], [0.22, 1.69, 0], [0.24, 1.55, 0],
    [0.24, 0.62, 0], [0.21, 0.52, 0], [0.21, 0.35, 0], [0, 0.35, 0],
  ], graphite));
  const gripProfile: Point[] = [[0, -0.78, 0], [0.17, -0.78, 0], [0.23, -0.68, 0]];
  for (let index = 0; index <= 56; index++) {
    gripProfile.push([0.24 + (index % 2) * 0.012, -0.62 + index * 0.017, 0]);
  }
  gripProfile.push([0.23, 0.39, 0], [0, 0.4, 0]);
  pen.add(lathe(gripProfile, graphite));
  for (const [y, radius, material] of [
    [1.58, 0.241, silver], [0.57, 0.232, red], [0.42, 0.24, silver], [-0.7, 0.215, silver],
  ] as const) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.018, 8, 56), material);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y;
    pen.add(ring);
  }
  pen.add(lathe([[0, -0.75, 0], [0.16, -0.75, 0], [0.14, -0.97, 0], [0.066, -1.3, 0], [0.033, -1.44, 0], [0, -1.44, 0]], cartridge));
  const needle = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.005, 0.22, 8), silver);
  needle.position.y = -1.53;
  pen.add(needle);
  const button = new THREE.Mesh(new THREE.SphereGeometry(0.058, 16, 10), silver);
  button.scale.set(1, 1.7, 0.28);
  button.position.set(0, 1.12, 0.24);
  pen.add(button);
  const light = new THREE.Mesh(new THREE.SphereGeometry(0.017, 12, 8), new THREE.MeshBasicMaterial({ color: 0xe91b32 }));
  light.position.set(0, 0.91, 0.247);
  pen.add(light);
  pen.position.set(-2.67, 0.10, 0.28);
  pen.rotation.set(-0.12, 0, -0.32);
  return pen;
}

export function createTattooHand() {
  const hand = new THREE.Group();
  const geometries: THREE.BufferGeometry[] = [];
  let seed = 0;
  const bone = (from: Point, to: Point, width: number, terminal = false) => {
    // Leave an actual joint space between adjacent phalanges.
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const gap = b.clone().sub(a).normalize().multiplyScalar(0.014);
    a.add(gap); b.sub(gap);
    geometries.push(boneGeometry(a.toArray(), b.toArray(), width, seed++, terminal));
  };

  // Radius and ulna continue well outside the viewport at every supported pose.
  bone([12, 0.38, -0.24], [0.22, 0.32, 0], 0.19);
  bone([12, -0.30, -0.4], [0.29, -0.27, -0.04], 0.15);
  for (let row = 0; row < 2; row++) {
    for (let column = 0; column < 4; column++) {
      geometries.push(carpalGeometry(
        [0.10 - row * 0.31, 0.41 - column * 0.265, column % 2 ? -0.035 : 0.015],
        [0.20, 0.15, 0.16], seed++,
      ));
    }
  }

  const fingers: Array<{ joints: Point[]; width: number }> = [
    { joints: [[-0.32, 0.38, 0], [-1.85, 0.69, 0.08], [-2.58, 0.70, 0.12], [-2.94, 0.39, 0.46], [-2.79, 0.10, 0.52]], width: 0.115 },
    { joints: [[-0.35, 0.12, 0.02], [-2.02, 0.23, 0.10], [-2.75, -0.10, -0.01], [-2.93, -0.48, 0.24], [-2.62, -0.55, 0.42]], width: 0.125 },
    { joints: [[-0.32, -0.13, 0], [-1.9, -0.28, 0.04], [-2.50, -0.59, -0.14], [-2.48, -0.97, 0.13], [-2.16, -1.00, 0.29]], width: 0.11 },
    { joints: [[-0.25, -0.37, -0.04], [-1.64, -0.66, -0.05], [-2.08, -0.96, -0.14], [-1.96, -1.29, 0.11], [-1.66, -1.24, 0.22]], width: 0.09 },
  ];
  fingers.forEach(({ joints, width }) => {
    for (let i = 0; i < joints.length - 1; i++) {
      bone(joints[i], joints[i + 1], width * [1, 0.96, 0.85, 0.73][i], i === 3);
    }
    joints.slice(1, -1).forEach((joint, index) => {
      const radius = width * (0.72 - index * 0.10);
      geometries.push(carpalGeometry(joint, [radius, radius, radius * 0.85], seed++));
    });
  });
  // Opposed thumb closes the grip against the index finger and pen barrel.
  bone([-0.20, 0.46, 0.02], [-0.94, 0.92, 0.38], 0.15);
  bone([-0.94, 0.92, 0.38], [-1.76, 0.55, 0.68], 0.15);
  bone([-1.76, 0.55, 0.68], [-2.49, 0.07, 0.56], 0.13, true);
  geometries.push(carpalGeometry([-0.94, 0.92, 0.38], [0.09, 0.09, 0.08], seed++));
  geometries.push(carpalGeometry([-1.76, 0.55, 0.68], [0.085, 0.085, 0.08], seed++));

  const geometry = mergeGeometries(geometries);
  geometries.forEach((part) => part.dispose());
  const material = new THREE.MeshPhysicalMaterial({
    color: 0x8d8982, vertexColors: true, metalness: 0.78, roughness: 0.3,
    clearcoat: 0.32, clearcoatRoughness: 0.25,
  });
  hand.add(new THREE.Mesh(geometry, material), createTattooPen());
  return hand;
}
