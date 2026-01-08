
import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';
import { useAppContext } from '../store/AppContext';
import { Advertisement } from '../types';

interface ContestBannerProps {
  onAction?: (formType?: 'festival' | 'competition' | 'premiere') => void;
}

const getYouTubeID = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const ContestBanner: React.FC<ContestBannerProps> = ({ onAction }) => {
  const { user, login, advertisements } = useAppContext();
  const [activeIndex, setActiveIndex] = useState(0);
  
  const activeAds = advertisements.filter(a => a.isActive);

  useEffect(() => {
    if (activeAds.length <= 1) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % activeAds.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [activeAds.length]);

  if (activeAds.length === 0) return null;

  const handleAction = (ad: Advertisement) => {
    if (!user) {
      login();
    } else if (onAction) {
      onAction(ad.targetForm);
    } else {
      const heroSection = document.getElementById('root');
      if (heroSection) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="relative w-full group overflow-hidden rounded-[2rem] bg-black border border-amber-500/30 shadow-[0_0_40px_rgba(139,0,0,0.2)] h-48 sm:h-56 md:h-64">
      {/* Horizontal Sliding Track */}
      <div 
        className="flex transition-transform duration-1000 ease-in-out h-full"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {activeAds.map((ad) => {
          const videoId = ad.videoUrl ? getYouTubeID(ad.videoUrl) : null;
          return (
            <div key={ad.id} className="min-w-full relative h-full flex-shrink-0">
              {/* Cinematic Background Layer */}
              <div className="absolute inset-0">
                {videoId ? (
                  <div className="absolute inset-0 w-full h-full pointer-events-none scale-150">
                     <iframe
                       className="w-full h-full opacity-40"
                       src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&modestbranding=1&rel=0&showinfo=0`}
                       frameBorder="0"
                       allow="autoplay; encrypted-media"
                     ></iframe>
                  </div>
                ) : ad.imageUrl ? (
                  <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover opacity-40 scale-105" />
                ) : (
                  <div className="absolute inset-0 bg-red-carpet opacity-60"></div>
                )}
                
                {/* Overlays */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-black/80"></div>
              </div>

              <div className="relative z-10 px-6 py-6 md:px-12 md:py-8 flex flex-row items-center justify-between gap-8 h-full">
                <div className="flex-1 text-left space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-amber-500/20 mb-1">
                    <span className="flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                    </span>
                    <span className="text-[8px] font-bold text-amber-500 uppercase tracking-[0.3em]">{ad.subtitle}</span>
                  </div>
                  
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-white leading-tight drop-shadow-xl">
                    {ad.prize ? (
                      <>Win <span className="gold-text italic">Prize</span>: {ad.prize}</>
                    ) : ad.title}
                  </h2>
                  
                  <p className="text-neutral-300 text-[10px] sm:text-xs md:text-sm max-w-xl font-light leading-relaxed line-clamp-2 italic opacity-80">
                    {ad.description}
                  </p>
                </div>

                <div className="relative flex-shrink-0 group">
                  <button 
                    onClick={() => handleAction(ad)}
                    className="relative px-8 py-3 sm:px-10 sm:py-4 bg-white text-black font-bold rounded-2xl text-[9px] sm:text-[10px] uppercase tracking-[0.2em] hover:bg-amber-500 transition-all duration-500 hover:scale-110 active:scale-95 shadow-2xl flex flex-col items-center min-w-[140px] sm:min-w-[180px]"
                  >
                    <span className="mb-1">{ad.actionText}</span>
                    {ad.entryFee ? (
                      <span className="text-[7px] sm:text-[8px] opacity-60 font-mono tracking-tighter border-t border-black/10 pt-1 mt-1 w-full text-center">₹{ad.entryFee} ENTRY FEE</span>
                    ) : null}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rotation Indicator Dots */}
      {activeAds.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {activeAds.map((_, i) => (
            <div 
              key={i} 
              onClick={() => setActiveIndex(i)}
              className={`h-1 rounded-full transition-all duration-500 cursor-pointer ${i === activeIndex ? 'bg-amber-500 w-8 shadow-[0_0_10px_rgba(245,158,11,0.8)]' : 'bg-white/20 w-2 hover:bg-white/40'}`}
            />
          ))}
        </div>
      )}

      {/* Navigation Arrows */}
      {activeAds.length > 1 && (
        <>
          <button 
            onClick={() => setActiveIndex((prev) => (prev - 1 + activeAds.length) % activeAds.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 hover:bg-black/60 border border-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all opacity-0 group-hover:opacity-100 z-30"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button 
            onClick={() => setActiveIndex((prev) => (prev + 1) % activeAds.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 hover:bg-black/60 border border-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all opacity-0 group-hover:opacity-100 z-30"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </>
      )}
    </div>
  );
};

export default ContestBanner;
