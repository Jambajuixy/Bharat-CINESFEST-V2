
import React, { useState, useEffect } from 'react';
import { AppProvider, useAppContext } from './store/AppContext';
import Header from './components/Header';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AuthModal from './components/Auth/AuthModal';
import InquiryModal from './components/Modals/InquiryModal';
import PressInquiryModal from './components/Modals/PressInquiryModal';
import AccessDeniedScreen from './components/AccessDeniedScreen';
import { UserRole } from './types';

const AppContent: React.FC = () => {
  const { user } = useAppContext();
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#/');
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isPressModalOpen, setIsPressModalOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const newHash = window.location.hash || '#/';
      setCurrentHash(newHash);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Secret Keyboard Shortcut: Ctrl+Shift+A to access Backstage
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        if (user?.role === UserRole.ADMIN) {
          e.preventDefault();
          window.location.hash = '#/backstage';
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505]">
        <Header />
        <AccessDeniedScreen />
        <AuthModal />
      </div>
    );
  }

  const renderPage = () => {
    switch (currentHash) {
      case '#/':
        return <Home />;
      case '#/profile':
        return <Profile />;
      case '#/backstage':
        return <Admin />;
      case '#/privacy':
        return <PrivacyPolicy />;
      default:
        return <Home />;
    }
  };

  const goToBackstage = () => {
    window.location.hash = '#/backstage';
  };

  const goToPrivacy = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = '#/privacy';
  };

  const openInquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsInquiryModalOpen(true);
  };

  const openPress = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPressModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />
      <main className="animate-in fade-in duration-700">
        {renderPage()}
      </main>
      
      <AuthModal />
      <InquiryModal isOpen={isInquiryModalOpen} onClose={() => setIsInquiryModalOpen(false)} />
      <PressInquiryModal isOpen={isPressModalOpen} onClose={() => setIsPressModalOpen(false)} />

      <footer className="py-16 px-6 border-t border-neutral-900 bg-black/60 relative overflow-hidden">
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
         
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
            <div className="text-center md:text-left">
              <div className="flex flex-col mb-3">
                <span className="text-[10px] uppercase tracking-[0.5em] text-amber-500/80 font-bold ml-1">Bharat</span>
                <span className="text-3xl font-serif font-bold gold-text tracking-widest leading-none">CINEFEST</span>
              </div>
              <p className="text-[10px] text-neutral-500 uppercase tracking-[0.3em]">
                {/* Hidden Portal: Clicking the Copyright symbol as Admin triggers navigation */}
                <span 
                  onClick={user?.role === UserRole.ADMIN ? goToBackstage : undefined}
                  className={user?.role === UserRole.ADMIN ? "cursor-pointer hover:text-amber-500/40 transition-colors" : ""}
                >
                  &copy;
                </span> 
                2024 Bharat CINEFEST. All Rights Reserved.
              </p>
            </div>
            
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-wrap justify-center gap-8 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                <button onClick={openPress} className="hover:text-amber-500 transition-colors uppercase tracking-widest">Press Inquiries</button>
                <a href="#/privacy" onClick={goToPrivacy} className="hover:text-amber-500 transition-colors">Privacy Policy</a>
                <button onClick={openInquiry} className="hover:text-amber-500 transition-colors uppercase tracking-widest">Contact Support</button>
              </div>
            </div>

            <div className="flex gap-4">
               <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:border-amber-500 cursor-pointer transition-all hover:scale-110">
                 <span className="text-[10px] font-bold">IG</span>
               </div>
               <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:border-amber-500 cursor-pointer transition-all hover:scale-110">
                 <span className="text-[10px] font-bold">X</span>
               </div>
               <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:border-amber-500 cursor-pointer transition-all hover:scale-110">
                 <span className="text-[10px] font-bold">YT</span>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
