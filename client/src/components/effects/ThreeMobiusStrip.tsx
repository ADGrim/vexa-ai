import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { TorusKnotGeometry } from 'three';

interface MobiusStripProps {
  volume?: number;
  size?: number;
  color?: string;
  containerId?: string;
}

const ThreeMobiusStrip: React.FC<MobiusStripProps> = ({
  volume = 0.5,
  size = 200,
  color = '#8e44ad',
  containerId = 'mobius-container'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const mobiusRef = useRef<THREE.Mesh | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup scene
    sceneRef.current = new THREE.Scene();
    
    // Setup camera
    cameraRef.current = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    cameraRef.current.position.z = 3;
    
    // Setup renderer
    rendererRef.current = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    rendererRef.current.setSize(size, size);
    
    // Clear container and append renderer
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(rendererRef.current.domElement);
    
    // Add lighting
    const light = new THREE.PointLight(0xffffff, 2);
    light.position.set(5, 5, 5);
    sceneRef.current.add(light);
    
    // Create Torus Knot geometry (similar to Möbius strip)
    // p=2, q=3 parameters create a shape that resembles a Möbius strip
    const radius = 0.8;
    const tubeRadius = 0.2;
    const radialSegments = 90;
    const tubularSegments = 16;
    const p = 2;
    const q = 3;
    const mobiusGeometry = new THREE.TorusKnotGeometry(
      radius, tubeRadius, tubularSegments, radialSegments, p, q
    );
    
    // Create material with glow effect
    const colorObj = new THREE.Color(color);
    const mobiusMaterial = new THREE.MeshStandardMaterial({
      color: colorObj,
      wireframe: true,
      opacity: 0.8,
      transparent: true,
      emissive: colorObj,
      emissiveIntensity: 0.5
    });
    
    // Create mesh and add to scene
    mobiusRef.current = new THREE.Mesh(mobiusGeometry, mobiusMaterial);
    sceneRef.current.add(mobiusRef.current);
    
    // Animation function
    const animate = () => {
      if (!mobiusRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) return;
      
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
      frameRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup function
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      
      if (mobiusRef.current && mobiusRef.current.geometry) {
        mobiusRef.current.geometry.dispose();
      }
      
      if (mobiusRef.current && mobiusRef.current.material) {
        if (Array.isArray(mobiusRef.current.material)) {
          mobiusRef.current.material.forEach(material => material.dispose());
        } else {
          mobiusRef.current.material.dispose();
        }
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [size, color]);
  
  // Update rotation and visual effects when volume changes
  useEffect(() => {
    if (mobiusRef.current && mobiusRef.current.material instanceof THREE.MeshStandardMaterial) {
      mobiusRef.current.material.emissiveIntensity = 0.3 + volume * 0.7;
      mobiusRef.current.material.opacity = 0.6 + volume * 0.4;
    }
  }, [volume]);
  
  return (
    <div 
      ref={containerRef}
      id={containerId}
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

export default ThreeMobiusStrip;