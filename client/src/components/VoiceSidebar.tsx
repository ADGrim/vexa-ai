import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Mic, 
  MicOff, 
  Settings, 
  History, 
  MessageSquare, 
  FileText, 
  Info 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import MobiusStrip from './effects/MobiusStrip';
import { SidebarWaveIcon } from './SidebarWaveIcon';

interface VoiceSidebarProps {
  volume?: number;
  isActive?: boolean;
  onActivate?: () => void;
  className?: string;
}

export function VoiceSidebar({ 
  volume = 0, 
  isActive = false, 
  onActivate,
  className 
}: VoiceSidebarProps) {
  const [active, setActive] = useState(isActive);
  
  const handleToggle = () => {
    const newState = !active;
    setActive(newState);
    if (onActivate) onActivate();
  };

  return (
    <div 
      className={cn(
        "fixed left-0 top-0 bottom-0 w-20 bg-black/40 backdrop-blur-lg flex flex-col items-center justify-between py-6 border-r border-white/10",
        className
      )}
      style={{
        boxShadow: "0 0 20px rgba(0, 0, 0, 0.2)",
        zIndex: 50
      }}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="mb-4">
          <SidebarWaveIcon className="w-8 h-8 text-purple-500" />
        </div>
        
        <div className="my-4 relative">
          <Button 
            onClick={handleToggle}
            variant="outline"
            size="icon"
            className={cn(
              "w-12 h-12 rounded-full relative overflow-hidden transition-all duration-300 border-white/20 backdrop-blur-md",
              active ? "bg-purple-500/30 border-purple-400/50" : "bg-slate-800/50 hover:bg-slate-700/50"
            )}
          >
            {active ? (
              <MicOff className="h-5 w-5 text-white absolute z-10" />
            ) : (
              <Mic className="h-5 w-5 text-white absolute z-10" />
            )}
            
            {/* Voice visualizer container */}
            {active && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-full opacity-80">
                  <MobiusStrip volume={volume} size="sm" color="#a855f7" />
                </div>
              </div>
            )}
          </Button>
          
          {/* Volume indicator */}
          {active && (
            <div className="mt-2 w-10 mx-auto">
              <div className="h-1 rounded-full bg-gray-700/50 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-100"
                  style={{ width: `${Math.min(100, volume * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-col gap-3 items-center">
        <NavButton icon={<MessageSquare size={18} />} active />
        <NavButton icon={<History size={18} />} />
        <NavButton icon={<FileText size={18} />} />
        <NavButton icon={<Info size={18} />} />
      </div>
      
      <div>
        <Button 
          variant="ghost" 
          size="icon"
          className="text-white/70 hover:text-white hover:bg-white/10 rounded-full w-10 h-10"
        >
          <Settings size={20} />
        </Button>
      </div>
    </div>
  );
}

interface NavButtonProps {
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

const NavButton = ({ icon, active, onClick }: NavButtonProps) => (
  <Button
    variant="ghost"
    size="icon"
    onClick={onClick}
    className={cn(
      "w-10 h-10 rounded-full transition-all",
      active 
        ? "bg-gradient-to-br from-purple-600/40 to-pink-600/40 text-white"
        : "text-white/50 hover:text-white hover:bg-white/10"
    )}
  >
    {icon}
  </Button>
);

export default VoiceSidebar;