import * as THREE from 'three';

export class Characters {
  constructor(scene) {
    this.scene = scene;
    this.visitors = [];
    this.init();
  }

  init() {
    // 20 festival visitors placed across the pier, riverside walkway, and temple courtyard
    const visitorColors = [
      { shirt: 0xef4444, pants: 0x1e3a8a }, // Red sabai / Navy
      { shirt: 0xec4899, pants: 0xf59e0b }, // Pink sabai / Gold
      { shirt: 0x06b6d4, pants: 0x1e293b }, // Cyan / Dark
      { shirt: 0x10b981, pants: 0x374151 }, // Emerald green
      { shirt: 0xf59e0b, pants: 0x7c2d12 }, // Saffron gold / Brown
      { shirt: 0x8b5cf6, pants: 0x1f2937 }, // Purple / Dark
      { shirt: 0xf97316, pants: 0x0f172a }, // Orange
      { shirt: 0xf1f5f9, pants: 0x1e3a8a }, // White traditional shirt
      { shirt: 0xe11d48, pants: 0xfde047 }, // Crimson / Light
      { shirt: 0x14b8a6, pants: 0x334155 }, // Teal
    ];

    // Coordinates for 20 visitors along pier (Z ~ 2-4), bank (Z ~ 6-12), and temple/house paths
    const spots = [
      { x: -14, z: 2.2 },
      { x: -11, z: 2.6 },
      { x: -8, z: 2.1 },
      { x: -5, z: 2.5 },
      { x: -2, z: 2.2 },
      { x: 1, z: 2.4 },
      { x: 4, z: 2.1 },
      { x: 7, z: 2.5 },
      { x: 10, z: 2.2 },
      { x: 13, z: 2.4 },
      // Upper walkway / courtyard spots
      { x: -15, z: 7.0 },
      { x: -10, z: 8.5 },
      { x: -6, z: 6.8 },
      { x: -1, z: 7.5 },
      { x: 3, z: 8.2 },
      { x: 8, z: 6.5 },
      { x: 12, z: 7.8 },
      { x: 16, z: 9.0 },
      // Near Temple entrance & Thai house
      { x: -12, z: 12.0 },
      { x: 14, z: 12.5 }
    ];

    spots.forEach((spot, idx) => {
      const colorScheme = visitorColors[idx % visitorColors.length];
      const person = this.createPerson(colorScheme);
      person.position.set(spot.x, 0.55, spot.z);

      // Facing river with slight natural variation
      person.rotation.y = Math.PI + (Math.random() - 0.5) * 0.8;

      person.userData = {
        idleSpeed: 1.5 + Math.random() * 1.5,
        idlePhase: Math.random() * Math.PI * 2,
        baseY: person.position.y
      };

      this.visitors.push(person);
      this.scene.add(person);
    });
  }

  createPerson(colors) {
    const personGroup = new THREE.Group();

    // Head
    const headGeo = new THREE.SphereGeometry(0.24, 12, 12);
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xecad80, roughness: 0.6 });
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 1.48;
    personGroup.add(head);

    // Hair / Traditional bun
    const hairGeo = new THREE.SphereGeometry(0.25, 10, 10);
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x171717, roughness: 0.8 });
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 1.54, -0.04);
    hair.scale.set(1.02, 0.95, 1.05);
    personGroup.add(hair);

    // Torso (Shirt / Traditional Sabai)
    const torsoGeo = new THREE.CylinderGeometry(0.25, 0.28, 0.65, 8);
    const shirtMat = new THREE.MeshStandardMaterial({ color: colors.shirt, roughness: 0.5 });
    const torso = new THREE.Mesh(torsoGeo, shirtMat);
    torso.position.y = 0.98;
    personGroup.add(torso);

    // Legs / Chong Kraben (กางเกง / โจงกระเบน)
    const legGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.65, 8);
    const pantsMat = new THREE.MeshStandardMaterial({ color: colors.pants, roughness: 0.6 });

    const leftLeg = new THREE.Mesh(legGeo, pantsMat);
    leftLeg.position.set(-0.13, 0.35, 0);
    personGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, pantsMat);
    rightLeg.position.set(0.13, 0.35, 0);
    personGroup.add(rightLeg);

    // Handheld Lotus or Lantern for some visitors
    if (Math.random() > 0.4) {
      const miniLanternGeo = new THREE.CylinderGeometry(0.1, 0.08, 0.18, 8);
      const miniLanternMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
      const miniLantern = new THREE.Mesh(miniLanternGeo, miniLanternMat);
      miniLantern.position.set(0.28, 0.8, 0.25);
      personGroup.add(miniLantern);
    }

    return personGroup;
  }

  update(time) {
    // Subtle idle animation (breathing, gently swaying to look at the krathongs)
    for (const person of this.visitors) {
      const offset = Math.sin(time * person.userData.idleSpeed + person.userData.idlePhase);
      person.position.y = person.userData.baseY + offset * 0.02;
      person.rotation.z = offset * 0.015;
    }
  }
}
