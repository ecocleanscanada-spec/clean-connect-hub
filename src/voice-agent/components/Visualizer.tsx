import React from 'react';

interface VisualizerProps {
  volume: number;
  isActive: boolean;
}

export const Visualizer: React.FC<VisualizerProps> = ({ volume, isActive }) => {
  const scale = isActive ? 1 + Math.min(volume * 5, 1.5) : 1;
  
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      {isActive && (
        <div className="absolute inset-0 bg-primary rounded-full opacity-20 animate-ping"></div>
      )}
      {isActive && (
        <div className="absolute inset-0 bg-primary/30 rounded-full opacity-20 animate-ping" style={{ animationDelay: '0.5s' }}></div>
      )}
      
      <div 
        className={`w-20 h-20 rounded-full shadow-lg transition-all duration-100 ease-out flex items-center justify-center z-10 ${isActive ? 'bg-gradient-to-br from-primary to-primary/80' : 'bg-muted'}`}
        style={{ transform: `scale(${scale})` }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-10 w-10 text-white ${isActive ? 'animate-pulse' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isActive ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            )}
        </svg>
      </div>
    </div>
  );
};
