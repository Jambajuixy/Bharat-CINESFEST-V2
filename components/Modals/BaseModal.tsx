
import React from 'react';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const BaseModal: React.FC<BaseModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-neutral-900 border border-amber-500/20 rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="bg-red-carpet px-5 py-3 flex justify-between items-center border-b border-amber-500/10">
          <h3 className="text-base font-bold font-serif text-white tracking-wider">{title}</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-5 overflow-y-auto max-h-[85vh] bg-neutral-900 text-neutral-200 thin-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BaseModal;
