import * as THREE from 'three';

// Helper to create a soft radial flame glow texture
function createFlameTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, '#ffffff');
  gradient.addColorStop(0.2, '#fff1a8');
  gradient.addColorStop(0.5, '#f59e0b');
  gradient.addColorStop(0.8, 'rgba(239, 68, 68, 0.3)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

export class KrathongFactory {
  constructor(scene) {
    this.scene = scene;
    this.krathongMeshes = new Map();
    this.interactiveObjects = [];
    this.flameTexture = createFlameTexture();

    // 2 Key Warm River Lights for candle glow on water (smooth performance)
    this.riverGlow1 = new THREE.PointLight(0xffaa33, 2.8, 20);
    this.riverGlow1.position.set(-6, 1.2, -10);
    this.scene.add(this.riverGlow1);

    this.riverGlow2 = new THREE.PointLight(0xff9922, 2.8, 20);
    this.riverGlow2.position.set(6, 1.2, -12);
    this.scene.add(this.riverGlow2);
  }

  createKrathong(contestant) {
    const group = new THREE.Group();
    group.userData = {
      id: contestant.id,
      contestant: contestant,
      baseX: contestant.initialPos?.x || (Math.random() - 0.5) * 20,
      baseZ: contestant.initialPos?.z || -10,
      floatSpeed: 0.8 + Math.random() * 0.5,
      bobPhase: Math.random() * Math.PI * 2,
      driftAngle: (Math.random() - 0.5) * 0.02
    };

    const style = contestant.style || 'classic-banana';
    const colors = this.getStylePalette(style);

    // 1. Banana Trunk Base (หยวกกล้วยฐานกระทง)
    const baseGeo = new THREE.CylinderGeometry(1.05, 0.95, 0.28, 18);
    const baseMat = new THREE.MeshStandardMaterial({
      color: colors.base,
      roughness: 0.55
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = 0.14;
    group.add(baseMesh);

    // 2. Folded Petal Layers (กลีบกระทงพับวิจิตร 2 ชั้น)
    const petalCount = 14;
    for (let layer = 0; layer < 2; layer++) {
      const radius = 1.0 - layer * 0.22;
      const petalMat = new THREE.MeshStandardMaterial({
        color: layer === 0 ? colors.outerPetal : colors.innerPetal,
        roughness: 0.4
      });

      for (let i = 0; i < petalCount; i++) {
        const angle = (i / petalCount) * Math.PI * 2 + (layer * 0.22);
        const petalGeo = new THREE.ConeGeometry(0.24, 0.58, 4);
        petalGeo.rotateX(Math.PI * 0.32);
        const petal = new THREE.Mesh(petalGeo, petalMat);

        petal.position.set(
          Math.cos(angle) * radius,
          0.28 + layer * 0.12,
          Math.sin(angle) * radius
        );
        petal.rotation.y = -angle + Math.PI / 2;
        group.add(petal);
      }
    }

    // 3. Yellow Marigold Flowers (ดอกดาวเรือง / ดอกไม้ประดับ)
    const flowerMat = new THREE.MeshStandardMaterial({ color: colors.flower, roughness: 0.7 });
    for (let f = 0; f < 7; f++) {
      const fAngle = (f / 7) * Math.PI * 2;
      const flowerGeo = new THREE.SphereGeometry(0.13, 8, 8);
      const flower = new THREE.Mesh(flowerGeo, flowerMat);
      flower.position.set(Math.cos(fAngle) * 0.48, 0.35, Math.sin(fAngle) * 0.48);
      group.add(flower);
    }

    // 4. Candle Body (เทียนไข)
    const candleGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.65, 8);
    const candleMat = new THREE.MeshStandardMaterial({ color: 0xfef9c3, roughness: 0.25 });
    const candle = new THREE.Mesh(candleGeo, candleMat);
    candle.position.set(0, 0.55, 0);
    group.add(candle);

    // 5. Bright Candle Flame Core
    const flameGeo = new THREE.ConeGeometry(0.1, 0.32, 8);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.set(0, 0.98, 0);
    group.add(flame);

    // 6. Glowing Candle Halo Sprite (Silky smooth, Zero GPU light penalty!)
    const flameSpriteMat = new THREE.SpriteMaterial({
      map: this.flameTexture,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const flameSprite = new THREE.Sprite(flameSpriteMat);
    flameSprite.scale.set(1.4, 1.4, 1);
    flameSprite.position.set(0, 1.05, 0);
    group.add(flameSprite);

    // 7. Three Incense Sticks (ธูป 3 ดอก)
    const incenseGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.8, 6);
    const incenseMat = new THREE.MeshStandardMaterial({ color: 0x7f1d1d, roughness: 0.9 });
    for (let inc = -1; inc <= 1; inc++) {
      const stick = new THREE.Mesh(incenseGeo, incenseMat);
      stick.position.set(inc * 0.06, 0.65, -0.15);
      stick.rotation.z = inc * 0.08;
      group.add(stick);

      const emberGeo = new THREE.SphereGeometry(0.02, 4, 4);
      const emberMat = new THREE.MeshBasicMaterial({ color: 0xff4500 });
      const ember = new THREE.Mesh(emberGeo, emberMat);
      ember.position.set(stick.position.x, 1.05, -0.15);
      group.add(ember);
    }

    // 8. Raycast Bounding Hit Box (for easy tap/click on mobile and PC)
    const hitGeo = new THREE.SphereGeometry(1.3, 8, 8);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    const hitMesh = new THREE.Mesh(hitGeo, hitMat);
    hitMesh.userData = { id: contestant.id, isKrathong: true };
    group.add(hitMesh);

    // Position in river
    group.position.set(group.userData.baseX, 0, group.userData.baseZ);

    this.krathongMeshes.set(contestant.id, group);
    this.interactiveObjects.push(hitMesh);
    this.scene.add(group);

    return group;
  }

  getStylePalette(style) {
    switch (style) {
      case 'pink-lotus':
        return {
          base: 0x166534,
          outerPetal: 0xf472b6,
          innerPetal: 0xfbcfe8,
          flower: 0xfacc15,
          lightColor: 0xf472b6
        };
      case 'golden-royal':
        return {
          base: 0x854d0e,
          outerPetal: 0xeab308,
          innerPetal: 0xfef08a,
          flower: 0xf97316,
          lightColor: 0xfbbf24
        };
      case 'cyan-celestial':
        return {
          base: 0x0e7490,
          outerPetal: 0x06b6d4,
          innerPetal: 0xa5f3fc,
          flower: 0xffffff,
          lightColor: 0x38bdf8
        };
      case 'rainbow-festival':
        return {
          base: 0x15803d,
          outerPetal: 0xec4899,
          innerPetal: 0x8b5cf6,
          flower: 0x38bdf8,
          lightColor: 0xf43f5e
        };
      case 'classic-banana':
      default:
        return {
          base: 0x14532d,
          outerPetal: 0x15803d,
          innerPetal: 0x22c55e,
          flower: 0xeab308,
          lightColor: 0xf59e0b
        };
    }
  }

  update(time) {
    for (const [id, group] of this.krathongMeshes) {
      const data = group.userData;
      // Gentle floating bobbing
      const bob = Math.sin(time * 2.2 + data.bobPhase) * 0.04;
      group.position.y = bob;
      group.rotation.z = Math.sin(time * 1.5 + data.bobPhase) * 0.035;
      group.rotation.x = Math.cos(time * 1.8 + data.bobPhase) * 0.025;
      group.rotation.y += 0.002;

      // Gentle drift downstream
      group.position.x += Math.sin(time * 0.2 + data.bobPhase) * 0.004;
    }
  }

  removeKrathong(id) {
    const group = this.krathongMeshes.get(id);
    if (group) {
      this.scene.remove(group);
      this.krathongMeshes.delete(id);
      this.interactiveObjects = this.interactiveObjects.filter(obj => obj.userData.id !== id);
    }
  }

  clearAllKrathongs() {
    for (const [id, group] of this.krathongMeshes) {
      this.scene.remove(group);
    }
    this.krathongMeshes.clear();
    this.interactiveObjects = [];
  }

  getMeshById(id) {
    return this.krathongMeshes.get(id);
  }
}
