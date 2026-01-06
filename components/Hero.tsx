
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../store/AppContext';
import BaseModal from './Modals/BaseModal';
import { FilmFestivalEntryForm, CompetitionEntryForm, PremiereSchedulingForm } from './Modals/Forms';
import SuccessView from './Modals/SuccessView';
import ContestBanner from './ContestBanner';

interface HeroProps {
  activeHall: 'human' | 'ai';
  onHallSwitch: (hall: 'human' | 'ai') => void;
}

const PaparazziFlash: React.FC = () => {
  const [flashes, setFlashes] = useState<{ id: number; top: string; left: string; delay: string; size: string }[]>([]);

  useEffect(() => {
    const newFlashes = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      top: `${15 + Math.random() * 65}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 4}s`,
      size: Math.random() > 0.5 ? '100px' : '60px'
    }));
    setFlashes(newFlashes);
  }, []);

  return (
    <>
      {flashes.map((f) => (
        <div
          key={f.id}
          className="flash"
          style={{ 
            top: f.top, 
            left: f.left, 
            animationDelay: f.delay,
            width: f.size,
            height: f.size
          }}
        />
      ))}
    </>
  );
};

const Hero: React.FC<HeroProps> = ({ activeHall, onHallSwitch }) => {
  const { user, login } = useAppContext();
  const [showParticipateModal, setShowParticipateModal] = useState(false);
  const [activeForm, setActiveForm] = useState<'none' | 'festival' | 'competition' | 'premiere'>('none');
  const [showSuccess, setShowSuccess] = useState<'none' | 'festival' | 'competition' | 'premiere'>('none');

  const handleParticipateClick = () => {
    if (!user) {
      login();
      return;
    }
    setShowParticipateModal(true);
  };

  const closeModals = () => {
    setShowParticipateModal(false);
    setActiveForm('none');
    setShowSuccess('none');
  };

  const handleSuccess = (type: 'festival' | 'competition' | 'premiere') => {
    setActiveForm('none');
    setShowSuccess(type);
  };

  const scrollToLibrary = () => {
    const el = document.getElementById('library-content');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Background Layer with User Provided Gala Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://r.jina.ai/i/695d66579998463183574d6c11d4d29a" 
          alt="Bharat CINEFEST Grand Entrance" 
          className="w-full h-full object-cover opacity-30 scale-100 contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70"></div>
        <div className="absolute inset-0 vignette opacity-60"></div>
        <div className="bokeh"></div>
        
        {/* Animated Spotlights */}
        <div className="spotlight left-[-15%] top-[-10%] opacity-20"></div>
        <div className="spotlight right-[-15%] top-[-10%] opacity-20 animation-delay-3000"></div>
        <div className="spotlight left-[40%] top-[-20%] opacity-15 animation-delay-1500" style={{ animationDuration: '15s' }}></div>
        
        {/* Paparazzi Flashes */}
        <PaparazziFlash />
      </div>

      {/* Physical Red Carpet Floor */}
      <div className="absolute bottom-0 left-0 right-0 h-[22vh] z-10 pointer-events-none">
        <div 
          className="mx-auto w-[130%] h-full bg-red-carpet opacity-95 shadow-[0_-20px_100px_rgba(139,0,0,0.7)]"
          style={{ 
            clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
            transform: 'translateX(-11.5%)'
          }}
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/felt.png')] opacity-20"></div>
          <div className="absolute top-0 left-[15%] right-[15%] h-px bg-amber-500/30"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-32 flex justify-between items-end px-6 opacity-40">
           <div className="flex gap-1.5 items-end translate-y-4">
              <div className="w-10 h-24 bg-black rounded-t-full"></div>
              <div className="w-14 h-32 bg-black rounded-t-full shadow-2xl"></div>
              <div className="w-8 h-20 bg-black rounded-t-full"></div>
              <div className="w-12 h-36 bg-black rounded-t-full hidden sm:block"></div>
           </div>
           <div className="flex gap-1.5 items-end translate-y-4">
              <div className="w-12 h-30 bg-black rounded-t-full hidden sm:block"></div>
              <div className="w-9 h-22 bg-black rounded-t-full"></div>
              <div className="w-16 h-38 bg-black rounded-t-full shadow-2xl"></div>
              <div className="w-10 h-26 bg-black rounded-t-full"></div>
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 text-center max-w-4xl px-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 flex flex-col items-center">
        <div className="inline-block px-4 py-1.5 mb-4 border border-amber-500/30 rounded-full bg-amber-500/10 backdrop-blur-md">
           <span className="text-amber-400 font-bold tracking-[0.4em] uppercase text-[10px]">A Night of Extraordinary Visions</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold mb-3 leading-tight tracking-tight text-white drop-shadow-2xl">
          The <span className="gold-text italic">Red Carpet</span> <br className="sm:hidden" /> is Waiting.
        </h1>
        
        <p className="text-[10px] sm:text-sm text-neutral-300 font-light mb-6 max-w-lg mx-auto leading-relaxed drop-shadow-md">
          Step into the exclusive circle of elite independent filmmaking. 
          Your masterpiece deserves the world's most glamorous stage.
        </p>

        {/* Contest Banner placed above the Participate button - reduced margin */}
        <div className="w-full max-w-xl mx-auto mb-6">
          <ContestBanner onAction={(formType) => {
            if (formType) {
              setActiveForm(formType);
            } else {
              setActiveForm('competition');
            }
          }} />
        </div>

        <div className="flex flex-col items-center gap-5">
          <button 
            onClick={handleParticipateClick}
            className="group relative inline-flex items-center gap-3 px-10 py-3.5 bg-red-carpet gold-glow rounded-full text-white font-bold text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(139,0,0,0.3)]"
          >
            <span className="relative z-10">PARTICIPATE</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>

          <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            <button 
              onClick={() => { onHallSwitch('human'); scrollToLibrary(); }}
              className={`px-8 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all border ${
                activeHall === 'human' 
                ? 'bg-amber-500 text-black border-amber-500 gold-glow scale-105' 
                : 'bg-black/40 text-neutral-400 border-neutral-800 hover:border-amber-500/50 hover:text-white'
              }`}
            >
              Human Hall
            </button>
            <div className="w-1 h-1 rounded-full bg-neutral-800"></div>
            <button 
              onClick={() => { onHallSwitch('ai'); scrollToLibrary(); }}
              className={`px-8 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all border ${
                activeHall === 'ai' 
                ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105' 
                : 'bg-black/40 text-neutral-400 border-neutral-800 hover:border-amber-500/50 hover:text-white'
              }`}
            >
              AI Hall
            </button>
          </div>
        </div>
      </div>

      {/* Modal Definitions */}
      <BaseModal 
        isOpen={showParticipateModal && activeForm === 'none' && showSuccess === 'none'} 
        onClose={closeModals} 
        title="Your Grand Entrance"
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <button 
            onClick={() => setActiveForm('festival')}
            className="group flex flex-col items-center p-6 bg-neutral-800/50 border border-neutral-700 rounded-xl hover:border-amber-500 hover:bg-amber-500/5 transition-all text-center"
          >
            <div className="w-12 h-12 bg-red-carpet/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4" /></svg>
            </div>
            <h4 className="font-bold text-sm mb-1 text-white">Upload film</h4>
            <p className="text-[10px] text-neutral-500">Main gallery selection.</p>
          </button>

          <button 
            onClick={() => setActiveForm('competition')}
            className="group flex flex-col items-center p-6 bg-neutral-800/50 border border-neutral-700 rounded-xl hover:border-amber-500 hover:bg-amber-500/5 transition-all text-center"
          >
            <div className="w-12 h-12 bg-red-carpet/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            </div>
            <h4 className="font-bold text-sm mb-1 text-white">Enter contest</h4>
            <p className="text-[10px] text-neutral-500">Jury prizes & awards.</p>
          </button>

          <button 
            onClick={() => setActiveForm('premiere')}
            className="group flex flex-col items-center p-6 bg-neutral-800/50 border border-neutral-700 rounded-xl hover:border-amber-500 hover:bg-amber-500/5 transition-all text-center"
          >
            <div className="w-12 h-12 bg-red-carpet/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h4 className="font-bold text-sm mb-1 text-white">Book premiere</h4>
            <p className="text-[10px] text-neutral-500">Scheduled gala release.</p>
          </button>
        </div>
      </BaseModal>

      <BaseModal isOpen={activeForm === 'festival'} onClose={closeModals} title="Festival Entry">
        <FilmFestivalEntryForm onSuccess={() => handleSuccess('festival')} />
      </BaseModal>

      <BaseModal isOpen={activeForm === 'competition'} onClose={closeModals} title="Enter Contest">
        <CompetitionEntryForm onSuccess={() => handleSuccess('competition')} />
      </BaseModal>

      <BaseModal isOpen={activeForm === 'premiere'} onClose={closeModals} title="Schedule Premiere">
        <PremiereSchedulingForm onSuccess={() => handleSuccess('premiere')} />
      </BaseModal>

      <BaseModal isOpen={showSuccess !== 'none'} onClose={closeModals} title="Bravo!">
        <SuccessView 
          type={showSuccess === 'none' ? 'festival' : showSuccess} 
          onClose={closeModals} 
        />
      </BaseModal>
    </div>
  );
};

export default Hero;
