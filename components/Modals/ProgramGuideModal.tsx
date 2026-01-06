
import React, { useState } from 'react';
import BaseModal from './BaseModal';

interface ProgramGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProgramGuideModal: React.FC<ProgramGuideModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "The Grand Entrance",
      subtitle: "Welcome to Bharat CINEFEST",
      icon: (
        <div className="w-16 h-16 bg-red-carpet gold-glow rounded-full flex items-center justify-center text-white text-2xl font-serif font-bold mx-auto mb-6">
          B
        </div>
      ),
      content: "You've entered the premier digital stage for independent filmmakers. Our platform celebrates the intersection of classic storytelling and cutting-edge neural cinema."
    },
    {
      title: "The Dual Halls",
      subtitle: "Human vs. AI Cinema",
      icon: (
        <div className="flex justify-center gap-4 mb-6">
          <div className="w-12 h-12 bg-amber-500/20 border border-amber-500/40 rounded-xl flex items-center justify-center text-amber-500">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
          <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>
        </div>
      ),
      content: "Explore two distinct screening rooms. Toggle between the 'Human Hall' for organic narratives and the 'AI Hall' for experimental work generated with artificial intelligence."
    },
    {
      title: "The AI Critic",
      subtitle: "Narrative Deep-Dive",
      icon: (
        <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
          <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
        </div>
      ),
      content: "While watching any film, click 'Summon AI Critic' in the video player. Our Gemini-powered engine will provide a professional critique grounded in 2024 industrial cinematic trends."
    },
    {
      title: "Recognition Points",
      subtitle: "Your Voice Matters",
      icon: (
        <div className="w-16 h-16 bg-red-carpet/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/30">
          <svg className="w-8 h-8 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
        </div>
      ),
      content: "As an audience member, your votes grant 'Recognition Points' to filmmakers. Rate films to contribute to the festival's Artistic Score and help the best work win the Jury Prize."
    },
    {
      title: "Participation",
      subtitle: "The Red Carpet Awaits",
      icon: (
        <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
          <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
        </div>
      ),
      content: "Ready to show your work? Click 'Participate' to upload to the Main Gallery, enter a Contest for cash prizes, or schedule a Scheduled Premiere for a grand live release."
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const current = steps[step];

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Festival Program Guide">
      <div className="py-6 flex flex-col items-center text-center animate-in fade-in duration-500">
        <div className="mb-4">
          <span className="text-[10px] text-amber-500 font-bold uppercase tracking-[0.4em] opacity-70">
            {current.subtitle}
          </span>
        </div>

        {current.icon}

        <h3 className="text-3xl font-serif font-bold gold-text mb-4 drop-shadow-lg">
          {current.title}
        </h3>
        
        <p className="text-neutral-400 mb-10 leading-relaxed max-w-sm mx-auto text-sm font-medium">
          {current.content}
        </p>

        <div className="w-full relative px-10">
          {/* Navigation Controls */}
          <div className="flex items-center justify-between mb-8">
            {/* Back Button */}
            <button 
              onClick={handleBack}
              disabled={step === 0}
              className={`w-12 h-12 rounded-full border border-neutral-800 flex items-center justify-center transition-all ${
                step === 0 ? 'opacity-0 pointer-events-none' : 'text-neutral-500 hover:text-white hover:border-neutral-600'
              }`}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next / Final Button */}
            {step === steps.length - 1 ? (
              <button 
                onClick={handleNext}
                className="flex-grow ml-4 py-4 bg-red-carpet gold-glow rounded-xl text-white font-bold uppercase tracking-[0.2em] text-[10px] hover:scale-[1.03] active:scale-95 transition-all shadow-xl animate-in slide-in-from-right-4"
              >
                Step onto the Red Carpet
              </button>
            ) : (
              <button 
                onClick={handleNext}
                className="w-14 h-14 bg-amber-500 gold-glow rounded-full text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-2xl"
              >
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Progress Strip */}
          <div className="flex justify-center gap-1.5">
            {steps.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1 rounded-full transition-all duration-300 ${idx === step ? 'w-10 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'w-2 bg-neutral-800'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default ProgramGuideModal;
