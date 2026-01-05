
import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';
import { useAppContext } from '../store/AppContext';
import { Advertisement } from '../types';

interface ContestBannerProps {
  onAction?: (formType?: 'festival' | 'competition' | 'premiere') => void;
}

const ContestBanner: React.FC<ContestBannerProps> = ({ onAction }) => {
  const { user, login, advertisements } = useAppContext();
  const [activeIndex, setActiveIndex] = useState(0);
  
  const activeAds = advertisements.filter(a => a.isActive);
  const highlightAd = activeAds[activeIndex];

  useEffect(() => {
    if (activeAds.length <= 1) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % activeAds.length);
    }, 6000); // Rotate every 6 seconds
    
    return () => clearInterval(interval);
  }, [activeAds.length]);

  if (!highlightAd) return null;

  const handleAction = () => {
    if (!user) {
      login();
    } else if (onAction) {
      onAction(highlightAd.targetForm);
    } else {
      const heroSection = document.getElementById('root');
      if (heroSection) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <div key={highlightAd.id} className="relative w-full group overflow-hidden rounded-3xl bg-black border border-amber-500/20 shadow-[0_0_40px_rgba(139,0,0,0.3)] animate-in fade-in zoom-in duration-700">
      {/* Background with cinematic elements */}
      {highlightAd.imageUrl ? (
        <div className="absolute inset-0">
          <img src={highlightAd.imageUrl} alt={highlightAd.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-black"></div>
        </div>
      ) : (
        <>
          <div className="absolute inset-0 bg-red-carpet opacity-95 transition-all duration-1000"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40"></div>
        </>
      )}
      
      {/* Decorative Spotlights */}
      <div className="absolute top-0 left-1/4 w-32 h-full bg-white/5 blur-3xl -skew-x-12 animate-pulse"></div>

      <div className="relative z-10 px-6 py-6 md:px-10 md:py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-black/40 backdrop-blur-md rounded-full border border-amber-500/30 mb-2">
            <span className="flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
            </span>
            <span className="text-[8px] font-bold text-amber-500 uppercase tracking-[0.2em]">{highlightAd.subtitle}</span>
          </div>
          
          <h2 className="text-xl md:text-2xl font-serif font-bold text-white leading-tight">
            {highlightAd.prize ? (
              <>Win the <span className="gold-text italic">Grand Jury</span> Prize of {highlightAd.prize}</>
            ) : highlightAd.title}
          </h2>
          
          <p className="text-neutral-300 text-[10px] max-w-md mt-1 font-light leading-relaxed hidden md:block">
            {highlightAd.description}
          </p>
        </div>

        <div className="relative flex-shrink-0 group">
          <div className="absolute inset-0 bg-amber-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <button 
            onClick={handleAction}
            className="relative px-8 py-3 bg-white text-black font-bold rounded-xl text-[9px] uppercase tracking-[0.2em] hover:bg-amber-500 transition-all duration-500 hover:scale-105 active:scale-95 shadow-xl flex flex-col items-center"
          >
            <span>{highlightAd.actionText}</span>
            {highlightAd.entryFee ? (
              <span className="text-[7px] opacity-60 font-mono tracking-tighter mt-0.5">Entry: ₹{highlightAd.entryFee}</span>
            ) : null}
          </button>
        </div>
      </div>

      {/* Paparazzi Flashes for the ad */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="flash" style={{ top: '20%', left: '10%', animationDelay: '0.2s', width: '40px', height: '40px' }}></div>
        <div className="flash" style={{ bottom: '30%', right: '15%', animationDelay: '1.5s', width: '50px', height: '50px' }}></div>
      </div>
      
      {/* Rotation Indicator Dots */}
      {activeAds.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
          {activeAds.map((_, i) => (
            <div 
              key={i} 
              onClick={() => setActiveIndex(i)}
              className={`w-1 h-1 rounded-full transition-all cursor-pointer ${i === activeIndex ? 'bg-amber-500 w-3' : 'bg-white/20'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ContestBanner;
