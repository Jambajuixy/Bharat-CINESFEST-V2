
import React from 'react';
import { Icons } from '../constants';
import { DirectorInterview, Film, FilmCategory } from '../types';
import { useAppContext } from '../store/AppContext';

interface FeaturedDirectorsProps {
  onPlayInterview: (film: Film) => void;
}

const FeaturedDirectors: React.FC<FeaturedDirectorsProps> = ({ onPlayInterview }) => {
  const { interviews } = useAppContext();

  const handleInterviewClick = (interview: DirectorInterview) => {
    // Map interview data to Film type for the VideoPlayerModal
    const interviewAsFilm: Film = {
      id: interview.id,
      creatorId: 'visionary',
      title: `Interview: ${interview.name}`,
      description: `${interview.expertise}. Special interview about the creation of "${interview.filmTitle}".`,
      youtubeUrl: interview.videoUrl,
      thumbnailUrl: interview.portraitUrl,
      uploadDate: new Date().toISOString(),
      category: FilmCategory.PREMIERE,
      genre: 'Masterclass',
      votes: 0,
      ratingCount: 0,
      comments: [],
    };
    onPlayInterview(interviewAsFilm);
  };

  if (!interviews || interviews.length === 0) return null;

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col mb-12">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
            <Icons.Mic className="w-6 h-6 text-amber-500" />
          </div>
          <h2 className="text-4xl font-serif font-bold text-white tracking-tight">The Visionary Spotlight</h2>
        </div>
        <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-[0.4em] ml-12">Exclusive conversations with the masters of cinema</p>
      </div>

      <div className={`grid grid-cols-1 ${interviews.length === 1 ? 'lg:grid-cols-1 max-w-4xl mx-auto' : 'lg:grid-cols-2'} gap-8`}>
        {interviews.map((interview) => (
          <div 
            key={interview.id}
            onClick={() => handleInterviewClick(interview)}
            className="group relative h-[450px] rounded-[2.5rem] overflow-hidden cursor-pointer border border-neutral-800 hover:border-amber-500/40 transition-all duration-700 shadow-2xl"
          >
            {/* Portrait Image */}
            <img 
              src={interview.portraitUrl} 
              alt={interview.name} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 filter grayscale group-hover:grayscale-0 brightness-50 group-hover:brightness-75"
            />

            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent"></div>

            {/* Content Container */}
            <div className="absolute inset-0 p-10 flex flex-col justify-end">
              <div className="mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-[9px] font-bold text-amber-400 uppercase tracking-widest">
                  {interview.expertise}
                </span>
              </div>

              <h3 className="text-4xl font-serif font-bold text-white mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                {interview.name}
              </h3>

              <div className="max-w-md mb-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                <p className="text-lg font-serif italic text-neutral-300 leading-relaxed border-l-2 border-amber-500/30 pl-4">
                  "{interview.quote}"
                </p>
              </div>

              <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                <button className="px-8 py-3 bg-red-carpet gold-glow rounded-full text-white font-bold uppercase tracking-widest text-[10px] flex items-center gap-3">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  Watch Exclusive Interview
                </button>
              </div>
            </div>

            {/* Animated Spotlights */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/5 blur-[80px] rounded-full group-hover:bg-amber-500/10 transition-colors"></div>
          </div>
        ))}
      </div>
      
      {/* Editorial Decorative Rule */}
      <div className="mt-20 w-full h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent"></div>
    </section>
  );
};

export default FeaturedDirectors;
