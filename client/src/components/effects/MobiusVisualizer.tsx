import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry.js';

interface MobiusVisualizerProps {
  active: boolean;
  volume?: number;
  color?: string;
}

export default function MobiusVisualizer({ active, volume = 0.5, color = '#8e44ad' }: MobiusVisualizerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const mobiusMeshRef = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const lightRef = useRef<THREE.PointLight | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.z = 4;
    
    // Create renderer with transparency
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;
    
    // Only append to DOM if active
    if (active) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Create Möbius strip
    const mobiusFunction = (u: number, t: number, target: THREE.Vector3) => {
      u *= Math.PI * 2;
      t = t * 2 - 1;
      const x = (1 + 0.5 * t * Math.cos(u / 2)) * Math.cos(u);
      const y = (1 + 0.5 * t * Math.cos(u / 2)) * Math.sin(u);
      const z = 0.5 * t * Math.sin(u / 2);
      target.set(x, y, z);
    };
    
    const mobius = new ParametricGeometry(mobiusFunction, 80, 10);

    // Create material with customizable color
    const colorObj = new THREE.Color(color);
    const material = new THREE.MeshStandardMaterial({
      color: colorObj,
      metalness: 0.7,
      roughness: 0.1,
      wireframe: false,
      side: THREE.DoubleSide,
      emissive: colorObj,
      emissiveIntensity: 0.3
    });

    // Create and add mesh to scene
    const mobiusMesh = new THREE.Mesh(mobius, material);
    mobiusMeshRef.current = mobiusMesh;
    scene.add(mobiusMesh);

    // Create particle system around the Möbius strip
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 4;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    // Create particles with same color as Möbius strip but more transparent
    const particleMaterial = new THREE.PointsMaterial({ 
      color: colorObj, 
      size: 0.01,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    particlesRef.current = particles;
    scene.add(particles);

    // Add lighting
    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    lightRef.current = light;
    scene.add(light);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Animation function
    const animate = () => {
      if (!active || !mobiusMeshRef.current || !particlesRef.current || !rendererRef.current) return;
      
      requestAnimationFrame(animate);
      
      // Adjust rotation speed based on volume
      const rotationSpeed = 0.002 * (1 + volume * 2);
      mobiusMeshRef.current.rotation.x += rotationSpeed;
      mobiusMeshRef.current.rotation.y += rotationSpeed * 2;
      
      // Slower particle rotation
      particlesRef.current.rotation.y += 0.001;
      
      // Update material properties based on volume
      if (mobiusMeshRef.current.material instanceof THREE.MeshStandardMaterial) {
        mobiusMeshRef.current.material.emissiveIntensity = 0.3 + volume * 0.7;
        mobiusMeshRef.current.material.opacity = 0.6 + volume * 0.4;
      }
      
      // Update particle size based on volume 
      if (particlesRef.current.material instanceof THREE.PointsMaterial) {
        particlesRef.current.material.size = 0.01 + (volume * 0.02);
        particlesRef.current.material.opacity = 0.3 + (volume * 0.5);
      }
      
      renderer.render(scene, camera);
    };

    // Start animation if active
    let animationId: number | null = null;
    if (active) {
      animationId = requestAnimationFrame(animate);
    }

    // Handle window resizing
    const handleResize = () => {
      if (!rendererRef.current) return;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      
      if (mountRef.current && rendererRef.current && rendererRef.current.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      
      if (mobiusMeshRef.current) {
        if (mobiusMeshRef.current.geometry) {
          mobiusMeshRef.current.geometry.dispose();
        }
        
        if (mobiusMeshRef.current.material) {
          if (Array.isArray(mobiusMeshRef.current.material)) {
            mobiusMeshRef.current.material.forEach(material => material.dispose());
          } else {
            mobiusMeshRef.current.material.dispose();
          }
        }
      }
      
      if (particlesRef.current && particlesRef.current.geometry) {
        particlesRef.current.geometry.dispose();
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      window.removeEventListener('resize', handleResize);
    };
  }, [active, color]);
  
  // Effect to handle volume changes without remounting
  useEffect(() => {
    if (!mobiusMeshRef.current || !particlesRef.current || !active) return;
    
    // Update material properties based on volume
    if (mobiusMeshRef.current.material instanceof THREE.MeshStandardMaterial) {
      mobiusMeshRef.current.material.emissiveIntensity = 0.3 + volume * 0.7;
    }
    
    // Update particle size based on volume
    if (particlesRef.current.material instanceof THREE.PointsMaterial) {
      particlesRef.current.material.size = 0.01 + (volume * 0.02);
      particlesRef.current.material.opacity = 0.3 + (volume * 0.5);
    }
    
    // Update light intensity based on volume
    if (lightRef.current) {
      lightRef.current.intensity = 1 + (volume * 1.5);
    }
  }, [volume, active]);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 10,
        display: active ? 'block' : 'none',
        background: 'transparent',
        pointerEvents: 'none',
      }}
    />
  );
}