import * as THREE from 'three';

// Helper to generate soft circular radial glow texture (no ugly square particles)
function createSoftGlowTexture(colorHex = '#ffd700', innerHex = '#ffffff') {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, innerHex);
  gradient.addColorStop(0.25, colorHex);
  gradient.addColorStop(0.65, 'rgba(245, 158, 11, 0.25)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Procedural water normal map generator for glistening water ripples
function createWaterRippleTexture() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const nx = Math.sin((x / size) * Math.PI * 8) * 0.5 + 0.5;
      const ny = Math.cos((y / size) * Math.PI * 8) * 0.5 + 0.5;
      data[idx] = Math.floor(nx * 128 + 127);
      data[idx + 1] = Math.floor(ny * 128 + 127);
      data[idx + 2] = 255;
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 4);
  return tex;
}

export class Environment {
  constructor(scene) {
    this.scene = scene;
    this.skyLanterns = [];
    this.waterMesh = null;
    this.waterTexture = null;
    this.glowTex = createSoftGlowTexture('#f59e0b', '#ffffff');
    this.init();
  }

  init() {
    this.createSkyAndStars();
    this.createMoon();
    this.createSilkyWater();
    this.createRiverBanks();
    this.createSkyLanterns();
    this.createOptimizedLighting();
    this.createSoftFireflies();
    this.createLotusPads();
  }

  createSkyAndStars() {
    // 1. Starfield with soft circular glow
    const starCount = 400;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const radius = 95 + Math.random() * 35;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * (Math.PI * 0.4);

      starPos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = Math.max(14, radius * Math.cos(phi));
      starPos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));

    const starMat = new THREE.PointsMaterial({
      size: 1.2,
      map: this.glowTex,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.stars = new THREE.Points(starGeo, starMat);
    this.scene.add(this.stars);

    // 2. Distant mountain silhouettes in soft twilight indigo mist
    const mountainMat = new THREE.MeshStandardMaterial({
      color: 0x0c172b,
      roughness: 0.95,
      metalness: 0.05
    });

    const mGeo = new THREE.ConeGeometry(30, 20, 7);
    const m1 = new THREE.Mesh(mGeo, mountainMat);
    m1.position.set(-60, 4, -80);
    this.scene.add(m1);

    const m2 = new THREE.Mesh(mGeo, mountainMat);
    m2.scale.set(1.4, 1.2, 1.4);
    m2.position.set(10, 6, -95);
    this.scene.add(m2);

    const m3 = new THREE.Mesh(mGeo, mountainMat);
    m3.scale.set(1.1, 0.9, 1.1);
    m3.position.set(65, 3, -75);
    this.scene.add(m3);
  }

  createMoon() {
    const moonGroup = new THREE.Group();

    // 1. Luminous Golden Full Moon Sphere
    const moonGeo = new THREE.SphereGeometry(7.0, 32, 32);
    const moonMat = new THREE.MeshBasicMaterial({
      color: 0xfffbe8,
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonGroup.add(moonMesh);

    // 2. Soft Glowing Sprite Halo (Silky smooth, no polygon edges)
    const haloMat = new THREE.SpriteMaterial({
      map: this.glowTex,
      color: 0xfef08a,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const haloSprite = new THREE.Sprite(haloMat);
    haloSprite.scale.set(38, 38, 1);
    moonGroup.add(haloSprite);

    // Position high in the sky over the river
    moonGroup.position.set(16, 46, -60);
    this.scene.add(moonGroup);

    // Directional Moonlight
    const moonLight = new THREE.DirectionalLight(0xe0f2fe, 3.2);
    moonLight.position.set(16, 46, -60);
    moonLight.target.position.set(0, 0, -10);
    this.scene.add(moonLight);
    this.scene.add(moonLight.target);
  }

  createSilkyWater() {
    // 1. Silky River Plane with Normal Map for glistening moonlight reflection
    const waterGeo = new THREE.PlaneGeometry(130, 65, 32, 16);
    waterGeo.rotateX(-Math.PI / 2);

    this.waterTexture = createWaterRippleTexture();

    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0b2c4d,
      roughness: 0.1,
      metalness: 0.88,
      normalMap: this.waterTexture,
      normalScale: new THREE.Vector2(0.35, 0.35),
      transparent: true,
      opacity: 0.95
    });

    this.waterMesh = new THREE.Mesh(waterGeo, waterMat);
    this.waterMesh.position.set(0, -0.05, -14);
    this.scene.add(this.waterMesh);

    // Riverbed ground beneath
    const riverbedGeo = new THREE.PlaneGeometry(140, 75);
    riverbedGeo.rotateX(-Math.PI / 2);
    const riverbedMat = new THREE.MeshStandardMaterial({
      color: 0x061524,
      roughness: 0.9
    });
    const riverbed = new THREE.Mesh(riverbedGeo, riverbedMat);
    riverbed.position.set(0, -2.2, -14);
    this.scene.add(riverbed);
  }

  createRiverBanks() {
    // 1. Riverbank Pier with rich wood grain tone
    const pierGeo = new THREE.BoxGeometry(34, 0.5, 6);
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x5c381e,
      roughness: 0.6,
      metalness: 0.08
    });
    const pier = new THREE.Mesh(pierGeo, woodMat);
    pier.position.set(0, 0.25, 3.5);
    this.scene.add(pier);

    // Wooden piles / posts in water
    const postGeo = new THREE.CylinderGeometry(0.18, 0.18, 2.5, 8);
    for (let x = -16; x <= 16; x += 4) {
      const post = new THREE.Mesh(postGeo, woodMat);
      post.position.set(x, -0.6, 0.6);
      this.scene.add(post);
    }

    // Pier Balustrade with traditional warm wooden railing
    const railMat = new THREE.MeshStandardMaterial({ color: 0x7c4922, roughness: 0.5 });
    const railing = new THREE.Mesh(new THREE.BoxGeometry(34, 0.14, 0.14), railMat);
    railing.position.set(0, 1.15, 0.6);
    this.scene.add(railing);

    for (let x = -16; x <= 16; x += 2) {
      const baluster = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.85, 6), railMat);
      baluster.position.set(x, 0.72, 0.6);
      this.scene.add(baluster);
    }

    // Main temple & village lush ground
    const groundGeo = new THREE.PlaneGeometry(120, 30);
    groundGeo.rotateX(-Math.PI / 2);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x1a381a,
      roughness: 0.75
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.set(0, 0.25, 20);
    this.scene.add(ground);

    // Far opposite riverbank
    const farBankGeo = new THREE.PlaneGeometry(120, 25);
    farBankGeo.rotateX(-Math.PI / 2);
    const farBankMat = new THREE.MeshStandardMaterial({
      color: 0x0f2416,
      roughness: 0.85
    });
    const farBank = new THREE.Mesh(farBankGeo, farBankMat);
    farBank.position.set(0, 0.4, -42);
    this.scene.add(farBank);

    // Tropical Trees & Banana Palms
    this.createTropicalTrees();
  }

  createTropicalTrees() {
    const treeGroup = new THREE.Group();

    const makeBananaTree = (x, z, scale = 1) => {
      const group = new THREE.Group();
      // Trunk
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3520, roughness: 0.8 });
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25 * scale, 0.4 * scale, 3.8 * scale, 8), trunkMat);
      trunk.position.y = 1.9 * scale;
      group.add(trunk);

      // Banana Leaves (large curved leaves)
      const leafMat = new THREE.MeshStandardMaterial({ color: 0x226b2b, roughness: 0.5, side: THREE.DoubleSide });
      for (let i = 0; i < 7; i++) {
        const angle = (i / 7) * Math.PI * 2;
        const leafGeo = new THREE.ConeGeometry(0.7 * scale, 2.6 * scale, 4);
        leafGeo.rotateX(Math.PI * 0.4);
        const leaf = new THREE.Mesh(leafGeo, leafMat);
        leaf.position.set(Math.cos(angle) * 0.8 * scale, 3.5 * scale, Math.sin(angle) * 0.8 * scale);
        leaf.rotation.y = -angle + Math.PI / 2;
        group.add(leaf);
      }
      group.position.set(x, 0.25, z);
      return group;
    };

    treeGroup.add(makeBananaTree(-22, 7, 1.2));
    treeGroup.add(makeBananaTree(-18, 12, 1.0));
    treeGroup.add(makeBananaTree(22, 8, 1.3));
    treeGroup.add(makeBananaTree(26, 14, 1.1));
    treeGroup.add(makeBananaTree(-28, -38, 1.4));
    treeGroup.add(makeBananaTree(-10, -41, 1.1));
    treeGroup.add(makeBananaTree(18, -39, 1.3));
    treeGroup.add(makeBananaTree(30, -40, 1.2));

    this.scene.add(treeGroup);
  }

  createLotusPads() {
    // Elegant floating lotus pads near banks
    const padGroup = new THREE.Group();
    const padGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.04, 14);
    const padMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.45 });
    const flowerMat = new THREE.MeshBasicMaterial({ color: 0xf472b6 });

    const positions = [
      { x: -16, z: -2 },
      { x: -14, z: -3.5 },
      { x: -12.5, z: -1.8 },
      { x: 13, z: -2 },
      { x: 15, z: -3.2 },
      { x: 16.5, z: -1.5 },
    ];

    positions.forEach(pos => {
      const pad = new THREE.Mesh(padGeo, padMat);
      pad.position.set(pos.x, 0.02, pos.z);
      padGroup.add(pad);

      const bud = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.35, 6), flowerMat);
      bud.position.set(pos.x, 0.2, pos.z);
      padGroup.add(bud);
    });

    this.scene.add(padGroup);
  }

  createSoftFireflies() {
    // 35 Soft Golden Fireflies with round glow texture (NO ugly square pixels!)
    const count = 35;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    this.fireflyData = [];

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 45;
      const y = 0.6 + Math.random() * 2.8;
      const z = -20 + Math.random() * 28;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      this.fireflyData.push({
        baseX: x,
        baseY: y,
        baseZ: z,
        phase: Math.random() * Math.PI * 2,
        speed: 0.8 + Math.random() * 0.8
      });
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    // Uses soft glow texture with additive blending
    const mat = new THREE.PointsMaterial({
      size: 1.8,
      map: this.glowTex,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.fireflies = new THREE.Points(geo, mat);
    this.scene.add(this.fireflies);
  }

  createSkyLanterns() {
    // Exactly 10 authentic Thai Sky Lanterns (โคมลอย 10 อัน)
    this.skyLanterns = [];
    const count = 10;

    const lanternBodyGeo = new THREE.CylinderGeometry(0.65, 0.48, 1.4, 12, 1, true);
    const lanternCapGeo = new THREE.SphereGeometry(0.65, 12, 6, 0, Math.PI * 2, 0, Math.PI * 0.5);

    // Glowing Rice Paper Material
    const paperMat = new THREE.MeshBasicMaterial({
      color: 0xfff0c2,
      side: THREE.DoubleSide
    });

    const fireMat = new THREE.MeshBasicMaterial({ color: 0xff6600 });

    for (let i = 0; i < count; i++) {
      const lanternGroup = new THREE.Group();

      const body = new THREE.Mesh(lanternBodyGeo, paperMat);
      body.position.y = 0.7;
      lanternGroup.add(body);

      const cap = new THREE.Mesh(lanternCapGeo, paperMat);
      cap.position.y = 1.4;
      lanternGroup.add(cap);

      // Glowing flame inside
      const flame = new THREE.Mesh(new THREE.SphereGeometry(0.18, 6, 6), fireMat);
      flame.position.y = 0.35;
      lanternGroup.add(flame);

      // Soft corona halo sprite (silky smooth warm glow)
      const coronaMat = new THREE.SpriteMaterial({
        map: this.glowTex,
        color: 0xffaa22,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending
      });
      const corona = new THREE.Sprite(coronaMat);
      corona.scale.set(4.5, 4.5, 1);
      corona.position.y = 0.8;
      lanternGroup.add(corona);

      // Stagger positions across the sky
      const spreadX = (i - 4.5) * 8.0 + (Math.random() - 0.5) * 6;
      const spreadY = 7 + (i * 3.4) + Math.random() * 4;
      const spreadZ = -18 - (i * 3.8) - Math.random() * 8;

      lanternGroup.position.set(spreadX, spreadY, spreadZ);

      lanternGroup.userData = {
        speedY: 0.02 + (i % 3) * 0.007,
        driftX: Math.sin(i * 1.3) * 0.008,
        driftZ: -0.006,
        swayPhase: i * 0.7,
        swaySpeed: 1.2 + (i % 4) * 0.3,
        minY: 6,
        maxY: 52
      };

      this.skyLanterns.push(lanternGroup);
      this.scene.add(lanternGroup);
    }
  }

  createOptimizedLighting() {
    // High performance lighting setup (60 FPS without GPU light exhaustion)
    // 1. Hemisphere Light: Sky (soft lavender) + Ground (warm gold bounce)
    const hemiLight = new THREE.HemisphereLight(0x8faee0, 0x61482b, 2.4);
    this.scene.add(hemiLight);

    // 2. Ambient light for baseline brightness
    const ambientLight = new THREE.AmbientLight(0x4a6d96, 1.7);
    this.scene.add(ambientLight);

    // 3. Pier & Festival lantern glow (3 key lights instead of 10)
    const pierLight1 = new THREE.PointLight(0xffbe5c, 2.8, 22);
    pierLight1.position.set(-8, 3.5, 3.5);
    this.scene.add(pierLight1);

    const pierLight2 = new THREE.PointLight(0xffbe5c, 2.8, 22);
    pierLight2.position.set(8, 3.5, 3.5);
    this.scene.add(pierLight2);

    // 4. Temple spotlight
    const templeSpot = new THREE.PointLight(0xffa834, 4.0, 32);
    templeSpot.position.set(-16, 8, 14);
    this.scene.add(templeSpot);

    // 5. Thai House spotlight
    const houseSpot = new THREE.PointLight(0xff9922, 3.5, 30);
    houseSpot.position.set(16, 7, 14);
    this.scene.add(houseSpot);
  }

  update(time) {
    // 1. Animate water normal map ripple offset (Silky 60 FPS, 0% CPU overhead)
    if (this.waterTexture) {
      this.waterTexture.offset.x = (time * 0.035) % 1;
      this.waterTexture.offset.y = (time * 0.025) % 1;
    }

    // 2. Soft fireflies hovering gracefully
    if (this.fireflies) {
      const attr = this.fireflies.geometry.attributes.position;
      for (let i = 0; i < this.fireflyData.length; i++) {
        const f = this.fireflyData[i];
        attr.setX(i, f.baseX + Math.sin(time * f.speed + f.phase) * 1.2);
        attr.setY(i, f.baseY + Math.cos(time * f.speed * 1.1 + f.phase) * 0.45);
        attr.setZ(i, f.baseZ + Math.sin(time * f.speed * 0.8 + f.phase) * 0.9);
      }
      attr.needsUpdate = true;
    }

    // 3. Exactly 10 Sky lanterns ascending & swaying
    for (const lantern of this.skyLanterns) {
      const data = lantern.userData;
      lantern.position.y += data.speedY;
      lantern.position.x += data.driftX;
      lantern.position.z += data.driftZ;

      const sway = Math.sin(time * data.swaySpeed + data.swayPhase);
      lantern.rotation.z = sway * 0.05;
      lantern.rotation.x = Math.cos(time * data.swaySpeed * 0.8 + data.swayPhase) * 0.04;
      lantern.rotation.y += 0.003;

      if (lantern.position.y > data.maxY) {
        lantern.position.y = data.minY;
        lantern.position.x = (Math.random() - 0.5) * 45;
        lantern.position.z = -15 - Math.random() * 25;
      }
    }
  }
}
