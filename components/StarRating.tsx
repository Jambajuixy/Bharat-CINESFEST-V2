
import React, { useState } from 'react';
import { Icons } from '../constants';
import { Film } from '../types';
import { useAppContext } from '../store/AppContext';

interface StarRatingProps {
  film: Film;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ film, size = 'sm', showLabel = true }) => {
  const { addRating, user, login, userRatings } = useAppContext();
  const [hover, setHover] = useState(0);
  
  const userSpecificRating = userRatings[film.id];
  const hasRated = !!userSpecificRating;

  const handleRate = (e: React.MouseEvent, rating: number) => {
    e.stopPropagation();
    if (!user) { login(); return; }
    if (hasRated) return; // Disallow re-rating
    addRating(film.id, rating);
  };

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`flex flex-col gap-2 ${size === 'lg' ? 'items-center py-6 bg-white/[0.02] rounded-3xl border border-neutral-800/40 w-full' : 'items-start py-1'}`}>
      {size === 'lg' && (
        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-2">
          {hasRated ? 'Your Artistic Judgment' : 'Cast Your Score'}
        </span>
      )}
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => {
            // Priority: Hover state > User's specific rating > Film's global score
            const isHighlighted = (hover || userSpecificRating || Math.round(film.score || 0)) >= star;
            const isUserRated = hasRated && userSpecificRating >= star;
            
            return (
              <button
                key={star}
                onMouseEnter={() => !hasRated && setHover(star)}
                onMouseLeave={() => !hasRated && setHover(0)}
                onClick={(e) => handleRate(e, star)}
                disabled={hasRated}
                className={`transition-all duration-300 ${!hasRated ? 'hover:scale-110 active:scale-125' : 'cursor-default'}`}
              >
                <Icons.Star 
                  className={`${starSizes[size]} transition-all duration-300 ${
                    isHighlighted 
                      ? isUserRated 
                        ? 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]' 
                        : 'text-amber-500/80' 
                      : 'text-neutral-800'
                  }`} 
                />
              </button>
            );
          })}
        </div>
        {showLabel && (
          <div className="flex items-center gap-1.5 ml-1">
            <span className={`font-serif font-bold transition-colors ${size === 'lg' ? 'text-2xl' : 'text-xs'} ${hasRated ? 'text-amber-400' : 'text-amber-500/60'}`}>
              {hasRated ? userSpecificRating.toFixed(1) : (film.score ? film.score.toFixed(1) : 'NR')}
            </span>
            {hasRated && size !== 'lg' && (
              <span className="text-[8px] text-neutral-600 font-bold uppercase tracking-tighter animate-in fade-in slide-in-from-left-1">
                (My Score)
              </span>
            )}
          </div>
        )}
      </div>
      {hasRated && size === 'lg' && (
        <p className="text-[10px] text-amber-500/50 font-serif italic animate-in fade-in slide-in-from-bottom-2">
          "Rating archived in the festival records."
        </p>
      )}
    </div>
  );
};

export default StarRating;
