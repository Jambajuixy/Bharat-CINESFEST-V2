
import React, { useState, useMemo, useEffect } from 'react';
import Hero from '../components/Hero';
import FeaturedDirectors from '../components/FeaturedDirectors';
import { useAppContext } from '../store/AppContext';
import { Icons } from '../constants';
import { Film, FilmCategory } from '../types';
import VideoPlayerModal from '../components/Modals/VideoPlayerModal';
import StarRating from '../components/StarRating';

const FilmCard: React.FC<{ film: Film; onPlay: (film: Film) => void }> = ({ film, onPlay }) => {
  const { submitVote, user, login, votedFilmIds } = useAppContext();
  const [showShareToast, setShowShareToast] = useState(false);
  const hasVoted = votedFilmIds.includes(film.id);

  const handleVote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) { login(); return; }
    if (hasVoted) return;
    submitVote(film.id);
  };

  const handleQuickShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}${window.location.pathname}#/film/${film.id}`;
    navigator.clipboard.writeText(shareUrl);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2000);
  };

  const isContestFilm = film.category === FilmCategory.CONTEST;

  return (
    <div 
      onClick={() => onPlay(film)}
      className={`group relative bg-neutral-900/40 border border-neutral-800/60 rounded-xl overflow-hidden hover:border-amber-500/30 transition-all duration-500 shadow-lg flex flex-col h-full cursor-pointer animate-in fade-in slide-in-from-bottom-4 ${film.isAiGenerated ? 'hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]' : ''}`}
    >
      <div className="aspect-video relative overflow-hidden flex-shrink-0">
        <img src={film.thumbnailUrl} alt={film.title} className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${film.isAiGenerated ? 'contrast-125 saturate-150' : ''}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-50"></div>
        
        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
           <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform ${film.isAiGenerated ? 'bg-white text-black' : 'bg-red-carpet gold-glow'}`}>
             <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
           </div>
        </div>

        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {film.category === FilmCategory.PREMIERE && (
            <div className="px-3 py-1 bg-amber-500 text-black text-[8px] font-bold uppercase tracking-widest rounded-full shadow-lg">
              Gala Premiere
            </div>
          )}
          {isContestFilm && (
            <div className={`px-3 py-1 border text-white text-[8px] font-bold uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1.5 ${film.isAiGenerated ? 'bg-black border-white/20' : 'bg-red-carpet border-amber-500/30'}`}>
              <Icons.Trophy className={`w-2.5 h-2.5 ${film.isAiGenerated ? 'text-white' : 'text-amber-500'}`} />
              Official Entry
            </div>
          )}
        </div>

        {/* Total Average Rating Badge on Thumbnail */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
          <div className="px-3 py-1 bg-black/70 backdrop-blur-md border border-amber-500/40 text-white rounded-lg shadow-2xl flex items-center gap-2 group-hover:border-amber-500 transition-colors">
            <Icons.Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span className="text-xs font-serif font-bold tracking-tight">
              {film.score && film.score > 0 ? film.score.toFixed(1) : 'NR'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-2 flex justify-between items-start">
          <div>
            <span className="text-[8px] font-bold text-amber-500/60 uppercase tracking-[0.2em]">{film.category} {film.isAiGenerated && '• NEURAL'}</span>
            <h3 className={`text-base font-serif font-bold mt-0.5 group-hover:text-amber-500 transition-colors line-clamp-1 ${film.isAiGenerated ? 'tracking-tight' : ''}`}>{film.title}</h3>
          </div>
          <button 
            onClick={handleQuickShare}
            className={`p-2 rounded-full bg-neutral-800/50 border border-neutral-700 transition-all hover:bg-amber-500 hover:text-black hover:scale-110 active:scale-95 relative ${showShareToast ? 'bg-amber-500 text-black' : 'text-neutral-500'}`}
            title="Quick Share Link"
          >
            <Icons.Share className="w-3 h-3" />
            {showShareToast && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-amber-500 text-black text-[7px] font-bold uppercase rounded shadow-xl whitespace-nowrap animate-in fade-in slide-in-from-bottom-1">
                Copied!
              </span>
            )}
          </button>
        </div>
        
        <p className="text-neutral-500 text-[10px] leading-relaxed line-clamp-2 mb-3">{film.description}</p>
        
        <StarRating film={film} size="sm" />

        <div className="mt-auto pt-3 border-t border-neutral-800/40 space-y-3">
          {isContestFilm && (
            <button 
              onClick={handleVote}
              disabled={hasVoted}
              className={`w-full py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${
                hasVoted ? 'bg-neutral-800 text-neutral-500' : 'bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-black'
              }`}
            >
              {hasVoted ? 'Vote Recorded' : 'Cast Your Vote'}
            </button>
          )}
          
          <div className="flex justify-between items-center text-[9px] font-bold text-neutral-600 uppercase tracking-widest">
             <div className="flex items-center gap-1.5">
               <span className="text-amber-500/80">{film.votes}</span>
               <span className="opacity-40">Interactions</span>
             </div>
             <span className="text-amber-500/50">{film.genre}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const { films } = useAppContext();
  const [activeHall, setActiveHall] = useState<'human' | 'ai'>('human');
  const [activeCategory, setActiveCategory] = useState<'all' | 'gallery' | 'premieres' | 'contests'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingFilm, setPlayingFilm] = useState<Film | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsExpanded(false);
  }, [activeHall, activeCategory, searchQuery]);

  const filteredFilms = useMemo(() => {
    let list = films.filter(f => activeHall === 'ai' ? f.isAiGenerated : !f.isAiGenerated);
    
    if (activeCategory !== 'all') {
      const mapping = { gallery: FilmCategory.SELECTION, premieres: FilmCategory.PREMIERE, contests: FilmCategory.CONTEST };
      list = list.filter(f => f.category === mapping[activeCategory as keyof typeof mapping]);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(f => f.title.toLowerCase().includes(q) || f.description.toLowerCase().includes(q) || f.genre.toLowerCase().includes(q));
    }

    return list.sort((a, b) => b.uploadDate.localeCompare(a.uploadDate));
  }, [films, activeHall, activeCategory, searchQuery]);

  const displayedFilms = isExpanded ? filteredFilms : filteredFilms.slice(0, 6);

  return (
    <div className={`pb-16 transition-colors duration-1000 ${activeHall === 'ai' ? 'bg-[#000408]' : 'bg-[#050505]'}`}>
      <Hero activeHall={activeHall} onHallSwitch={setActiveHall} />
      <FeaturedDirectors onPlayInterview={setPlayingFilm} />

      <div id="library-content" className="sticky top-14 z-30 w-full px-6 py-6 flex flex-col items-center gap-5 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex flex-wrap items-center justify-center gap-3 p-1.5 bg-neutral-900/60 border border-neutral-800 rounded-full shadow-2xl">
          {(['all', 'gallery', 'premieres', 'contests'] as const).map((cat) => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)} 
              className={`px-8 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                activeCategory === cat ? 'bg-amber-500 text-black' : 'text-neutral-500 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'View All' : cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 w-full max-w-2xl px-4">
           <div className="relative flex-grow">
             <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral-600">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
             </div>
             <input 
               type="text" 
               placeholder="Search titles, genres, or directors..." 
               value={searchQuery}
               onChange={e => setSearchQuery(e.target.value)}
               className="w-full bg-neutral-900 border border-neutral-800 rounded-full pl-12 pr-6 py-3 text-xs text-white focus:border-amber-500/50 outline-none transition-all placeholder:text-neutral-700"
             />
           </div>
        </div>
      </div>

      <div className={`max-w-7xl mx-auto px-6 py-12 relative transition-all duration-1000 ${activeHall === 'ai' ? 'neural-grid' : ''}`}>
        {activeHall === 'ai' && (
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.05)_0%,transparent_50%)]"></div>
        )}
        
        {displayedFilms.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedFilms.map(f => <FilmCard key={f.id} film={f} onPlay={setPlayingFilm} />)}
            </div>
            
            {!isExpanded && filteredFilms.length > 6 && (
              <div className="flex justify-center mt-16 animate-in fade-in slide-in-from-bottom-2">
                <button 
                  onClick={() => setIsExpanded(true)}
                  className={`group relative flex items-center gap-4 px-12 py-4 rounded-full text-white font-bold uppercase tracking-[0.2em] text-[10px] hover:scale-105 transition-all shadow-2xl ${activeHall === 'ai' ? 'bg-white text-black' : 'bg-red-carpet gold-glow'}`}
                >
                  <Icons.Film className={`w-4 h-4 ${activeHall === 'ai' ? 'text-black' : 'text-amber-500/80'}`} />
                  <span>Explore Full Gallery ({filteredFilms.length} Films)</span>
                  <svg className="w-4 h-4 group-hover:translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-24 text-center border border-dashed border-neutral-800 rounded-[2.5rem]">
            <h3 className="text-2xl font-serif font-bold text-neutral-600 mb-2">Curtain Closed</h3>
            <p className="text-neutral-700 text-xs font-bold uppercase tracking-widest">No matching films found.</p>
          </div>
        )}
      </div>

      <VideoPlayerModal film={playingFilm} isOpen={!!playingFilm} onClose={() => setPlayingFilm(null)} />
    </div>
  );
};

export default Home;
