import * as THREE from 'three';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry.js';

let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let mobius: THREE.Mesh | null = null;
let animationFrameId: number | null = null;
let volumeValue = 0.5;

/**
 * Initialize a 3D Möbius strip visualization using Three.js
 * @param containerId The DOM element ID to render into
 * @param config Optional configuration parameters
 */
export function initMobius(
  containerId = 'mobius-container',
  config: {
    width?: number;
    height?: number;
    color?: string;
    wireframe?: boolean;
  } = {}
) {
  const {
    width = 200,
    height = 200,
    color = '#8e44ad',
    wireframe = true
  } = config;

  // Clean up any existing instance
  cleanupMobius();

  // Get container element
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Element with ID ${containerId} not found`);
    return;
  }

  // Create scene
  scene = new THREE.Scene();
  
  // Create camera
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 3;

  // Create renderer
  renderer = new THREE.WebGLRenderer({ 
    alpha: true, 
    antialias: true 
  });
  renderer.setSize(width, height);
  
  // Clear container and append renderer
  container.innerHTML = '';
  container.appendChild(renderer.domElement);
  
  // Add lighting
  const light = new THREE.PointLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  scene.add(light);
  
  // Create ambient light for better visibility
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);
  
  // Create a true Möbius strip using ParametricGeometry
  const mobiusFunction = (u: number, t: number, target: THREE.Vector3) => {
    u *= Math.PI * 2;
    t = t * 2 - 1;

    // Mathematical representation of a Möbius strip
    const x = (1 + 0.5 * t * Math.cos(u / 2)) * Math.cos(u);
    const y = (1 + 0.5 * t * Math.cos(u / 2)) * Math.sin(u);
    const z = 0.5 * t * Math.sin(u / 2);
    
    target.set(x, y, z);
  };
  
  const mobiusGeometry = new ParametricGeometry(mobiusFunction, 80, 10);
  
  // Create material with glow effect
  const colorObj = new THREE.Color(color);
  const mobiusMaterial = new THREE.MeshStandardMaterial({
    color: colorObj,
    wireframe,
    opacity: 0.8,
    transparent: true,
    emissive: colorObj,
    emissiveIntensity: 0.5,
    metalness: 0.5,
    roughness: 0.3,
    side: THREE.DoubleSide
  });
  
  // Create mesh and add to scene
  mobius = new THREE.Mesh(mobiusGeometry, mobiusMaterial);
  scene.add(mobius);
  
  // Start animation
  animate();
}

/**
 * Animation loop for the Möbius strip
 */
function animate() {
  if (!scene || !camera || !renderer || !mobius) return;
  
  // Update rotation speed based on volume
  const rotationSpeed = 0.01 + (volumeValue * 0.02);
  mobius.rotation.y += rotationSpeed;
  mobius.rotation.x += rotationSpeed / 2;
  
  // Update material properties based on volume
  if (mobius.material instanceof THREE.MeshStandardMaterial) {
    mobius.material.emissiveIntensity = 0.3 + volumeValue * 0.7;
    mobius.material.opacity = 0.6 + volumeValue * 0.4;
  }
  
  // Render scene
  renderer.render(scene, camera);
  
  // Continue animation loop
  animationFrameId = requestAnimationFrame(animate);
}

/**
 * Update the volume value used for animation speed and visual effects
 * @param volume Volume value between 0 and 1
 */
export function updateMobiusVolume(volume: number): void {
  volumeValue = Math.max(0, Math.min(1, volume));
}

/**
 * Clean up Three.js resources to prevent memory leaks
 */
export function cleanupMobius(): void {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  
  if (mobius) {
    if (mobius.geometry) {
      mobius.geometry.dispose();
    }
    
    if (mobius.material) {
      if (Array.isArray(mobius.material)) {
        mobius.material.forEach(material => material.dispose());
      } else {
        mobius.material.dispose();
      }
    }
    
    mobius = null;
  }
  
  if (scene) {
    scene = null;
  }
  
  if (renderer) {
    renderer.dispose();
    renderer = null;
  }
}