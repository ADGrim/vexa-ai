import React, { useEffect, useState } from 'react';

interface MoodSyncTheme {
  bgClass: string;
  textClass: string;
}

interface MoodSyncWrapperProps {
  children: React.ReactNode;
}

export function getMoodSyncTheme(): MoodSyncTheme {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 12) {
    // Morning: soft light background
    return {
      bgClass: "bg-amber-50",
      textClass: "text-gray-900"
    };
  } else if (hour >= 12 && hour < 18) {
    // Afternoon: bright light background
    return {
      bgClass: "bg-yellow-50",
      textClass: "text-gray-900"
    };
  } else if (hour >= 18 && hour < 21) {
    // Evening: warm dusk background
    return {
      bgClass: "bg-orange-50",
      textClass: "text-gray-900"
    };
  } else {
    // Night: dark background
    return {
      bgClass: "bg-gray-900",
      textClass: "text-gray-50"
    };
  }
}

export function MoodSyncWrapper({ children }: MoodSyncWrapperProps) {
  const [theme, setTheme] = useState<MoodSyncTheme>(getMoodSyncTheme());

  useEffect(() => {
    // Update theme every minute
    const interval = setInterval(() => {
      setTheme(getMoodSyncTheme());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-1000 ${theme.bgClass} ${theme.textClass}`}>
      {children}
    </div>
  );
}
