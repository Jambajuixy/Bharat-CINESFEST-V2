
import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import ProgramGuideModal from './Modals/ProgramGuideModal';

const AccessDeniedScreen: React.FC = () => {
  const { login } = useAppContext();
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Background Layer with Provided Gala Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://r.jina.ai/i/695d66579998463183574d6c11d4d29a" 
          alt="Gala Atmosphere" 
          className="w-full h-full object-cover opacity-20 contrast-125 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black"></div>
        <div className="absolute inset-0 vignette opacity-80"></div>
        <div className="bokeh opacity-30"></div>
        
        {/* Animated Spotlights */}
        <div className="spotlight left-[-10%] top-[-10%] opacity-20"></div>
        <div className="spotlight right-[-10%] top-[-10%] opacity-20 animation-delay-3000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl px-6 animate-in fade-in zoom-in duration-1000">
        <div className="w-20 h-20 bg-red-carpet gold-glow rounded-full flex items-center justify-center mx-auto mb-8 border border-amber-500/30">
          <span className="text-3xl font-serif font-bold text-white">B</span>
        </div>
        
        <div className="flex flex-col items-center mb-10">
          <span className="text-sm sm:text-lg uppercase tracking-[0.8em] text-amber-500 font-bold mb-2 opacity-80">Bharat</span>
          <h1 className="text-5xl sm:text-8xl font-serif font-bold gold-text tracking-tighter leading-none">
            CINEFEST
          </h1>
        </div>
        
        <p className="text-neutral-400 text-sm sm:text-base font-light mb-12 leading-relaxed tracking-wide">
          Welcome to the world's most exclusive digital short film festival. 
          Step behind the velvet rope to experience the next generation of visionary cinema.
        </p>

        <div className="flex flex-col items-center gap-6">
          <button 
            onClick={login}
            className="px-12 py-5 bg-red-carpet gold-glow rounded-full text-white font-bold text-xs uppercase tracking-[0.4em] hover:scale-105 transition-all duration-300 shadow-[0_0_50px_rgba(139,0,0,0.4)]"
          >
            Enter the Gala
          </button>
          
          <button 
            onClick={() => setIsGuideOpen(true)}
            className="text-[10px] text-neutral-500 hover:text-amber-500 font-bold uppercase tracking-[0.3em] transition-colors"
          >
            View Program Guide
          </button>
          
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-neutral-800"></span>
            <span className="text-[9px] text-neutral-600 font-bold uppercase tracking-[0.3em]">Identity Secure Access</span>
            <span className="h-px w-8 bg-neutral-800"></span>
          </div>
        </div>
      </div>

      {/* Decorative Velvet Rope */}
      <div className="absolute bottom-12 left-0 right-0 max-w-4xl mx-auto px-6 opacity-30">
        <div className="velvet-rope w-full"></div>
      </div>
      <ProgramGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
};

export default AccessDeniedScreen;
