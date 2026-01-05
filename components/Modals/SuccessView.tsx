
import React from 'react';
import { Icons } from '../../constants';

interface SuccessViewProps {
  type: 'festival' | 'competition' | 'premiere';
  onClose: () => void;
}

const SuccessView: React.FC<SuccessViewProps> = ({ type, onClose }) => {
  const content = {
    festival: {
      title: "Masterpiece Received",
      subtitle: "FESTIVAL SELECTION",
      message: "Your film has been successfully added to our festival gallery. The world is waiting to see your vision.",
      icon: <Icons.Camera className="w-12 h-12 text-amber-500" />,
      actionText: "Examine My Gallery"
    },
    competition: {
      title: "Entry Confirmed",
      subtitle: "OFFICIAL CONTESTANT",
      message: "You've officially entered the arena. Our judges are eager to review your work and the spotlight is yours.",
      icon: <Icons.Trophy className="w-12 h-12 text-amber-500" />,
      actionText: "View Competition Board"
    },
    premiere: {
      title: "Red Carpet Ready",
      subtitle: "GALA EVENT PREMIERE",
      message: "The stage is set! Your grand premiere has been scheduled. Prepare for your moment in the limelight.",
      icon: <Icons.Star className="w-12 h-12 text-amber-500" />,
      actionText: "Go to Premiere Room"
    }
  };

  const active = content[type];
  const submissionId = React.useMemo(() => Math.random().toString(36).substr(2, 9).toUpperCase(), []);

  return (
    <div className="relative text-center py-8 px-4 overflow-hidden animate-in fade-in zoom-in duration-500">
      {/* Sparkles decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="sparkle-dot top-10 left-10" style={{ animationDelay: '0.1s' }}></div>
        <div className="sparkle-dot top-20 right-20" style={{ animationDelay: '0.5s' }}></div>
        <div className="sparkle-dot bottom-10 left-1/4" style={{ animationDelay: '0.9s' }}></div>
        <div className="sparkle-dot bottom-24 right-1/3" style={{ animationDelay: '1.3s' }}></div>
      </div>

      <div className="w-24 h-24 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6 gold-glow relative z-10">
        <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-amber-500"></div>
        {active.icon}
      </div>

      <div className="mb-2">
        <span className="text-[10px] font-bold text-amber-500 tracking-[0.4em] uppercase opacity-70">
          {active.subtitle}
        </span>
      </div>

      <h3 className="text-4xl font-serif font-bold gold-text mb-4 drop-shadow-lg">{active.title}</h3>
      
      <p className="text-neutral-400 mb-8 leading-relaxed max-w-sm mx-auto text-sm">
        {active.message}
      </p>

      <div className="bg-black/40 border border-neutral-800 rounded-2xl p-4 mb-10 max-w-xs mx-auto">
         <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-1">Registration Hash</div>
         <div className="text-xs font-mono text-amber-500/80">{submissionId}</div>
      </div>

      <div className="flex flex-col gap-3 max-w-xs mx-auto">
        <button 
          onClick={onClose}
          className="w-full py-4 bg-red-carpet gold-glow rounded-full text-white font-bold uppercase tracking-[0.2em] text-xs hover:scale-[1.03] active:scale-95 transition-all shadow-xl"
        >
          {active.actionText}
        </button>
        <button 
          onClick={() => {
            onClose();
            window.location.hash = '#/profile';
          }}
          className="w-full py-3 text-neutral-500 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors"
        >
          Go to My Profile
        </button>
      </div>
    </div>
  );
};

export default SuccessView;
