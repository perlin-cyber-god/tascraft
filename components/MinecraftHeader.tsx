import * as React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Box, User } from 'lucide-react';

interface MinecraftHeaderProps {
  level?: number;
  progress?: number; // 0 to 100
}

export const MinecraftHeader: React.FC<MinecraftHeaderProps> = ({ level = 0, progress = 0 }) => {
  const { signOut, user } = useAuth();

  const playLevelUpSound = () => {
    // Dummy function as requested
    console.log("Level up sound played!");
  };

  // Reusable Minecraft Button Class
  // Grey background, thick 3D borders (lighter on top/left, darker on bottom/right)
  // Hover state turns border yellow
  const mcButtonClass = `
    relative px-4 py-2 bg-[#c6c6c6] 
    border-t-4 border-l-4 border-b-4 border-r-4 
    border-t-[#ffffff] border-l-[#ffffff] border-b-[#555555] border-r-[#555555] 
    text-[#3f3f3f] font-pixel text-xl 
    hover:border-[#ffff55] hover:bg-[#d0d0d0]
    active:border-t-[#555555] active:border-l-[#555555] active:border-b-[#ffffff] active:border-r-[#ffffff] 
    transition-none shadow-pixel-sm active:translate-y-1 active:shadow-none 
    flex items-center gap-2
  `;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#222] border-b-4 border-mc-stoneDark shadow-pixel-sm font-pixel h-24 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div 
            className="p-2 bg-mc-grass border-2 border-mc-grassSide shadow-sm hover:animate-bounce cursor-pointer group" 
            onClick={playLevelUpSound}
          >
              <Box className="w-8 h-8 text-white group-active:scale-90 transition-transform" />
          </div>
          <span className="text-3xl text-white tracking-widest uppercase text-shadow hidden md:block">TasCraft</span>
        </div>

        {/* XP Bar Section */}
        <div className="flex-grow max-w-2xl mx-4 flex flex-col items-center justify-center relative pt-2">
           {/* Level Number */}
           <div className="text-[#80ff20] text-3xl mb-1 text-shadow-lg font-bold drop-shadow-[0_2px_0_rgba(0,0,0,1)] relative z-10 font-pixel">
              {level}
           </div>
           
           {/* Bar Container */}
           <div className="w-full h-4 bg-[#3a3a3a] border-2 border-[#1a1a1a] relative shadow-[inset_0_2px_0_rgba(0,0,0,0.5)]">
               {/* Progress Fill */}
               <div 
                  className="h-full bg-[#80ff20] shadow-[inset_0_2px_0_rgba(255,255,255,0.2)] transition-all duration-500 ease-out origin-left"
                  style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
               />
               
               {/* Decorative Dividers for XP segments */}
               <div className="absolute inset-0 flex justify-evenly pointer-events-none">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="w-0.5 h-full bg-[#1a1a1a]/50" />
                  ))}
               </div>
           </div>
        </div>
        
        {/* User & Actions */}
        <div className="flex items-center gap-4 shrink-0">
           <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-black/40 border-2 border-white/10 text-mc-stoneLight rounded-sm">
              <User className="w-5 h-5" />
              <span className="text-lg tracking-wide">{user?.email?.split('@')[0]}</span>
           </div>
           
           <button
              onClick={() => signOut()}
              className={mcButtonClass}
              title="Sign Out"
           >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Log Out</span>
           </button>
        </div>
      </div>
    </header>
  );
};
