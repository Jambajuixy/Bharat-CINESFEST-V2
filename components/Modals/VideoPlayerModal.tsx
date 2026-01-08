
import React, { useState, useEffect, useRef, useMemo } from 'react';
import BaseModal from './BaseModal';
import { Film, FilmCategory } from '../../types';
import { Icons } from '../../constants';
import { GoogleGenAI } from "@google/genai";
import { useAppContext } from '../../store/AppContext';
import StarRating from '../StarRating';

interface GroundingSource {
  title: string;
  uri: string;
}

interface VideoPlayerModalProps {
  film: Film | null;
  isOpen: boolean;
  onClose: () => void;
}

const APPLAUSE_SOUND_URL = 'https://www.soundjay.com/human/sounds/applause-01.mp3';

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ film, isOpen, onClose }) => {
  const { addComment, submitVote, user, login, knownUsers } = useAppContext();
  const [aiReview, setAiReview] = useState<string | null>(null);
  const [groundingSources, setGroundingSources] = useState<GroundingSource[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isTheatricalMode, setIsTheatricalMode] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  
  const [hasApplauded, setHasApplauded] = useState(false);
  const [hasOvated, setHasOvated] = useState(false);

  // Pre-load audio for instant feedback
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Find uploader info
  const creator = useMemo(() => {
    if (!film) return null;
    return knownUsers.find(u => u.id === film.creatorId) || null;
  }, [film, knownUsers]);

  useEffect(() => {
    const audio = new Audio(APPLAUSE_SOUND_URL);
    audio.preload = 'auto';
    audio.volume = 0.8;
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (film) {
      setHasApplauded(false);
      setHasOvated(false);
      setAiReview(null);
      setGroundingSources([]);
      setIsTheatricalMode(false);
    }
  }, [film?.id]);

  if (!film) return null;

  const getYouTubeID = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeID(film.youtubeUrl);
  const shareUrl = `${window.location.origin}${window.location.pathname}#/film/${film.id}`;
  const shareText = `Watching "${film.title}" at Bharat CINEFEST. Pure cinematic magic! #BharatCINEFEST #IndieFilm`;

  const handleShareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const handleShareToFB = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: film.title,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error("Native share failed:", err);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2000);
  };

  const handleGetAiReview = async () => {
    setIsGenerating(true);
    setGroundingSources([]);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Act as an elite film festival curator and cinematic professor. Analyze the narrative structure and atmospheric resonance of this work:
      
      TITLE: ${film.title}
      DESCRIPTION: ${film.description}
      GENRE: ${film.genre}
      CINEMATIC STYLE: ${film.isAiGenerated ? 'Neural Expressionism (AI)' : 'Organic Human Narrative'}

      TASK:
      1. Provide a sophisticated, 3-sentence expert critique focused on narrative arc and thematic weight.
      2. USE GOOGLE SEARCH to research current 2024-2025 cinematic trends from major festivals to compare this work's potential.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          thinkingConfig: { thinkingBudget: 500 }
        }
      });

      setAiReview(response.text || "The jury is currently in silent contemplation.");
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        setGroundingSources(chunks.filter(chunk => chunk.web).map(chunk => ({ title: chunk.web.title, uri: chunk.web.uri })).slice(0, 3));
      }
    } catch (error) {
      console.error("Gemini AI Review Error:", error);
      setAiReview("The Visionary AI engine is currently refining its perception.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { login(); return; }
    if (!commentText.trim()) return;
    addComment(film.id, commentText);
    setCommentText('');
  };

  const handleInteraction = (type: 'applause' | 'ovation', amount: number) => {
    if (!user) { login(); return; }
    
    // Immediate realtime play
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => {});
    }

    submitVote(film.id, amount);
    if (type === 'applause') setHasApplauded(true);
    if (type === 'ovation') setHasOvated(true);
  };

  const goToCreatorProfile = () => {
    if (creator) {
      window.location.hash = `#/profile/${creator.id}`;
      onClose();
    }
  };

  const isPremiere = film.category === FilmCategory.PREMIERE;

  return (
    <div className="video-player-modal-wrapper">
      <BaseModal isOpen={isOpen} onClose={onClose} title={film.title}>
        <div className={`flex flex-col gap-6 max-w-4xl mx-auto transition-all duration-700 ${isTheatricalMode ? 'opacity-100' : ''}`}>
          
          <div className={`aspect-video w-full rounded-2xl overflow-hidden bg-black border border-neutral-800 shadow-2xl relative group transition-all duration-1000 ${isTheatricalMode ? 'ring-4 ring-amber-500/20' : ''}`}>
            {videoId ? (
              <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`} title={film.title} frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen onLoad={() => setIsTheatricalMode(true)}></iframe>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-neutral-700 font-serif italic text-center p-12">
                <Icons.Film className="w-12 h-12 mb-4 opacity-10" />
                <p className="text-sm">Projection unavailable.</p>
              </div>
            )}
            <button onClick={() => setIsTheatricalMode(!isTheatricalMode)} className="absolute bottom-4 right-4 p-2 bg-black/60 backdrop-blur-md rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></button>
          </div>

          {/* Creator Attribution Bar */}
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 transition-all hover:border-amber-500/20">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-neutral-800 border border-neutral-700 overflow-hidden gold-glow shadow-lg">
                  <img 
                    src={creator?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${creator?.id || 'anon'}`} 
                    alt="Uploader" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                   <div className="text-[8px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-0.5">Visionary Curator</div>
                   <h4 className="text-sm font-serif font-bold text-white">{creator?.name || "Unknown Creator"}</h4>
                   <p className="text-[9px] text-amber-500/70 font-bold uppercase tracking-widest">{creator?.role || "Indie Filmmaker"}</p>
                </div>
             </div>
             <button 
               onClick={goToCreatorProfile}
               className="px-6 py-2.5 bg-neutral-800 hover:bg-amber-500 hover:text-black border border-neutral-700 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all group flex items-center gap-2"
             >
                Visit Profile
                <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
             </button>
          </div>
          
          <div className={`space-y-6 transition-opacity duration-700 ${isTheatricalMode ? 'opacity-30 hover:opacity-100' : 'opacity-100'}`}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h2 className="text-2xl font-serif font-bold gold-text leading-tight">{film.title}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] text-amber-500 uppercase tracking-widest font-bold">{film.genre} • {film.category}</span>
                  <div className="relative">
                    <button onClick={handleCopyLink} className="flex items-center gap-1.5 text-[9px] text-neutral-500 hover:text-amber-500 uppercase font-bold tracking-widest transition-colors">
                      <Icons.Share className="w-3 h-3" />
                      {showShareToast ? 'Link Copied!' : 'Copy Link'}
                    </button>
                  </div>
                </div>
              </div>
              <div className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-center shadow-lg">
                <div className="text-xl font-serif font-bold text-white">{film.score && film.score > 0 ? film.score.toFixed(1) : 'NR'}</div>
                <div className="text-[8px] text-neutral-500 uppercase font-bold tracking-tighter">Artistic Score</div>
              </div>
            </div>

            <StarRating film={film} size="lg" />

            {/* Social Sharing Hub */}
            <div className="bg-white/[0.02] border border-neutral-800/40 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
               <div>
                  <span className="text-[8px] font-bold text-neutral-600 uppercase tracking-[0.3em] block mb-1">Spread the Vision</span>
                  <p className="text-[10px] text-neutral-500 italic">Broadcast this cinematic journey to your circle.</p>
               </div>
               <div className="flex items-center gap-3">
                  <button onClick={handleShareToTwitter} className="w-10 h-10 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 active:scale-90 shadow-xl group" title="Share on X">
                    <Icons.Twitter className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
                  </button>
                  <button onClick={handleShareToFB} className="w-10 h-10 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 active:scale-90 shadow-xl group" title="Share on Facebook">
                    <Icons.Facebook className="w-4 h-4 text-neutral-500 group-hover:text-blue-500 transition-colors" />
                  </button>
                  <button onClick={handleNativeShare} className="px-6 py-2.5 bg-red-carpet gold-glow rounded-full text-white text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl">
                    <Icons.Link className="w-3.5 h-3.5" />
                    Share Hub
                  </button>
               </div>
            </div>

            {isPremiere && (
              <div className="flex items-center gap-4 bg-amber-500/5 border border-amber-500/10 p-4 rounded-2xl">
                <div className="flex-1"><span className="text-[8px] font-bold text-amber-500 uppercase tracking-widest block mb-1">Audience Reaction</span></div>
                <div className="flex gap-2">
                  <button onClick={() => handleInteraction('applause', 1)} disabled={hasApplauded} className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${hasApplauded ? 'bg-neutral-800 text-neutral-600 grayscale' : 'bg-neutral-800 hover:bg-neutral-700 hover:scale-105'}`}><Icons.Applause className={`w-5 h-5 ${hasApplauded ? 'text-neutral-600' : 'text-amber-500'}`} /><span className="text-[8px] font-bold uppercase">{hasApplauded ? 'Applauded' : 'Applause'}</span></button>
                  <button onClick={() => handleInteraction('ovation', 5)} disabled={hasOvated} className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${hasOvated ? 'bg-neutral-800 text-neutral-600 grayscale' : 'bg-red-carpet gold-glow hover:scale-105'}`}><Icons.StandingOvation className={`w-5 h-5 ${hasOvated ? 'text-neutral-600' : 'text-white'}`} /><span className="text-[8px] font-bold uppercase">{hasOvated ? 'Stood Up' : 'Standing Ovation'}</span></button>
                </div>
              </div>
            )}

            <p className="text-neutral-400 text-sm leading-relaxed font-serif italic border-l-2 border-amber-500/20 pl-4 bg-white/[0.01] py-3 rounded-r-xl">{film.description}</p>

            <div className="bg-black/60 border border-amber-500/10 rounded-2xl p-5 relative overflow-hidden group shadow-inner">
              <div className="flex items-center justify-between mb-4 relative z-10">
                 <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div><span className="text-[9px] font-bold text-amber-500 uppercase tracking-[0.3em]">Visionary AI Critique</span></div>
                 {!aiReview && !isGenerating && (<button onClick={handleGetAiReview} className="px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full text-[8px] font-bold text-amber-500 uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all">Summon AI Critic</button>)}
              </div>
              {isGenerating ? (<div className="flex items-center gap-3 py-2 animate-pulse"><div className="w-3 h-3 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div><span className="text-[10px] text-neutral-500 font-serif italic">Synthesizing narrative depth...</span></div>) : aiReview ? (<div className="animate-in fade-in slide-in-from-bottom-2"><p className="text-xs text-neutral-300 font-serif italic leading-relaxed">"{aiReview}"</p></div>) : (<p className="text-[9px] text-neutral-600 italic">Access deep narrative insights powered by Gemini 3.</p>)}
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2"><svg className="w-4 h-4 text-amber-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>Public Commentary</h3>
              <form onSubmit={handlePostComment} className="flex gap-2"><input value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Join the discussion..." className="flex-grow bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white focus:border-amber-500 outline-none transition-all" /><button type="submit" className="px-4 py-2 bg-neutral-700 hover:bg-amber-500 hover:text-black rounded-xl text-[9px] font-bold uppercase transition-all">Post</button></form>
              <div className="space-y-3 max-h-60 overflow-y-auto thin-scrollbar pr-2">{film.comments && film.comments.length > 0 ? film.comments.map(comment => (<div key={comment.id} className="p-3 bg-white/[0.02] border border-neutral-800/40 rounded-xl"><div className="flex justify-between items-center mb-1"><span className="text-[9px] font-bold text-amber-500/80 uppercase tracking-widest">{comment.userName}</span><span className="text-[8px] text-neutral-600">{new Date(comment.date).toLocaleDateString()}</span></div><p className="text-[11px] text-neutral-400 leading-relaxed">{comment.text}</p></div>)) : (<p className="text-[9px] text-neutral-600 italic py-4 text-center">No commentary yet.</p>)}</div>
            </div>
          </div>
        </div>
      </BaseModal>
    </div>
  );
};

export default VideoPlayerModal;
