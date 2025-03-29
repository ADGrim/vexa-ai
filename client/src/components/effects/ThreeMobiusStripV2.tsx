import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry.js';

interface ThreeMobiusStripProps {
  volume?: number;
  size?: number;
  color?: string;
  wireframe?: boolean;
  containerId?: string;
  meshRef?: React.MutableRefObject<THREE.Mesh | null>;
}

const ThreeMobiusStripV2: React.FC<ThreeMobiusStripProps> = ({
  volume = 0.5,
  size = 200,
  color = '#8e44ad',
  wireframe = true,
  containerId = 'mobius-container',
  meshRef
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const mobiusRef = useRef<THREE.Mesh | null>(null);
  const requestRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  
  // Create the Möbius strip scene
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clean up any existing instance
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    
    if (rendererRef.current && containerRef.current.contains(rendererRef.current.domElement)) {
      containerRef.current.removeChild(rendererRef.current.domElement);
    }
    
    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(75, size / size, 0.1, 1000);
    camera.position.z = 3;
    cameraRef.current = camera;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(size, size);
    rendererRef.current = renderer;
    
    // Add canvas to container
    containerRef.current.appendChild(renderer.domElement);
    
    // Add lighting
    const light = new THREE.PointLight(0xffffff, 2);
    light.position.set(5, 5, 5);
    scene.add(light);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    // Create Möbius strip geometry using parametric function
    const createMobiusGeometry = () => {
      const mobiusFunction = (u: number, t: number, target: THREE.Vector3) => {
        u *= Math.PI * 2;
        t = t * 2 - 1;
        
        // Mathematical representation of a Möbius strip
        const x = (1 + 0.5 * t * Math.cos(u / 2)) * Math.cos(u);
        const y = (1 + 0.5 * t * Math.cos(u / 2)) * Math.sin(u);
        const z = 0.5 * t * Math.sin(u / 2);
        
        target.set(x, y, z);
      };
      
      return new ParametricGeometry(mobiusFunction, 80, 10);
    };
    
    // Create material with realistic properties
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
    const mobiusGeometry = createMobiusGeometry();
    const mobius = new THREE.Mesh(mobiusGeometry, mobiusMaterial);
    mobiusRef.current = mobius;
    
    // If external meshRef provided, sync it
    if (meshRef) {
      meshRef.current = mobius;
    }
    
    scene.add(mobius);
    
    setReady(true);
    
    // Clean up on unmount
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
      
      if (mobiusRef.current) {
        if (mobiusRef.current.geometry) {
          mobiusRef.current.geometry.dispose();
        }
        
        if (mobiusRef.current.material) {
          if (Array.isArray(mobiusRef.current.material)) {
            mobiusRef.current.material.forEach(material => material.dispose());
          } else {
            mobiusRef.current.material.dispose();
          }
        }
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [size, color, wireframe, meshRef]);
  
  // Animation loop
  useEffect(() => {
    if (!ready) return;
    
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !mobiusRef.current) return;
      
      // Update rotation speed based on volume
      const rotationSpeed = 0.01 + (volume * 0.02);
      mobiusRef.current.rotation.y += rotationSpeed;
      mobiusRef.current.rotation.x += rotationSpeed / 2;
      
      // Update material properties based on volume
      if (mobiusRef.current.material instanceof THREE.MeshStandardMaterial) {
        mobiusRef.current.material.emissiveIntensity = 0.3 + volume * 0.7;
        mobiusRef.current.material.opacity = 0.6 + volume * 0.4;
      }
      
      // Render scene
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      
      // Continue animation loop
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [ready, volume]);
  
  return (
    <div 
      ref={containerRef}
      style={{ 
        width: `${size}px`, 
        height: `${size}px`, 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      }}
    />
  );
};

export default ThreeMobiusStripV2;