
import React from 'react';
import { useAppContext } from '../store/AppContext';
import { UserRole } from '../types';

const LogoIcon: React.FC<{ className?: string }> = ({ className = "w-9 h-9" }) => (
  <svg viewBox="0 0 100 100" className={`${className} drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]`}>
    <defs>
      <linearGradient id="gold-header-logo" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#bf953f" />
        <stop offset="25%" stopColor="#fcf6ba" />
        <stop offset="50%" stopColor="#b38728" />
        <stop offset="75%" stopColor="#fbf5b7" />
        <stop offset="100%" stopColor="#aa771c" />
      </linearGradient>
    </defs>
    
    <g transform="translate(32, 30) scale(0.65)">
      <circle cx="0" cy="0" r="22" fill="url(#gold-header-logo)" />
      <circle cx="0" cy="0" r="18" fill="none" stroke="black" strokeWidth="1.2" opacity="0.7" />
      <circle cx="0" cy="0" r="4.5" fill="black" />
      <circle cx="0" cy="-12" r="4.5" fill="black" />
      <circle cx="0" cy="12" r="4.5" fill="black" />
      <circle cx="-12" cy="0" r="4.5" fill="black" />
      <circle cx="12" cy="0" r="4.5" fill="black" />
    </g>

    <text x="52" y="65" textAnchor="middle" className="font-serif italic font-bold" style={{ fontSize: '42px', fill: 'url(#gold-header-logo)', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))' }}>
      BC
    </text>

    <path d="M15 72 Q 50 82, 85 72 L 88 78 Q 50 88, 12 78 Z" fill="rgba(0,0,0,0.6)" stroke="url(#gold-header-logo)" strokeWidth="0.5" />
    
    <text x="50" y="80.5" textAnchor="middle" style={{ fontSize: '6px', fill: 'white', fontWeight: 'bold', letterSpacing: '0.8px' }} className="uppercase font-serif">
      Bharat Cinefest
    </text>

    <path d="M40 86 Q 50 94, 60 86" fill="none" stroke="url(#gold-header-logo)" strokeWidth="1" strokeLinecap="round" />
    <circle cx="50" cy="92" r="1.5" fill="url(#gold-header-logo)" />
    
    <path d="M78 30 l 1 3 l 3 1 l -3 1 l -1 3 l -1 -3 l -3 -1 l 3 -1 z" fill="url(#gold-header-logo)" />
  </svg>
);

const Header: React.FC = () => {
  const { user, login, logout, isAuthenticating } = useAppContext();

  const goToProfile = () => {
    window.location.hash = '#/profile';
  };

  const goToHome = () => {
    window.location.hash = '#/';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-6 py-2.5 flex justify-between items-center backdrop-blur-md bg-black/60 border-b border-amber-500/10">
      <div 
        className="flex items-center gap-3 cursor-pointer group"
        onClick={goToHome}
      >
        <LogoIcon className="w-9 h-9 group-hover:scale-110 transition-transform" />
        <h1 className="flex flex-col items-start leading-none hidden sm:flex">
          <span className="text-[9px] uppercase tracking-[0.3em] text-amber-500/80 font-bold ml-0.5 mb-0.5">Bharat</span>
          <span className="text-xl font-serif font-bold tracking-tighter gold-text">CINEFEST</span>
        </h1>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <button 
                onClick={goToProfile}
                className="group flex items-center gap-2 p-1 pr-3 bg-neutral-900/50 border border-amber-500/20 rounded-full hover:border-amber-500/50 transition-all"
              >
                <div className="w-7 h-7 rounded-full overflow-hidden border border-amber-500/30 gold-glow">
                  <img 
                    src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="hidden xs:block text-[9px] font-bold text-white uppercase tracking-widest group-hover:text-amber-400">
                  {user.name.split(' ')[0]}
                </span>
              </button>

              <button 
                onClick={logout}
                className="relative px-4 sm:px-5 py-1.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white border border-neutral-700 hover:bg-red-900/10 hover:border-red-500/50 bg-neutral-900/30 transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            isAuthenticating && (
              <div className="flex items-center gap-2 px-4 py-1.5">
                <div className="w-3 h-3 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
                <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">Entering Hall...</span>
              </div>
            )
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
