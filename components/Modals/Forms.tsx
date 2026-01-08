
import React, { useState, useMemo, useEffect } from 'react';
import TermsSection from './TermsSection';
import { useAppContext } from '../../store/AppContext';
import { UserRole, FilmCategory, User } from '../../types';

interface FormProps {
  onSuccess: () => void;
}

const GENRES = ['Drama', 'Sci-Fi', 'Noir', 'Documentary', 'Action', 'Horror', 'Animation', 'Abstract', 'Experimental'];

const YT_REGEX = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;

const isValidYT = (url: string) => {
  const match = url.match(YT_REGEX);
  return match && match[2].length === 11;
};

const getThumbnailUrl = (url: string) => {
  const match = url.match(YT_REGEX);
  if (match && match[2].length === 11) {
    return `https://img.youtube.com/vi/${match[2]}/maxresdefault.jpg`;
  }
  return 'https://images.unsplash.com/photo-1485846234645-a62644ef7467?auto=format&fit=crop&q=80&w=1200';
};

const MovieTypeToggle: React.FC<{ isAi: boolean, onChange: (val: boolean) => void }> = ({ isAi, onChange }) => (
  <div className="flex p-1 bg-neutral-800 rounded-xl border border-neutral-700">
    <button
      type="button"
      onClick={() => onChange(false)}
      className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${!isAi ? 'bg-amber-500 text-black shadow-lg' : 'text-neutral-500 hover:text-neutral-300'}`}
    >
      Human Hall
    </button>
    <button
      type="button"
      onClick={() => onChange(true)}
      className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${isAi ? 'bg-white text-black shadow-lg' : 'text-neutral-500 hover:text-neutral-300'}`}
    >
      AI Hall
    </button>
  </div>
);

export const FilmFestivalEntryForm: React.FC<FormProps> = ({ onSuccess }) => {
  const { addFilm, user } = useAppContext();
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    youtubeUrl: '', 
    isAiGenerated: false,
    genre: GENRES[0]
  });
  const [agreed, setAgreed] = useState(false);
  const [paying, setPaying] = useState(false);
  const [ytError, setYtError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    if (!isValidYT(formData.youtubeUrl)) {
      setYtError(true);
      return;
    }
    setPaying(true);
    setTimeout(() => {
      addFilm({
        ...formData,
        thumbnailUrl: getThumbnailUrl(formData.youtubeUrl),
        creatorId: user?.id || 'anonymous',
        category: FilmCategory.SELECTION
      });
      onSuccess();
    }, 2000);
  };

  if (paying) return (
    <div className="text-center py-12">
      <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-amber-400 font-serif text-lg">Securely Processing Festival Entry...</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-xs text-neutral-400 mb-4 bg-amber-500/5 p-3 rounded border border-amber-500/10 italic">
        General submission for the Cinematic Gala main gallery. Reach thousands of daily viewers.
      </p>

      <div className="space-y-1">
        <label className="block text-[10px] font-bold text-amber-500 uppercase tracking-widest ml-1">Screening Hall</label>
        <MovieTypeToggle isAi={formData.isAiGenerated} onChange={(val) => setFormData({...formData, isAiGenerated: val})} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1 ml-1">Film Title</label>
          <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white focus:border-amber-500 outline-none transition-colors" placeholder="e.g. Midnight Serenade" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1 ml-1">Genre</label>
          <select 
            value={formData.genre} 
            onChange={e => setFormData({...formData, genre: e.target.value})}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white focus:border-amber-500 outline-none appearance-none cursor-pointer"
          >
            {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1 ml-1">Description</label>
        <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white focus:border-amber-500 outline-none h-20 transition-colors resize-none" placeholder="Tell us about your masterpiece..." />
      </div>

      <div>
        <label className="block text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1 ml-1">YouTube Link</label>
        <input 
          required 
          type="url" 
          value={formData.youtubeUrl} 
          onChange={e => {
            setFormData({...formData, youtubeUrl: e.target.value});
            setYtError(false);
          }} 
          className={`w-full bg-neutral-800 border rounded-xl px-4 py-2 text-xs text-white focus:border-amber-500 outline-none transition-colors ${ytError ? 'border-red-500' : 'border-neutral-700'}`} 
          placeholder="https://youtube.com/..." 
        />
        {ytError && <p className="text-[8px] text-red-500 mt-1 ml-1 font-bold uppercase tracking-widest">Invalid YouTube URL</p>}
        <p className="text-[8px] text-neutral-500 mt-1.5 ml-1 italic">Thumbnail will be generated automatically from the video.</p>
      </div>

      <TermsSection onAgree={setAgreed} />
      <button 
        type="submit"
        disabled={!agreed}
        className={`w-full py-4 rounded-full font-bold uppercase tracking-widest transition-all ${agreed ? 'bg-red-carpet gold-glow hover:scale-[1.02] text-white shadow-xl' : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'}`}
      >
        Pay Entry Fee (₹1,200) & Submit
      </button>
    </form>
  );
};

export const CompetitionEntryForm: React.FC<FormProps> = ({ onSuccess }) => {
  const { user, films, competitions, addFilm, knownUsers } = useAppContext();
  // Always focus on the first (most relevant/featured) competition
  const featuredComp = competitions[0];
  
  const [selectedFilmId, setSelectedFilmId] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    youtubeUrl: '',
    isAiGenerated: false,
    genre: GENRES[0]
  });
  const [selectedGenreFilter, setSelectedGenreFilter] = useState('All Genres');
  const [agreed, setAgreed] = useState(false);
  const [paying, setPaying] = useState(false);
  const [ytError, setYtError] = useState(false);

  // Map jury IDs to User objects
  const juryMembers = useMemo(() => {
    if (!featuredComp || !featuredComp.juryIds) return [];
    return featuredComp.juryIds.map(id => knownUsers.find(u => u.id === id)).filter(Boolean) as User[];
  }, [featuredComp, knownUsers]);

  const filteredFilms = useMemo(() => {
    let list = films.filter(f => f.creatorId === user?.id && (f.isAiGenerated === formData.isAiGenerated));
    if (selectedGenreFilter !== 'All Genres') list = list.filter(f => f.genre === selectedGenreFilter);
    return list;
  }, [films, user, formData.isAiGenerated, selectedGenreFilter]);

  useEffect(() => {
    if (selectedFilmId) {
      const film = films.find(f => f.id === selectedFilmId);
      if (film) {
        setFormData({
          title: film.title,
          description: film.description,
          youtubeUrl: film.youtubeUrl,
          isAiGenerated: film.isAiGenerated || false,
          genre: film.genre
        });
        setYtError(false);
      }
    }
  }, [selectedFilmId, films]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed || !featuredComp) return;
    if (!isValidYT(formData.youtubeUrl)) {
      setYtError(true);
      return;
    }
    setPaying(true);
    setTimeout(() => {
      addFilm({
        ...formData,
        thumbnailUrl: getThumbnailUrl(formData.youtubeUrl),
        creatorId: user?.id || 'anonymous',
        category: FilmCategory.CONTEST,
        isContestActive: true
      });
      onSuccess();
    }, 2000);
  };

  const goToProfile = (userId: string) => {
     window.location.hash = `#/profile/${userId}`;
  };

  if (!featuredComp) return <div className="text-center py-12 text-neutral-500">No active competitions found.</div>;

  if (paying) return (
    <div className="text-center py-12">
      <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-amber-400 font-serif text-lg">Submitting Entry to Jury...</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Featured Competition Highlight */}
      <div className="p-5 bg-red-carpet/10 border border-amber-500/20 rounded-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-2xl group-hover:bg-amber-500/10 transition-colors"></div>
         <div className="flex justify-between items-start mb-2">
            <span className="text-[8px] font-bold text-amber-500 uppercase tracking-[0.3em]">Featured Competition</span>
            <span className="px-2 py-0.5 bg-amber-500 text-black text-[7px] font-bold rounded uppercase">Active</span>
         </div>
         <h3 className="text-lg font-serif font-bold text-white mb-1">{featuredComp.name}</h3>
         <p className="text-[10px] text-neutral-400 leading-relaxed italic mb-3">"{featuredComp.description}"</p>
         
         {/* Meet the Jury Spotlight */}
         {juryMembers.length > 0 && (
           <div className="mb-4 pt-3 border-t border-white/5">
              <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest block mb-2">Meet the Jury</span>
              <div className="flex flex-wrap gap-2">
                {juryMembers.map(jury => (
                  <button 
                    key={jury.id}
                    type="button"
                    onClick={() => goToProfile(jury.id)}
                    className="flex items-center gap-2 p-1 bg-black/40 border border-neutral-800 rounded-full hover:border-amber-500/50 transition-all group/jury"
                  >
                    <img src={jury.avatarUrl} className="w-6 h-6 rounded-full object-cover grayscale group-hover/jury:grayscale-0 transition-all" alt={jury.name} />
                    <span className="text-[9px] font-bold text-neutral-400 pr-2 group-hover/jury:text-white">{jury.name}</span>
                  </button>
                ))}
              </div>
           </div>
         )}

         <div className="flex justify-between items-center py-2 border-t border-white/5">
            <div className="flex flex-col">
               <span className="text-[7px] text-neutral-500 font-bold uppercase tracking-tighter">Reward Pool</span>
               <span className="text-xs font-bold text-amber-400">{featuredComp.prize}</span>
            </div>
            <div className="flex flex-col items-end">
               <span className="text-[7px] text-neutral-500 font-bold uppercase tracking-tighter">Entry Fee</span>
               <span className="text-xs font-bold text-white">₹{featuredComp.entryFee}</span>
            </div>
         </div>
      </div>

      <div className="space-y-4 p-4 bg-black/40 border border-neutral-800 rounded-2xl">
        <div className="flex justify-between items-center mb-1">
          <label className="block text-[9px] font-bold text-amber-500 uppercase tracking-widest ml-1">Quick Select From Library (Optional)</label>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[8px] font-bold text-neutral-500 uppercase tracking-widest mb-1 ml-1">Filter Genre</label>
            <select 
              value={selectedGenreFilter} 
              onChange={e => setSelectedGenreFilter(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-[10px] text-white outline-none cursor-pointer focus:border-amber-500/50"
            >
              <option>All Genres</option>
              {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[8px] font-bold text-neutral-500 uppercase tracking-widest mb-1 ml-1">Existing Film</label>
            <select 
              value={selectedFilmId} 
              onChange={e => setSelectedFilmId(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-[10px] text-white outline-none cursor-pointer focus:border-amber-500/50"
            >
              <option value="">New Submission / Manual Entry</option>
              {filteredFilms.map(f => <option key={f.id} value={f.id}>{f.title}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-amber-500 uppercase tracking-widest ml-1">Competition Hall</label>
          <MovieTypeToggle isAi={formData.isAiGenerated} onChange={(val) => setFormData({...formData, isAiGenerated: val})} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1 ml-1">Contest Film Title</label>
            <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white focus:border-amber-500 outline-none transition-colors" placeholder="e.g. Neon Horizon" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1 ml-1">Genre</label>
            <select 
              value={formData.genre} 
              onChange={e => setFormData({...formData, genre: e.target.value})}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white focus:border-amber-500 outline-none appearance-none cursor-pointer"
            >
              {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1 ml-1">YouTube Entry Link</label>
          <input 
            required 
            type="url" 
            value={formData.youtubeUrl} 
            onChange={e => {
              setFormData({...formData, youtubeUrl: e.target.value});
              setYtError(false);
            }} 
            className={`w-full bg-neutral-800 border rounded-xl px-4 py-2 text-xs text-white focus:border-amber-500 outline-none transition-colors ${ytError ? 'border-red-500' : 'border-neutral-700'}`} 
            placeholder="https://youtube.com/watch?v=..." 
          />
          {ytError && <p className="text-[8px] text-red-500 mt-1 ml-1 font-bold uppercase tracking-widest">Invalid YouTube URL</p>}
          <p className="text-[8px] text-neutral-500 mt-1.5 ml-1 italic">Thumbnail will be generated automatically from the video.</p>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1 ml-1">Film Description</label>
          <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white focus:border-amber-500 outline-none h-20 transition-colors resize-none" placeholder="Provide details for the jury..." />
        </div>
      </div>
      
      <TermsSection onAgree={setAgreed} />
      
      <button 
        type="submit"
        disabled={!agreed}
        className={`w-full py-4 rounded-full font-bold uppercase tracking-widest transition-all ${agreed ? 'bg-red-carpet gold-glow hover:scale-[1.02] text-white shadow-xl' : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'}`}
      >
        Pay Entry Fee (₹{featuredComp.entryFee}) & Enter
      </button>
    </form>
  );
};

export const PremiereSchedulingForm: React.FC<FormProps> = ({ onSuccess }) => {
  const { films, user, addFilm } = useAppContext();
  const [selectedFilmId, setSelectedFilmId] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    youtubeUrl: '',
    isAiGenerated: false,
    genre: GENRES[0]
  });
  const [selectedGenreFilter, setSelectedGenreFilter] = useState('All Genres');
  const [premiereDate, setPremiereDate] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [paying, setPaying] = useState(false);
  const [ytError, setYtError] = useState(false);

  const filteredFilms = useMemo(() => {
    let list = films.filter(f => f.creatorId === user?.id && (f.isAiGenerated === formData.isAiGenerated));
    if (selectedGenreFilter !== 'All Genres') list = list.filter(f => f.genre === selectedGenreFilter);
    return list;
  }, [films, user, formData.isAiGenerated, selectedGenreFilter]);

  useEffect(() => {
    if (selectedFilmId) {
      const film = films.find(f => f.id === selectedFilmId);
      if (film) {
        setFormData({
          title: film.title,
          description: film.description,
          youtubeUrl: film.youtubeUrl,
          isAiGenerated: film.isAiGenerated || false,
          genre: film.genre
        });
        setYtError(false);
      }
    }
  }, [selectedFilmId, films]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    if (!isValidYT(formData.youtubeUrl)) {
      setYtError(true);
      return;
    }
    setPaying(true);
    setTimeout(() => {
      addFilm({
        ...formData,
        thumbnailUrl: getThumbnailUrl(formData.youtubeUrl),
        creatorId: user?.id || 'anonymous',
        category: FilmCategory.PREMIERE
      });
      onSuccess();
    }, 2000);
  };

  if (paying) return (
    <div className="text-center py-12">
      <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-amber-400 font-serif text-lg">Booking the Grand Premiere...</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4 p-4 bg-black/40 border border-neutral-800 rounded-2xl">
        <div className="space-y-1">
          <label className="block text-[9px] font-bold text-amber-500/70 uppercase tracking-widest ml-1">Quick Select Shortcut (Optional)</label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[9px] font-bold text-amber-500/70 uppercase tracking-widest mb-1 ml-1">Filter Genre</label>
            <select 
              value={selectedGenreFilter} 
              onChange={e => setSelectedGenreFilter(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-[10px] text-white outline-none cursor-pointer"
            >
              <option>All Genres</option>
              {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[9px] font-bold text-amber-500/70 uppercase tracking-widest mb-1 ml-1">Select Existing</label>
            <select 
              value={selectedFilmId} 
              onChange={e => setSelectedFilmId(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-[10px] text-white outline-none cursor-pointer"
            >
              <option value="">New Submission / Manual</option>
              {filteredFilms.map(f => <option key={f.id} value={f.id}>{f.title}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-amber-500 uppercase tracking-widest ml-1">Gala Premiere Hall</label>
          <MovieTypeToggle isAi={formData.isAiGenerated} onChange={(val) => setFormData({...formData, isAiGenerated: val})} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1 ml-1">Premiere Title</label>
            <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white focus:border-amber-500 outline-none transition-colors" placeholder="e.g. The Night Shift" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1 ml-1">Genre</label>
            <select 
              value={formData.genre} 
              onChange={e => setFormData({...formData, genre: e.target.value})}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white focus:border-amber-500 outline-none appearance-none cursor-pointer"
            >
              {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1 ml-1">Full Film / Trailer URL</label>
          <input 
            required 
            type="url" 
            value={formData.youtubeUrl} 
            onChange={e => {
              setFormData({...formData, youtubeUrl: e.target.value});
              setYtError(false);
            }} 
            className={`w-full bg-neutral-800 border rounded-xl px-4 py-2 text-xs text-white focus:border-amber-500 outline-none transition-colors ${ytError ? 'border-red-500' : 'border-neutral-700'}`} 
            placeholder="https://youtube.com/..." 
          />
          {ytError && <p className="text-[8px] text-red-500 mt-1 ml-1 font-bold uppercase tracking-widest">Invalid YouTube URL</p>}
          <p className="text-[8px] text-neutral-500 mt-1.5 ml-1 italic">Thumbnail will be generated automatically from the video.</p>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1 ml-1">Description</label>
          <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white focus:border-amber-500 outline-none h-20 transition-colors resize-none" placeholder="Provide premiere details..." />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1 ml-1">Scheduled Date & Time</label>
          <input required type="datetime-local" value={premiereDate} onChange={e => setPremiereDate(e.target.value)} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 outline-none transition-colors" />
        </div>
      </div>

      <TermsSection onAgree={setAgreed} />
      <button 
        type="submit"
        disabled={!agreed}
        className={`w-full py-4 rounded-full font-bold uppercase tracking-widest transition-all ${agreed ? 'bg-red-carpet gold-glow hover:scale-[1.02] text-white shadow-xl' : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'}`}
      >
        Book Premiere Slot (₹800)
      </button>
    </form>
  );
};
