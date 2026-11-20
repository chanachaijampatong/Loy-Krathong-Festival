import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Environment } from './Environment.js';
import { ThaiArchitecture } from './ThaiArchitecture.js';
import { Characters } from './Characters.js';
import { KrathongFactory } from './KrathongFactory.js';

export class SceneManager {
  constructor(container, onSelectKrathong) {
    this.container = container;
    this.onSelectKrathong = onSelectKrathong;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.clock = new THREE.Clock();

    this.environment = null;
    this.architecture = null;
    this.characters = null;
    this.krathongFactory = null;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.isFocusing = false;
    this.targetCameraPos = null;
    this.targetLookAt = null;

    this.init();
  }

  init() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    // 1. Scene - Bright, magical festival night with vibrant twilight indigo atmosphere
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x131f38);
    this.scene.fog = new THREE.FogExp2(0x182847, 0.006);

    // 2. Camera - Balanced cinematic perspective
    this.camera = new THREE.PerspectiveCamera(48, width / height, 0.5, 300);
    this.camera.position.set(0, 9.5, -24.5);

    // 3. Renderer with optimal pixel ratio for silky 60 FPS
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      stencil: false
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.6;
    this.container.appendChild(this.renderer.domElement);

    // 4. OrbitControls - Silky smooth damping
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.target.set(0, 2.0, -8);
    this.controls.minDistance = 6;
    this.controls.maxDistance = 60;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.06;
    this.controls.minPolarAngle = Math.PI * 0.08;

    // 5. Initialize 3D World Elements
    this.environment = new Environment(this.scene);
    this.architecture = new ThaiArchitecture(this.scene);
    this.characters = new Characters(this.scene);
    this.krathongFactory = new KrathongFactory(this.scene);

    // 6. Event Listeners
    this.onWindowResize = this.onWindowResize.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);

    window.addEventListener('resize', this.onWindowResize);
    this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown);

    // Start Animation Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  clearAllKrathongs() {
    if (this.krathongFactory) {
      this.krathongFactory.clearAllKrathongs();
    }
  }

  loadKrathongs(contestants) {
    this.clearAllKrathongs();
    if (Array.isArray(contestants)) {
      contestants.forEach(c => {
        this.krathongFactory.createKrathong(c);
      });
    }
  }

  addSingleKrathong(contestant) {
    const mesh = this.krathongFactory.createKrathong(contestant);
    // Focus camera onto newly created krathong
    this.focusOnKrathong(contestant.id);
    return mesh;
  }

  focusOnKrathong(id) {
    const mesh = this.krathongFactory.getMeshById(id);
    if (!mesh) return;

    this.isFocusing = true;
    const targetPos = mesh.position.clone();

    this.targetLookAt = new THREE.Vector3(targetPos.x, targetPos.y + 0.5, targetPos.z);
    this.targetCameraPos = new THREE.Vector3(targetPos.x, targetPos.y + 4.5, targetPos.z - 7.5);
  }

  onPointerDown(event) {
    // Only raycast on primary click / tap
    if (event.button !== 0 && event.pointerType === 'mouse') return;

    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.krathongFactory.interactiveObjects, false);

    if (intersects.length > 0) {
      const hit = intersects[0];
      const krathongId = hit.object.userData.id;
      if (krathongId && this.onSelectKrathong) {
        this.onSelectKrathong(krathongId);
      }
    }
  }

  onWindowResize() {
    if (!this.container || !this.camera || !this.renderer) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(this.animate);

    const elapsedTime = this.clock.getElapsedTime();

    // Smooth camera transition when focusing
    if (this.isFocusing && this.targetCameraPos && this.targetLookAt) {
      this.camera.position.lerp(this.targetCameraPos, 0.05);
      this.controls.target.lerp(this.targetLookAt, 0.05);

      if (this.camera.position.distanceTo(this.targetCameraPos) < 0.2) {
        this.isFocusing = false;
      }
    }

    this.controls.update();

    if (this.environment) this.environment.update(elapsedTime);
    if (this.characters) this.characters.update(elapsedTime);
    if (this.krathongFactory) this.krathongFactory.update(elapsedTime);

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.onWindowResize);
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.removeEventListener('pointerdown', this.onPointerDown);
      if (this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
      this.renderer.dispose();
    }
  }
}
