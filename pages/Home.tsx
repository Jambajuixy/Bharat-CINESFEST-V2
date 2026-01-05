
import React, { useState, useMemo } from 'react';
import Hero from '../components/Hero';
import FeaturedDirectors from '../components/FeaturedDirectors';
import { useAppContext } from '../store/AppContext';
import { Icons } from '../constants';
import { Film, FilmCategory } from '../types';
import VideoPlayerModal from '../components/Modals/VideoPlayerModal';

const StarRating: React.FC<{ film: Film }> = ({ film }) => {
  const { addRating, user, login } = useAppContext();
  const [hover, setHover] = useState(0);

  const handleRate = (e: React.MouseEvent, rating: number) => {
    e.stopPropagation();
    if (!user) { login(); return; }
    addRating(film.id, rating);
  };

  return (
    <div className="flex items-center gap-1 py-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={(e) => handleRate(e, star)}
          className="transition-transform hover:scale-110 active:scale-125"
        >
          <Icons.Star 
            className={`w-3.5 h-3.5 ${
              (hover || (film.score || 0)) >= star ? 'text-amber-500' : 'text-neutral-800'
            }`} 
          />
        </button>
      ))}
      <span className="text-[10px] font-bold text-amber-500 ml-1">
        {film.score ? film.score.toFixed(1) : 'NR'}
      </span>
    </div>
  );
};

const FilmCard: React.FC<{ film: Film; onPlay: (film: Film) => void }> = ({ film, onPlay }) => {
  const { submitVote, user, login, votedFilmIds } = useAppContext();
  const hasVoted = votedFilmIds.includes(film.id);

  const handleVote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) { login(); return; }
    if (hasVoted) return;
    submitVote(film.id);
  };

  return (
    <div 
      onClick={() => onPlay(film)}
      className="group relative bg-neutral-900/40 border border-neutral-800/60 rounded-xl overflow-hidden hover:border-amber-500/30 transition-all duration-500 shadow-lg flex flex-col h-full cursor-pointer"
    >
      <div className="aspect-video relative overflow-hidden flex-shrink-0">
        <img src={film.thumbnailUrl} alt={film.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
           <div className="w-12 h-12 bg-red-carpet gold-glow rounded-full flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
             <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
           </div>
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-2">
          <span className="text-[8px] font-bold text-amber-500/60 uppercase tracking-[0.2em]">{film.category} {film.isAiGenerated && '• AI'}</span>
          <h3 className="text-base font-serif font-bold mt-0.5 group-hover:text-amber-500 transition-colors">{film.title}</h3>
        </div>
        
        <p className="text-neutral-500 text-[10px] leading-relaxed line-clamp-2 mb-3">{film.description}</p>
        <StarRating film={film} />

        <div className="mt-auto pt-3 border-t border-neutral-800/40 space-y-3">
          <button 
            onClick={handleVote}
            disabled={hasVoted}
            className={`w-full py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${
              hasVoted ? 'bg-neutral-800 text-neutral-500' : 'bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-black'
            }`}
          >
            {hasVoted ? 'Vote Recorded' : 'Cast Your Vote'}
          </button>
          <div className="flex justify-between items-center text-[9px] font-bold text-neutral-600 uppercase tracking-widest">
             <span>{film.votes} Recognition Points</span>
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

  return (
    <div className="pb-16 bg-[#050505]">
      <Hero activeHall={activeHall} onHallSwitch={setActiveHall} />
      <FeaturedDirectors onPlayInterview={setPlayingFilm} />

      <div id="library-content" className="sticky top-14 z-30 w-full px-6 py-6 flex flex-col items-center gap-5 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex flex-wrap items-center justify-center gap-3 p-1.5 bg-neutral-900/60 border border-neutral-800 rounded-full shadow-2xl">
          {(['all', 'gallery', 'premieres', 'contests'] as const).map((cat) => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)} 
              className={`px-8 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                activeCategory === cat ? 'bg-amber-500 text-black' : 'text-neutral-500 hover:text-white'
              }`}
            >
              {cat}
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

      <div className="max-w-7xl mx-auto px-6 py-12">
        {filteredFilms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFilms.map(f => <FilmCard key={f.id} film={f} onPlay={setPlayingFilm} />)}
          </div>
        ) : (
          <div className="py-24 text-center border border-dashed border-neutral-800 rounded-[2.5rem]">
            <h3 className="text-2xl font-serif font-bold text-neutral-600 mb-2">Curtain Closed</h3>
            <p className="text-neutral-700 text-xs font-bold uppercase tracking-widest">No matching films found in this hall.</p>
          </div>
        )}
      </div>

      <VideoPlayerModal film={playingFilm} isOpen={!!playingFilm} onClose={() => setPlayingFilm(null)} />
    </div>
  );
};

export default Home;
