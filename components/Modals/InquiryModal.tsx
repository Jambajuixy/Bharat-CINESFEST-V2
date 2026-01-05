
import React, { useState } from 'react';
import BaseModal from './BaseModal';
import { useAppContext } from '../../store/AppContext';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InquiryModal: React.FC<InquiryModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    subject: 'Technical Support',
    email: user?.principal && user.principal.includes('@') ? user.principal : '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call to send inquiry
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setFormData({
      subject: 'Technical Support',
      email: user?.principal && user.principal.includes('@') ? user.principal : '',
      message: ''
    });
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={handleReset} title="Support Command">
      {isSuccess ? (
        <div className="py-8 text-center animate-in zoom-in fade-in duration-500">
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/20 shadow-xl">
            <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-serif font-bold text-white mb-2">Message Dispatched</h3>
          <p className="text-neutral-400 text-xs mb-8 px-4 leading-relaxed">
            Your inquiry has been encrypted and sent to the Bharat CINEFEST curators. Expect a response in your screening box within 24 hours.
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
          <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-xl mb-2">
            <p className="text-[10px] text-amber-500/80 font-bold uppercase tracking-[0.3em]">Official Inquiry</p>
            <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
              Facing a technical hurdle? Our backstage crew is ready to assist.
            </p>
          </div>

          <div className="space-y-1">
            <label className="block text-[9px] font-bold text-amber-500 uppercase tracking-widest ml-1">Inquiry Type</label>
            <select 
              value={formData.subject}
              onChange={e => setFormData({...formData, subject: e.target.value})}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none appearance-none cursor-pointer transition-all"
            >
              <option>Technical Support</option>
              <option>Submission Query</option>
              <option>Payment Issue</option>
              <option>Account Access</option>
              <option>Legal & Privacy</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[9px] font-bold text-amber-500 uppercase tracking-widest ml-1">Contact Email</label>
            <input 
              required
              type="email"
              placeholder="curator@studio.com"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[9px] font-bold text-amber-500 uppercase tracking-widest ml-1">Your Message</label>
            <textarea 
              required
              placeholder="Describe your issue with cinematic detail..."
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
                Dispatching...
              </>
            ) : 'Send to Backstage'}
          </button>
          
          <div className="text-center">
            <p className="text-[8px] text-neutral-600 uppercase tracking-widest font-bold">
              Emergency? Direct mail: <span className="text-amber-500/50">bharatcinefest@gmail.com</span>
            </p>
          </div>
        </form>
      )}
    </BaseModal>
  );
};

export default InquiryModal;
