
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
    <div className="relative w-full group overflow-hidden rounded-lg bg-black border border-amber-500/20 shadow-[0_0_15px_rgba(139,0,0,0.1)] h-24 sm:h-28 md:h-32">
      {/* Horizontal Sliding Track */}
      <div 
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {activeAds.map((ad) => {
          const videoId = ad.videoUrl ? getYouTubeID(ad.videoUrl) : null;
          return (
            <div key={ad.id} className="min-w-full relative h-full flex-shrink-0">
              {/* Cinematic Background Layer */}
              <div className="absolute inset-0">
                {videoId ? (
                  <div className="absolute inset-0 w-full h-full pointer-events-none scale-125">
                     <iframe
                       className="w-full h-full opacity-20"
                       src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&modestbranding=1&rel=0&showinfo=0`}
                       frameBorder="0"
                       allow="autoplay; encrypted-media"
                     ></iframe>
                  </div>
                ) : ad.imageUrl ? (
                  <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover opacity-20" />
                ) : (
                  <div className="absolute inset-0 bg-red-carpet opacity-70"></div>
                )}
                
                {/* Overlays */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/10 to-black/80"></div>
              </div>

              <div className="relative z-10 px-3 py-2 md:px-5 md:py-3 flex flex-row items-center justify-between gap-3 h-full">
                <div className="flex-1 text-left">
                  <div className="inline-flex items-center gap-1 px-1 py-0 bg-black/60 backdrop-blur-md rounded-full border border-amber-500/10 mb-1">
                    <span className="flex h-1 w-1">
                      <span className="animate-ping absolute inline-flex h-1 w-1 rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1 w-1 bg-amber-500"></span>
                    </span>
                    <span className="text-[6px] font-bold text-amber-500 uppercase tracking-[0.2em]">{ad.subtitle}</span>
                  </div>
                  
                  <h2 className="text-xs sm:text-sm md:text-base font-serif font-bold text-white leading-tight mb-0 line-clamp-1">
                    {ad.prize ? (
                      <>Win <span className="gold-text italic">Prize</span>: {ad.prize}</>
                    ) : ad.title}
                  </h2>
                  
                  <p className="text-neutral-500 text-[6px] sm:text-[8px] max-w-sm font-light leading-tight line-clamp-1">
                    {ad.description}
                  </p>
                </div>

                <div className="relative flex-shrink-0 group">
                  <button 
                    onClick={() => handleAction(ad)}
                    className="relative px-3 py-1.5 sm:px-5 sm:py-2 bg-white text-black font-bold rounded text-[7px] sm:text-[8px] uppercase tracking-[0.1em] hover:bg-amber-500 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md flex flex-col items-center min-w-[80px] sm:min-w-[100px]"
                  >
                    <span className="mb-0">{ad.actionText}</span>
                    {ad.entryFee ? (
                      <span className="text-[5px] sm:text-[6px] opacity-60 font-mono tracking-tighter">₹{ad.entryFee} Entry</span>
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
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1 z-20">
          {activeAds.map((_, i) => (
            <div 
              key={i} 
              onClick={() => setActiveIndex(i)}
              className={`w-0.5 h-0.5 rounded-full transition-all cursor-pointer ${i === activeIndex ? 'bg-amber-500 w-2 shadow-[0_0_2px_rgba(245,158,11,0.5)]' : 'bg-white/20 hover:bg-white/40'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ContestBanner;
