
import React, { useState } from 'react';
import BaseModal from './BaseModal';
import { useAppContext } from '../../store/AppContext';

interface PressInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PressInquiryModal: React.FC<PressInquiryModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    outlet: '',
    name: user?.name || '',
    email: user?.principal && user.principal.includes('@') ? user.principal : '',
    topic: 'Interview Request',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call to send press inquiry
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setFormData({
      outlet: '',
      name: user?.name || '',
      email: user?.principal && user.principal.includes('@') ? user.principal : '',
      topic: 'Interview Request',
      message: ''
    });
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={handleReset} title="Media Accreditation & Press Office">
      {isSuccess ? (
        <div className="py-8 text-center animate-in zoom-in fade-in duration-500">
          <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/20 gold-glow">
            <svg className="w-10 h-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-2xl font-serif font-bold text-white mb-2">Accreditation Pending</h3>
          <p className="text-neutral-400 text-xs mb-8 px-8 leading-relaxed">
            Your media credentials request for <span className="text-amber-500 font-bold">{formData.outlet}</span> has been received. Our Press Office will reach out shortly with festival access kits.
          </p>
          <button 
            onClick={handleReset}
            className="px-10 py-3 bg-red-carpet gold-glow rounded-full text-white font-bold uppercase tracking-[0.2em] text-[10px] hover:scale-105 transition-all"
          >
            Return to Gala
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          <div className="bg-red-carpet/5 border border-amber-500/10 p-4 rounded-xl mb-2">
            <p className="text-[10px] text-amber-500/80 font-bold uppercase tracking-[0.3em]">Press & Media Relations</p>
            <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed italic">
              Formal requests for media kits, director interviews, and red-carpet accreditation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-amber-500 uppercase tracking-widest ml-1">Media Outlet</label>
              <input 
                required
                type="text"
                placeholder="The Cinematic Times"
                value={formData.outlet}
                onChange={e => setFormData({...formData, outlet: e.target.value})}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-amber-500 uppercase tracking-widest ml-1">Contact Name</label>
              <input 
                required
                type="text"
                placeholder="Alex Reporter"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-amber-500 uppercase tracking-widest ml-1">Work Email</label>
              <input 
                required
                type="email"
                placeholder="press@outlet.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-amber-500 uppercase tracking-widest ml-1">Request Topic</label>
              <select 
                value={formData.topic}
                onChange={e => setFormData({...formData, topic: e.target.value})}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none appearance-none cursor-pointer transition-all"
              >
                <option>Interview Request</option>
                <option>Press Kit Access</option>
                <option>Festival Accreditation</option>
                <option>Coverage Proposal</option>
                <option>Asset Licensing</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[9px] font-bold text-amber-500 uppercase tracking-widest ml-1">Inquiry Details</label>
            <textarea 
              required
              placeholder="Describe your coverage scope or specific interview requests..."
              value={formData.message}
              onChange={e => setFormData({...formData, message: e.target.value})}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none h-32 resize-none transition-all"
            />
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-red-carpet gold-glow rounded-xl text-white font-bold uppercase tracking-[0.2em] text-[10px] hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
              <>
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Filing Request...
              </>
            ) : 'Submit Media Application'}
          </button>
          
          <div className="text-center pt-2">
            <p className="text-[8px] text-neutral-600 uppercase tracking-widest font-bold">
              Urgent Media Wire: <span className="text-amber-500/50">press@bharatcinefest.com</span>
            </p>
          </div>
        </form>
      )}
    </BaseModal>
  );
};

export default PressInquiryModal;
