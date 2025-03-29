import React, { useEffect, useRef } from 'react';

interface MobiusStripProps {
  volume?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const MobiusStrip: React.FC<MobiusStripProps> = ({ 
  volume = 0.5, 
  size = 'md',
  color = '#9c27b0'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const angleRef = useRef(0);
  
  // Size configurations based on the size prop
  const sizes = {
    sm: { width: 40, height: 40, lineWidth: 2 },
    md: { width: 60, height: 60, lineWidth: 3 },
    lg: { width: 80, height: 80, lineWidth: 4 }
  };
  
  const { width, height, lineWidth } = sizes[size];
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions based on device pixel ratio for sharp rendering
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(pixelRatio, pixelRatio);
    
    const drawMobiusStrip = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Calculate center of canvas
      const centerX = width / 2;
      const centerY = height / 2;
      
      // Radius of the strip should be proportional to the canvas dimensions
      const radius = Math.min(centerX, centerY) - lineWidth * 2;
      
      // Calculate color brightness based on volume (0-1)
      const brightness = Math.floor(90 + volume * 100);
      const hue = 280; // Roughly the hue of #9c27b0 (purple)
      const saturation = 80 + volume * 20;
      
      // Use the provided color or create one from the volume
      const stripColor = color === '#9c27b0' 
        ? `hsla(${hue}, ${saturation}%, ${brightness}%, 0.85)`
        : color;
      
      // Glow effect strength based on volume
      const shadowBlur = 5 + volume * 15;
      
      // Draw the mobius strip
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angleRef.current);
      
      ctx.strokeStyle = stripColor;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.shadowColor = stripColor;
      ctx.shadowBlur = shadowBlur;
      
      // Draw a dashed circular path
      ctx.beginPath();
      ctx.setLineDash([2, 4]);
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw a twisted 8-shape to represent a mobius strip
      ctx.beginPath();
      ctx.setLineDash([]);
      
      // Number of points to draw (more points = smoother curve)
      const points = 60;
      
      for (let i = 0; i <= points; i++) {
        const t = (i / points) * Math.PI * 2;
        
        // Parametric equations for a figure-8 / mobius
        const x = radius * Math.sin(t * 2) * Math.cos(t);
        const y = radius * Math.sin(t);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
      ctx.restore();
      
      // Increment angle for rotation (speed based on volume)
      angleRef.current += 0.02 + volume * 0.02;
      
      // Request next frame
      rafRef.current = requestAnimationFrame(drawMobiusStrip);
    };
    
    drawMobiusStrip();
    
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [width, height, lineWidth, volume, color]);
  
  return (
    <div 
      className="mobius-strip-container" 
      style={{ 
        width: `${width}px`, 
        height: `${height}px`, 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <canvas 
        ref={canvasRef} 
        style={{
          borderRadius: '50%',
        }}
      />
    </div>
  );
};

export default MobiusStrip;