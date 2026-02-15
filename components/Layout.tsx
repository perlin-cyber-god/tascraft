import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CustomCursor } from './ui/CustomCursor';
import { WeatherEffects } from './ui/WeatherEffects';
import { MinecraftHeader } from './MinecraftHeader';

interface LayoutProps {
  children: React.ReactNode;
  weather?: 'snow' | 'rain' | 'none';
  level?: number;
  progress?: number;
}

export const Layout: React.FC<LayoutProps> = ({ children, weather = 'snow', level = 0, progress = 0 }) => {
  return (
    <div className="min-h-screen bg-mc-bg text-gray-200 font-pixel selection:bg-mc-green selection:text-white relative overflow-hidden">
      <CustomCursor />
      
      <WeatherEffects effectType={weather} particleCount={80} />

      <MinecraftHeader level={level} progress={progress} />

      <main className="relative z-10 pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
};
