import * as THREE from 'three';

export class ThaiArchitecture {
  constructor(scene) {
    this.scene = scene;
    this.init();
  }

  init() {
    this.createThaiTemple();
    this.createGoldenPagoda();
    this.createTraditionalThaiHouse();
  }

  createThaiTemple() {
    const templeGroup = new THREE.Group();

    // 1. Temple Base (ฐานไพทีหินอ่อน)
    const baseGeo = new THREE.BoxGeometry(16, 1.2, 22);
    const marbleMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 });
    const base = new THREE.Mesh(baseGeo, marbleMat);
    base.position.y = 0.6;
    templeGroup.add(base);

    // 2. Main Ubosot Body (ผนังพระอุโบสถ)
    const bodyGeo = new THREE.BoxGeometry(12, 7, 18);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 });
    const body = new THREE.Mesh(bodyGeo, wallMat);
    body.position.y = 4.7;
    templeGroup.add(body);

    // 3. Ornate White & Gold Columns (เสาพาไล)
    const colGeo = new THREE.CylinderGeometry(0.35, 0.4, 7, 10);
    const colMat = new THREE.MeshStandardMaterial({ color: 0xfef9c3, roughness: 0.3, metalness: 0.2 });
    for (let x of [-6.8, 6.8]) {
      for (let z = -9; z <= 9; z += 3) {
        const col = new THREE.Mesh(colGeo, colMat);
        col.position.set(x, 4.7, z);
        templeGroup.add(col);
      }
    }

    // Front Entrance Columns
    for (let x of [-4, -1.5, 1.5, 4]) {
      const col = new THREE.Mesh(colGeo, colMat);
      col.position.set(x, 4.7, 10);
      templeGroup.add(col);
    }

    // 4. Multi-tiered Sloped Thai Roofs (หลังคาซ้อน 3 ชั้น เอกลักษณ์ไทย)
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x991b1b, // Deep traditional Thai terracotta red
      roughness: 0.4
    });
    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Golden trims
      metalness: 0.7,
      roughness: 0.25
    });

    const roofTiers = [
      { w: 15, l: 21, y: 8.5, pitch: 3.5 },
      { w: 12, l: 18, y: 11.2, pitch: 3.2 },
      { w: 9, l: 15, y: 13.8, pitch: 2.8 }
    ];

    roofTiers.forEach((tier) => {
      // Sloped Gable Roof Geometry
      const roofGeo = new THREE.ConeGeometry(tier.w * 0.7, tier.pitch, 4);
      roofGeo.rotateY(Math.PI / 4);
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.scale.set(1.1, 1, tier.l / tier.w);
      roof.position.y = tier.y;
      templeGroup.add(roof);

      // Gold Ridge Trim (ใบระกา)
      const ridgeGeo = new THREE.BoxGeometry(0.3, 0.4, tier.l);
      const ridge = new THREE.Mesh(ridgeGeo, goldTrimMat);
      ridge.position.y = tier.y + tier.pitch * 0.45;
      templeGroup.add(ridge);
    });

    // 5. Chofa (ช่อฟ้า) on roof peaks
    const chofaGeo = new THREE.ConeGeometry(0.3, 2.2, 6);
    chofaGeo.rotateX(Math.PI * 0.15);
    const chofaFront = new THREE.Mesh(chofaGeo, goldTrimMat);
    chofaFront.position.set(0, 16.2, 7.5);
    templeGroup.add(chofaFront);

    const chofaBack = new THREE.Mesh(chofaGeo, goldTrimMat);
    chofaBack.rotation.y = Math.PI;
    chofaBack.position.set(0, 16.2, -7.5);
    templeGroup.add(chofaBack);

    // 6. Pediment with Golden Relief (หน้าบันลายทอง)
    const pedimentGeo = new THREE.ConeGeometry(5, 3.2, 3);
    const pediment = new THREE.Mesh(pedimentGeo, goldTrimMat);
    pediment.position.set(0, 10.5, 9.1);
    pediment.rotateZ(Math.PI);
    templeGroup.add(pediment);

    // Warm glow emanating from temple doorway
    const templeLight = new THREE.PointLight(0xffbe3b, 3.8, 20);
    templeLight.position.set(0, 4.5, 9.5);
    templeGroup.add(templeLight);

    // Position temple on the left temple grounds
    templeGroup.position.set(-15, 0.25, 13);
    this.scene.add(templeGroup);
  }

  createGoldenPagoda() {
    // พระเจดีย์ทรงระฆังสีทองอร่าม (Golden Thai Stupa / Chedi)
    const pagodaGroup = new THREE.Group();
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.85,
      roughness: 0.2,
    });

    // 1. Octagonal Tiered Base (ฐานเขียงลดหลั่น)
    const baseTiers = [
      { rTop: 5.5, rBottom: 6.2, h: 1.2, y: 0.6 },
      { rTop: 4.8, rBottom: 5.5, h: 1.0, y: 1.7 },
      { rTop: 4.2, rBottom: 4.8, h: 0.9, y: 2.65 }
    ];
    baseTiers.forEach(t => {
      const geo = new THREE.CylinderGeometry(t.rTop, t.rBottom, t.h, 16);
      const mesh = new THREE.Mesh(geo, goldMat);
      mesh.position.y = t.y;
      pagodaGroup.add(mesh);
    });

    // 2. Bell-shaped Dome (องค์ระฆัง)
    const domeGeo = new THREE.SphereGeometry(3.8, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.55);
    const dome = new THREE.Mesh(domeGeo, goldMat);
    dome.position.y = 3.1;
    pagodaGroup.add(dome);

    // 3. Throne / Base for Spire (บัลลังก์)
    const throneGeo = new THREE.BoxGeometry(3.0, 1.0, 3.0);
    const throne = new THREE.Mesh(throneGeo, goldMat);
    throne.position.y = 7.1;
    pagodaGroup.add(throne);

    // 4. Ringed Spire (ปล้องไฉน)
    const ringsCount = 10;
    for (let i = 0; i < ringsCount; i++) {
      const r = 1.3 - (i * 0.1);
      const ringGeo = new THREE.TorusGeometry(r, 0.15, 8, 24);
      ringGeo.rotateX(Math.PI / 2);
      const ring = new THREE.Mesh(ringGeo, goldMat);
      ring.position.y = 7.8 + (i * 0.42);
      pagodaGroup.add(ring);
    }

    // 5. Needle Spire & Pinnacle (ปลียอด & ยอดฉัตรทอง)
    const needleGeo = new THREE.ConeGeometry(0.35, 4.5, 16);
    const needle = new THREE.Mesh(needleGeo, goldMat);
    needle.position.y = 14.2;
    pagodaGroup.add(needle);

    // Top Glowing Pearl / Spire Gem
    const gemGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const gemMat = new THREE.MeshBasicMaterial({ color: 0xfffbeb });
    const gem = new THREE.Mesh(gemGeo, gemMat);
    gem.position.y = 16.6;
    pagodaGroup.add(gem);

    // Radiant Golden Light glowing on the Stupa
    const pagodaLight = new THREE.PointLight(0xfef08a, 3.8, 24);
    pagodaLight.position.set(0, 11, 0);
    pagodaGroup.add(pagodaLight);

    // Position Pagoda in the center-left background
    pagodaGroup.position.set(-4, 0.25, 16);
    this.scene.add(pagodaGroup);
  }

  createTraditionalThaiHouse() {
    // เรือนไทยประยุกต์ 2 ชั้น (ตามภาพ Reference: เรือนแฝดสองจั่ว บันไดนอกชาน โอ่งลายคราม ผนังอิฐมอญและไม้สัก)
    const houseGroup = new THREE.Group();

    // Palette
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x5a3419, roughness: 0.7, metalness: 0.1 });
    const darkWoodMat = new THREE.MeshStandardMaterial({ color: 0x3d200e, roughness: 0.8 });
    const teakWallMat = new THREE.MeshStandardMaterial({ color: 0x7a4724, roughness: 0.65 });
    const brickMat = new THREE.MeshStandardMaterial({ color: 0x9e432a, roughness: 0.85 }); // Red brick
    const whiteTrimMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
    const tileRoofMat = new THREE.MeshStandardMaterial({ color: 0x8f4320, roughness: 0.55 }); // Terracotta tiles
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x93c5fd, roughness: 0.1, metalness: 0.8, transparent: true, opacity: 0.7 });
    const porcelainMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.2, metalness: 0.1 }); // Blue porcelain jar
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8 });

    // ==========================================
    // 1. FIRST FLOOR & PATIO (ชั้นล่าง & ลานชาน)
    // ==========================================
    // Concrete / Tile Foundation Plinth
    const plinthGeo = new THREE.BoxGeometry(11.5, 0.45, 9.5);
    const plinthMat = new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.7 });
    const plinth = new THREE.Mesh(plinthGeo, plinthMat);
    plinth.position.set(0, 0.22, 0);
    houseGroup.add(plinth);

    // White Border around plinth
    const plinthBorderGeo = new THREE.BoxGeometry(11.7, 0.2, 9.7);
    const plinthBorder = new THREE.Mesh(plinthBorderGeo, whiteTrimMat);
    plinthBorder.position.set(0, 0.1, 0);
    houseGroup.add(plinthBorder);

    // Front Entrance Steps (บันไดทางขึ้นหน้าบ้าน)
    const stepGeo = new THREE.BoxGeometry(3.2, 0.2, 0.9);
    const step = new THREE.Mesh(stepGeo, whiteTrimMat);
    step.position.set(1.5, 0.1, 5.1);
    houseGroup.add(step);

    // Stepping Stone Walkway (ทางเดินแผ่นหินหน้าบ้าน)
    for (let s = 0; s < 5; s++) {
      const stoneGeo = new THREE.BoxGeometry(2.0, 0.08, 0.8);
      const stone = new THREE.Mesh(stoneGeo, stoneMat);
      stone.position.set(1.5, 0.04, 6.2 + s * 1.3);
      houseGroup.add(stone);
    }

    // Two Blue & White Porcelain Water Jars (โอ่งลายคราม 2 ใบ บนฐานขาว)
    for (let j of [-0.2, 3.2]) {
      // White Base Pedestal
      const baseGeo = new THREE.BoxGeometry(0.7, 0.25, 0.7);
      const jarBase = new THREE.Mesh(baseGeo, whiteTrimMat);
      jarBase.position.set(j, 0.12, 5.0);
      houseGroup.add(jarBase);

      // Ceramic Jar Body
      const jarGeo = new THREE.SphereGeometry(0.42, 16, 16);
      const jar = new THREE.Mesh(jarGeo, porcelainMat);
      jar.position.set(j, 0.52, 5.0);
      jar.scale.set(1.0, 1.15, 1.0);
      houseGroup.add(jar);

      // Jar Rim
      const rimGeo = new THREE.TorusGeometry(0.22, 0.05, 8, 16);
      rimGeo.rotateX(Math.PI / 2);
      const rim = new THREE.Mesh(rimGeo, whiteTrimMat);
      rim.position.set(j, 0.92, 5.0);
      houseGroup.add(rim);
    }

    // Ground Floor Enclosed Walls (Right & Back: Red Brick)
    const brickWallGeo = new THREE.BoxGeometry(6.2, 3.2, 7.8);
    const brickWall = new THREE.Mesh(brickWallGeo, brickMat);
    brickWall.position.set(2.2, 1.9, -0.4);
    houseGroup.add(brickWall);

    // Ground Floor Glass Sliding Doors & Windows (Front of Brick Section)
    const gDoorFrameGeo = new THREE.BoxGeometry(4.8, 2.5, 0.15);
    const gDoorFrame = new THREE.Mesh(gDoorFrameGeo, whiteTrimMat);
    gDoorFrame.position.set(2.2, 1.6, 3.52);
    houseGroup.add(gDoorFrame);

    const gDoorGlassGeo = new THREE.BoxGeometry(4.4, 2.2, 0.05);
    const gDoorGlass = new THREE.Mesh(gDoorGlassGeo, glassMat);
    gDoorGlass.position.set(2.2, 1.6, 3.56);
    houseGroup.add(gDoorGlass);

    // Ground Floor Wooden Support Columns (เสาไม้ใต้ถุน 4 เสาด้านหน้า)
    const colGeo = new THREE.BoxGeometry(0.38, 3.4, 0.38);
    const colBaseGeo = new THREE.BoxGeometry(0.5, 0.3, 0.5);
    const colX = [-3.8, -1.4, 1.0, 3.8, 5.2];
    colX.forEach(x => {
      // Column
      const col = new THREE.Mesh(colGeo, woodMat);
      col.position.set(x, 1.9, 3.8);
      houseGroup.add(col);

      // White Stone Base
      const cBase = new THREE.Mesh(colBaseGeo, whiteTrimMat);
      cBase.position.set(x, 0.45, 3.8);
      houseGroup.add(cBase);
    });

    // ==========================================
    // 2. EXTERNAL STAIRCASE ON LEFT (บันไดไม้นอกชาน)
    // ==========================================
    const stairGroup = new THREE.Group();

    // Stair Landing Platform on Stilts
    const landingGeo = new THREE.BoxGeometry(2.4, 0.25, 2.4);
    const landing = new THREE.Mesh(landingGeo, darkWoodMat);
    landing.position.set(-5.6, 2.0, 1.2);
    stairGroup.add(landing);

    // Landing Posts
    for (let px of [-6.6, -4.6]) {
      for (let pz of [0.2, 2.2]) {
        const postGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.0, 6);
        const post = new THREE.Mesh(postGeo, darkWoodMat);
        post.position.set(px, 1.0, pz);
        stairGroup.add(post);
      }
    }

    // Landing Railings
    const lRailGeo = new THREE.BoxGeometry(2.4, 0.8, 0.08);
    const lRail = new THREE.Mesh(lRailGeo, darkWoodMat);
    lRail.position.set(-5.6, 2.5, 2.3);
    stairGroup.add(lRail);

    // Lower Flight of Stairs (Ground to Landing)
    for (let stepIdx = 0; stepIdx < 6; stepIdx++) {
      const stepMesh = new THREE.BoxGeometry(1.6, 0.12, 0.4);
      const stepM = new THREE.Mesh(stepMesh, woodMat);
      stepM.position.set(-5.6, 0.25 + stepIdx * 0.28, 4.4 - stepIdx * 0.45);
      stairGroup.add(stepM);
    }

    // Upper Flight of Stairs (Landing to Second Floor)
    for (let stepIdx = 0; stepIdx < 5; stepIdx++) {
      const stepMesh = new THREE.BoxGeometry(0.4, 0.12, 1.4);
      const stepM = new THREE.Mesh(stepMesh, woodMat);
      stepM.position.set(-4.6 + stepIdx * 0.28, 2.2 + stepIdx * 0.28, 0.6);
      stairGroup.add(stepM);
    }

    // Upper Stair Handrails
    const handrailGeo = new THREE.BoxGeometry(1.8, 0.08, 0.08);
    const handrail = new THREE.Mesh(handrailGeo, woodMat);
    handrail.position.set(-4.0, 3.2, 1.2);
    handrail.rotateZ(Math.PI * 0.2);
    stairGroup.add(handrail);

    houseGroup.add(stairGroup);

    // ==========================================
    // 3. SECOND FLOOR & TEAK WALLS (ชั้นสอง)
    // ==========================================
    // Second Floor Cantilevered Base (ชานเรือนชั้นสอง)
    const floor2Geo = new THREE.BoxGeometry(11.8, 0.4, 9.8);
    const floor2 = new THREE.Mesh(floor2Geo, darkWoodMat);
    floor2.position.set(0, 3.6, 0);
    houseGroup.add(floor2);

    // Diagonal Wooden Bracket Supports (คันทวย ค้ำยันชั้นสอง)
    for (let bx of [-3.8, -1.4, 1.0, 3.8]) {
      const braceGeo = new THREE.BoxGeometry(0.15, 1.2, 0.15);
      const brace = new THREE.Mesh(braceGeo, darkWoodMat);
      brace.position.set(bx, 3.1, 4.1);
      brace.rotateX(Math.PI * 0.25);
      houseGroup.add(brace);
    }

    // Main Teak Rooms Structure (ผนังไม้สักชั้นบน)
    const room2Geo = new THREE.BoxGeometry(11.2, 3.4, 9.0);
    const room2 = new THREE.Mesh(room2Geo, teakWallMat);
    room2.position.set(0, 5.4, 0);
    houseGroup.add(room2);

    // Second Floor Large Modern Thai Glass Windows (บานหน้าต่างกระจกกรอบไม้)
    const winWidths = [-2.8, 2.8];
    winWidths.forEach(wx => {
      // Window Frame
      const winFrameGeo = new THREE.BoxGeometry(3.6, 2.2, 0.15);
      const winFrame = new THREE.Mesh(winFrameGeo, darkWoodMat);
      winFrame.position.set(wx, 5.3, 4.54);
      houseGroup.add(winFrame);

      // Glass Panes
      const winGlassGeo = new THREE.BoxGeometry(3.3, 1.9, 0.05);
      const winGlass = new THREE.Mesh(winGlassGeo, glassMat);
      winGlass.position.set(wx, 5.3, 4.58);
      houseGroup.add(winGlass);

      // Window Mullions (ซี่ลูกฟักหน้าต่าง)
      for (let mx of [-1.1, 0, 1.1]) {
        const mulGeo = new THREE.BoxGeometry(0.08, 1.9, 0.08);
        const mul = new THREE.Mesh(mulGeo, darkWoodMat);
        mul.position.set(wx + mx, 5.3, 4.6);
        houseGroup.add(mul);
      }
    });

    // Horizontal Wrap-Around Eave Awning (กันสาดชั้นสอง)
    const awningGeo = new THREE.BoxGeometry(12.8, 0.25, 10.8);
    const awning = new THREE.Mesh(awningGeo, tileRoofMat);
    awning.position.set(0, 7.1, 0);
    houseGroup.add(awning);

    // ==========================================
    // 4. TWIN THAI GABLE ROOFS (เรือนแฝดสองจั่ว)
    // ==========================================
    const gableOffsets = [-2.8, 2.8]; // Left & Right Twin Gables
    gableOffsets.forEach(gx => {
      const gableGroup = new THREE.Group();

      // Sloped Thai Gable Roof Geometry (ทรงจั่วไทยยอดแหลม)
      const roofPitch = 4.2;
      const roofSpan = 5.8;
      const roofLength = 10.6;

      const roofConeGeo = new THREE.ConeGeometry(roofSpan * 0.72, roofPitch, 4);
      roofConeGeo.rotateY(Math.PI / 4);
      const roofCone = new THREE.Mesh(roofConeGeo, tileRoofMat);
      roofCone.scale.set(1.0, 1.0, roofLength / (roofSpan * 0.72));
      roofCone.position.set(0, roofPitch * 0.5, 0);
      gableGroup.add(roofCone);

      // Decorative Timber Gable Panel (หน้าจั่วไม้สักซี่ลูกฟัก)
      const pedimentGeo = new THREE.ConeGeometry(roofSpan * 0.65, roofPitch * 0.85, 3);
      pedimentGeo.rotateZ(Math.PI);
      const pediment = new THREE.Mesh(pedimentGeo, darkWoodMat);
      pediment.position.set(0, roofPitch * 0.42, roofLength * 0.48);
      pediment.scale.set(1.0, 1.0, 0.05);
      gableGroup.add(pediment);

      // Back Pediment
      const backPediment = pediment.clone();
      backPediment.position.z = -roofLength * 0.48;
      gableGroup.add(backPediment);

      // Distinctive Thai Bargeboards with Upward Tips (ปั้นลม / กาแล / ช่อฟ้า)
      const chofaGeo = new THREE.ConeGeometry(0.25, 1.8, 5);
      chofaGeo.rotateX(Math.PI * 0.2);

      const chofaFront = new THREE.Mesh(chofaGeo, darkWoodMat);
      chofaFront.position.set(0, roofPitch + 0.5, roofLength * 0.48);
      gableGroup.add(chofaFront);

      const chofaBack = new THREE.Mesh(chofaGeo, darkWoodMat);
      chofaBack.rotation.y = Math.PI;
      chofaBack.position.set(0, roofPitch + 0.5, -roofLength * 0.48);
      gableGroup.add(chofaBack);

      // Curved Eave Tips (หางหงส์ปลายชายคา)
      for (let tipX of [-roofSpan * 0.5, roofSpan * 0.5]) {
        for (let tipZ of [-roofLength * 0.48, roofLength * 0.48]) {
          const tipGeo = new THREE.ConeGeometry(0.18, 0.9, 4);
          tipGeo.rotateZ(tipX > 0 ? -Math.PI * 0.3 : Math.PI * 0.3);
          const tip = new THREE.Mesh(tipGeo, darkWoodMat);
          tip.position.set(tipX, 0.3, tipZ);
          gableGroup.add(tip);
        }
      }

      gableGroup.position.set(gx, 7.2, 0);
      houseGroup.add(gableGroup);
    });

    // ==========================================
    // 5. WARM INTERIOR & ACCENT LIGHTING
    // ==========================================
    // Warm Interior Glow visible through glass
    const houseWarmLight = new THREE.PointLight(0xffbe5c, 3.2, 18);
    houseWarmLight.position.set(0, 3.8, 2.5);
    houseGroup.add(houseWarmLight);

    // Position Thai House on the right riverside grounds
    houseGroup.position.set(15, 0.25, 9);
    this.scene.add(houseGroup);
  }
}
