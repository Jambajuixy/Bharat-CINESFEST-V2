
import React, { useState, useMemo, useEffect } from 'react';
import TermsSection from './TermsSection';
import { useAppContext } from '../../store/AppContext';
import { UserRole, FilmCategory } from '../../types';

interface FormProps {
  onSuccess: () => void;
}

const GENRES = ['Drama', 'Sci-Fi', 'Noir', 'Documentary', 'Action', 'Horror', 'Animation', 'Abstract', 'Experimental'];

const MovieTypeToggle: React.FC<{ isAi: boolean, onChange: (val: boolean) => void }> = ({ isAi, onChange }) => (
  <div className="flex p-1 bg-neutral-800 rounded-xl border border-neutral-700">
    <button
      type="button"
      onClick={() => onChange(false)}
      className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${!isAi ? 'bg-amber-500 text-black shadow-lg' : 'text-neutral-500 hover:text-neutral-300'}`}
    >
      Human Cinema
    </button>
    <button
      type="button"
      onClick={() => onChange(true)}
      className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${isAi ? 'bg-white text-black shadow-lg' : 'text-neutral-500 hover:text-neutral-300'}`}
    >
      AI Cinema
    </button>
  </div>
);

export const FilmFestivalEntryForm: React.FC<FormProps> = ({ onSuccess }) => {
  const { addFilm, user } = useAppContext();
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    youtubeUrl: '', 
    thumbnailUrl: '', 
    isAiGenerated: false,
    genre: GENRES[0]
  });
  const [agreed, setAgreed] = useState(false);
  const [paying, setPaying] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    setPaying(true);
    setTimeout(() => {
      addFilm({
        ...formData,
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
        <label className="block text-[10px] font-bold text-amber-500 uppercase tracking-widest ml-1">Movie Type</label>
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1 ml-1">YouTube Link</label>
          <input required type="url" value={formData.youtubeUrl} onChange={e => setFormData({...formData, youtubeUrl: e.target.value})} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white focus:border-amber-500 outline-none transition-colors" placeholder="https://youtube.com/..." />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1 ml-1">Thumbnail URL</label>
          <input required type="url" value={formData.thumbnailUrl} onChange={e => setFormData({...formData, thumbnailUrl: e.target.value})} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white focus:border-amber-500 outline-none transition-colors" placeholder="https://image.jpg" />
        </div>
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
  const { user, films, competitions, addFilm } = useAppContext();
  const [selectedComp, setSelectedComp] = useState(competitions[0]?.id || '');
  const [selectedFilmId, setSelectedFilmId] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    youtubeUrl: '',
    thumbnailUrl: '',
    isAiGenerated: false,
    genre: GENRES[0]
  });
  const [selectedGenreFilter, setSelectedGenreFilter] = useState('All Genres');
  const [agreed, setAgreed] = useState(false);
  const [paying, setPaying] = useState(false);

  const filteredFilms = useMemo(() => {
    let list = films.filter(f => f.creatorId === user?.id && (f.isAiGenerated === formData.isAiGenerated));
    if (selectedGenreFilter !== 'All Genres') list = list.filter(f => f.genre === selectedGenreFilter);
    return list;
  }, [films, user, formData.isAiGenerated, selectedGenreFilter]);

  // Set initial competition if available
  useEffect(() => {
    if (competitions.length > 0 && !selectedComp) {
      setSelectedComp(competitions[0].id);
    }
  }, [competitions]);

  // Handle film selection to pre-fill
  useEffect(() => {
    if (selectedFilmId) {
      const film = films.find(f => f.id === selectedFilmId);
      if (film) {
        setFormData({
          title: film.title,
          description: film.description,
          youtubeUrl: film.youtubeUrl,
          thumbnailUrl: film.thumbnailUrl,
          isAiGenerated: film.isAiGenerated || false,
          genre: film.genre
        });
      }
    }
  }, [selectedFilmId, films]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    setPaying(true);
    setTimeout(() => {
      addFilm({
        ...formData,
        creatorId: user?.id || 'anonymous',
        category: FilmCategory.CONTEST,
        isContestActive: true
      });
      onSuccess();
    }, 2000);
  };

  const currentComp = competitions.find(c => c.id === selectedComp);

  if (paying) return (
    <div className="text-center py-12">
      <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-amber-400 font-serif text-lg">Submitting Entry to Jury...</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
          <label className="block text-[10px] font-bold text-amber-500 uppercase tracking-widest ml-1">Movie Hall</label>
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
          <input required type="url" value={formData.youtubeUrl} onChange={e => setFormData({...formData, youtubeUrl: e.target.value})} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white focus:border-amber-500 outline-none transition-colors" placeholder="https://youtube.com/watch?v=..." />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1 ml-1">Film Description</label>
          <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white focus:border-amber-500 outline-none h-20 transition-colors resize-none" placeholder="Provide details for the jury..." />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-2 ml-1">Choose Competition</label>
        <div className="grid gap-2">
          {competitions.map(comp => (
            <div 
              key={comp.id}
              onClick={() => setSelectedComp(comp.id)}
              className={`p-3 border rounded-xl cursor-pointer transition-all ${selectedComp === comp.id ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'border-neutral-800 bg-neutral-900/50 hover:border-neutral-700'}`}
            >
              <div className="flex justify-between items-center font-bold">
                <span className={`text-xs ${selectedComp === comp.id ? 'text-amber-400' : 'text-neutral-300'}`}>{comp.name}</span>
                <span className="text-amber-400 text-xs">₹{comp.entryFee}</span>
              </div>
              <p className="text-[9px] text-neutral-500 mt-0.5">{comp.description}</p>
              <div className="text-[9px] text-amber-500/60 mt-1 font-bold uppercase tracking-tight">Reward: {comp.prize}</div>
            </div>
          ))}
          {competitions.length === 0 && <p className="text-[10px] text-neutral-500 italic p-4 text-center">No active competitions.</p>}
        </div>
      </div>
      
      <TermsSection onAgree={setAgreed} />
      
      <button 
        type="submit"
        disabled={!agreed || !selectedComp}
        className={`w-full py-4 rounded-full font-bold uppercase tracking-widest transition-all ${agreed && selectedComp ? 'bg-red-carpet gold-glow hover:scale-[1.02] text-white shadow-xl' : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'}`}
      >
        Pay Entry Fee (₹{currentComp?.entryFee || 0}) & Enter
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
    thumbnailUrl: '',
    isAiGenerated: false,
    genre: GENRES[0]
  });
  const [selectedGenreFilter, setSelectedGenreFilter] = useState('All Genres');
  const [premiereDate, setPremiereDate] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [paying, setPaying] = useState(false);

  const filteredFilms = useMemo(() => {
    let list = films.filter(f => f.creatorId === user?.id && (f.isAiGenerated === formData.isAiGenerated));
    if (selectedGenreFilter !== 'All Genres') list = list.filter(f => f.genre === selectedGenreFilter);
    return list;
  }, [films, user, formData.isAiGenerated, selectedGenreFilter]);

  // Handle film selection to pre-fill
  useEffect(() => {
    if (selectedFilmId) {
      const film = films.find(f => f.id === selectedFilmId);
      if (film) {
        setFormData({
          title: film.title,
          description: film.description,
          youtubeUrl: film.youtubeUrl,
          thumbnailUrl: film.thumbnailUrl,
          isAiGenerated: film.isAiGenerated || false,
          genre: film.genre
        });
      }
    }
  }, [selectedFilmId, films]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    setPaying(true);
    setTimeout(() => {
      addFilm({
        ...formData,
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
          <label className="block text-[10px] font-bold text-amber-500 uppercase tracking-widest ml-1">Hall Preference</label>
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
          <input required type="url" value={formData.youtubeUrl} onChange={e => setFormData({...formData, youtubeUrl: e.target.value})} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white focus:border-amber-500 outline-none transition-colors" placeholder="https://youtube.com/..." />
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
