import React from 'react';
import { cn } from '@/lib/utils';

interface MobiusStripProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

/**
 * A web-compatible version of the MobiusStrip animation
 * Renders a rotating dashed border that resembles a Möbius strip or infinity symbol
 */
export function MobiusStrip({ 
  size = 'md', 
  color = 'primary',
  className 
}: MobiusStripProps) {
  // Define size values
  const sizeValues = {
    sm: {
      container: 'h-16 w-16',
      strip: 'w-10 h-10 border-2',
    },
    md: {
      container: 'h-24 w-24',
      strip: 'w-16 h-16 border-3',
    },
    lg: {
      container: 'h-32 w-32',
      strip: 'w-20 h-20 border-4',
    },
  };

  return (
    <div 
      className={cn(
        "flex items-center justify-center", 
        sizeValues[size].container,
        className
      )}
    >
      <div 
        className={cn(
          "rounded-full border-dashed animate-spin-slow",
          sizeValues[size].strip
        )}
        style={{ 
          borderColor: `hsl(var(--${color}))`,
          transformStyle: 'preserve-3d'
        }}
      />
    </div>
  );
}