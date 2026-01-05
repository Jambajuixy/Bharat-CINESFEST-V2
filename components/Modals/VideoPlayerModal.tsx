
import React, { useState } from 'react';
import BaseModal from './BaseModal';
import { Film } from '../../types';
import { Icons } from '../../constants';
import { GoogleGenAI } from "@google/genai";

interface GroundingSource {
  title: string;
  uri: string;
}

interface VideoPlayerModalProps {
  film: Film | null;
  isOpen: boolean;
  onClose: () => void;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ film, isOpen, onClose }) => {
  const [aiReview, setAiReview] = useState<string | null>(null);
  const [groundingSources, setGroundingSources] = useState<GroundingSource[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!film) return null;

  const getYouTubeID = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeID(film.youtubeUrl);

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
      1. Provide a 3-sentence expert critique focused on narrative arc and thematic weight.
      2. USE GOOGLE SEARCH to research current 2024-2025 cinematic trends from major festivals (Cannes, Sundance, TIFF) to compare this work's potential against industry movements.
      3. Maintain a sophisticated, director-focused tone.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      setAiReview(response.text || "The jury is currently in silent contemplation. Please check back shortly.");

      // Extract Grounding Chunks to provide transparency on Industry Trends
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        const sources: GroundingSource[] = chunks
          .filter(chunk => chunk.web)
          .map(chunk => ({
            title: chunk.web.title,
            uri: chunk.web.uri
          }));
        // Deduplicate and set
        const uniqueSources = Array.from(new Set(sources.map(s => s.uri)))
          .map(uri => sources.find(s => s.uri === uri)!)
          .slice(0, 3);
        setGroundingSources(uniqueSources);
      }
    } catch (error) {
      console.error("Gemini AI Review Error:", error);
      setAiReview("The Visionary AI engine is currently offline for maintenance. Please enjoy the screening.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={() => { setAiReview(null); setGroundingSources([]); onClose(); }} title={film.title}>
      <div className="flex flex-col gap-6">
        <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-neutral-800 shadow-2xl relative group">
          {videoId ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&controls=1&enablejsapi=1`}
              title={film.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-neutral-700 font-serif italic text-center p-12">
              <Icons.Film className="w-12 h-12 mb-4 opacity-10" />
              <p className="text-sm">Projection unavailable. Please verify the YouTube source link.</p>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-serif font-bold gold-text leading-tight">{film.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-amber-500 uppercase tracking-widest font-bold">
                  {film.genre} • {film.category}
                </span>
                <span className="text-[8px] text-neutral-600 font-mono">BC-ID: {film.id}</span>
              </div>
            </div>
            <div className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-center shadow-lg">
              <div className="text-xl font-serif font-bold text-white">{film.score && film.score > 0 ? film.score.toFixed(1) : 'NR'}</div>
              <div className="text-[8px] text-neutral-500 uppercase font-bold tracking-tighter">Artistic Score</div>
            </div>
          </div>

          <p className="text-neutral-400 text-sm leading-relaxed font-serif italic border-l-2 border-amber-500/20 pl-4 bg-white/[0.01] py-3 rounded-r-xl">
            {film.description}
          </p>

          {/* UPGRADED VISIONARY AI CRITIQUE */}
          <div className="bg-black/60 border border-amber-500/10 rounded-2xl p-5 relative overflow-hidden group shadow-inner">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl group-hover:bg-amber-500/10 transition-colors"></div>
            
            <div className="flex items-center justify-between mb-4 relative z-10">
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                  <span className="text-[9px] font-bold text-amber-500 uppercase tracking-[0.3em]">Visionary AI Critique</span>
               </div>
               {!aiReview && !isGenerating && (
                 <button 
                  onClick={handleGetAiReview}
                  className="px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full text-[8px] font-bold text-amber-500 uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all shadow-md active:scale-95"
                 >
                   Summon AI Critic
                 </button>
               )}
            </div>

            {isGenerating ? (
              <div className="flex items-center gap-3 py-2 animate-pulse">
                <div className="w-3 h-3 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
                <span className="text-[10px] text-neutral-500 font-serif italic">Researching industry trends and analyzing narrative arcs...</span>
              </div>
            ) : aiReview ? (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
                <p className="text-xs text-neutral-300 font-serif italic leading-relaxed">
                  "{aiReview}"
                </p>
                
                {groundingSources.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-neutral-800/40">
                    <p className="text-[8px] text-neutral-600 font-bold uppercase tracking-widest mb-3">Industry Grounding References:</p>
                    <div className="flex flex-wrap gap-2">
                      {groundingSources.map((source, idx) => (
                        <a 
                          key={idx} 
                          href={source.uri} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="px-3 py-1 bg-amber-500/5 border border-amber-500/10 rounded-full text-[9px] text-amber-500/80 hover:bg-amber-500 hover:text-black transition-all truncate max-w-[200px]"
                        >
                          {source.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 text-[7px] text-neutral-700 font-bold uppercase tracking-widest text-right">
                  Powered by Gemini 3 Flash with Search Grounding
                </div>
              </div>
            ) : (
              <p className="text-[9px] text-neutral-600 italic">Gain deep narrative and industry insights on this work from our AI Visionary engine.</p>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-neutral-800/40">
             <div className="flex items-center gap-2">
               <div className="w-7 h-7 rounded-full bg-red-carpet border border-amber-500/10 flex items-center justify-center text-[9px] font-bold text-white shadow-md">BC</div>
               <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-bold">Creator Hash: {film.creatorId}</span>
             </div>
             <span className="text-[9px] text-neutral-600 font-mono opacity-60">Archive Date: {new Date(film.uploadDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default VideoPlayerModal;
