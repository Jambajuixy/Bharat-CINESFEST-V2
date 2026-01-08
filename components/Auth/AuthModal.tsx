
import React, { useState } from 'react';
import BaseModal from '../Modals/BaseModal';
import { useAppContext } from '../../store/AppContext';
import { UserRole } from '../../types';

type AuthMethod = 'ii' | 'email' | 'phone' | 'google';

const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

const AuthModal: React.FC = () => {
  const { showAuthModal, setShowAuthModal, register, signIn, isAuthenticating, user: currentUser } = useAppContext();
  const [step, setStep] = useState<'welcome' | 'method_input' | 'ii_loading' | 'signup'>('welcome');
  const [activeMethod, setActiveMethod] = useState<AuthMethod | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [formData, setFormData] = useState({ 
    name: '', 
    bio: '', 
    role: UserRole.AUDIENCE,
    gender: 'Prefer not to say',
    email: '',
    phone: ''
  });

  const getSimulatedIdentifier = (method: AuthMethod, value?: string) => {
    if (method === 'ii') return 'ii-principal-999';
    if (method === 'google') return 'google-oauth-555';
    return value ? value.trim().toLowerCase() : 'anonymous-id';
  };

  const resetModal = () => {
    if (isAuthenticating) return;
    setShowAuthModal(false);
    setTimeout(() => {
      setStep('welcome');
      setActiveMethod(null);
      setInputValue('');
      setFormData({ name: '', bio: '', role: UserRole.AUDIENCE, gender: 'Prefer not to say', email: '', phone: '' });
    }, 300);
  };

  const handleSelectMethod = (method: AuthMethod) => {
    setActiveMethod(method);
    if (method === 'ii' || method === 'google') {
      setStep('ii_loading');
      const identifier = getSimulatedIdentifier(method);
      setInputValue(identifier);
      
      setTimeout(() => {
        const success = signIn(identifier);
        if (success) {
          resetModal();
        } else {
          setStep('signup');
        }
      }, 2000);
    } else {
      setStep('method_input');
    }
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    setStep('ii_loading');
    const identifier = getSimulatedIdentifier(activeMethod!, inputValue);
    setInputValue(identifier); // Save normalized version
    
    setTimeout(() => {
      const success = signIn(identifier);
      if (success) {
        resetModal();
      } else {
        setStep('signup');
      }
    }, 1500);
  };

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    register({ ...formData, identifier: inputValue });
  };

  return (
    <BaseModal 
      isOpen={showAuthModal} 
      onClose={resetModal} 
      title={step === 'signup' ? "Complete Your Profile" : "Secure Authentication"}
    >
      <div className="py-2">
        {step === 'welcome' && (
          <div className="text-center animate-in fade-in duration-500">
            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/20 shadow-xl">
              <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 20c4.083 0 7.743-2.435 9.356-6m-9.356-6a1 1 0 001-1V5.5a3.375 3.375 0 00-6.75 0V7a1 1 0 001 1h4.75z" />
              </svg>
            </div>
            <h3 className="text-xl font-serif font-bold mb-2 text-white">Enter the Grand Hall</h3>
            <p className="text-neutral-400 text-xs mb-8 leading-relaxed px-4">
              Select your preferred credential to access the exclusive screenings and voting chambers.
            </p>
            
            <div className="space-y-3">
              <button 
                onClick={() => handleSelectMethod('ii')}
                className="w-full py-3.5 bg-red-carpet gold-glow rounded-xl text-white font-bold uppercase tracking-[0.2em] text-[10px] hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
              >
                <div className="w-5 h-5 bg-white/10 rounded flex items-center justify-center">
                  <span className="text-[8px] font-serif text-white">II</span>
                </div>
                Internet Identity
              </button>

              <div className="grid grid-cols-1 gap-2">
                <button 
                  onClick={() => handleSelectMethod('google')}
                  className="w-full py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white font-bold uppercase tracking-[0.15em] text-[9px] hover:bg-neutral-700 transition-all flex items-center justify-center gap-3"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.928 4.172-1.2 1.2-3.08 2.484-6.112 2.484-4.828 0-8.52-3.896-8.52-8.72s3.692-8.72 8.52-8.72c2.608 0 4.492 1.024 5.908 2.344l2.32-2.32C18.156 1.112 15.54 0 12.48 0 6.54 0 1.62 4.92 1.62 10.86s4.92 10.86 10.86 10.86c3.224 0 5.668-1.068 7.564-3.04 1.96-1.96 2.584-4.72 2.584-6.912 0-.66-.052-1.28-.148-1.848H12.48z"/>
                  </svg>
                  Sign in with Google
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => handleSelectMethod('email')}
                    className="py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white font-bold uppercase tracking-[0.15em] text-[9px] hover:bg-neutral-700 transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-3.5 h-3.5 text-amber-500/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z"/></svg>
                    Email
                  </button>
                  <button 
                    onClick={() => handleSelectMethod('phone')}
                    className="py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white font-bold uppercase tracking-[0.15em] text-[9px] hover:bg-neutral-700 transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-3.5 h-3.5 text-amber-500/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                    Mobile
                  </button>
                </div>
              </div>
            </div>
            
            <p className="mt-6 text-[8px] text-neutral-600 uppercase tracking-widest font-bold">
              Secure • Encrypted • Cinematic Experience
            </p>
          </div>
        )}

        {step === 'method_input' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
             <button onClick={() => setStep('welcome')} className="text-[9px] text-amber-500 uppercase tracking-widest font-bold flex items-center gap-2 mb-6 hover:text-amber-400 transition-colors">
               <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7"/></svg>
               Back
             </button>
             
             <h3 className="text-xl font-serif font-bold mb-2 text-white">
               {activeMethod === 'email' ? 'Enter Email' : 'Enter Mobile Number'}
             </h3>
             <p className="text-neutral-400 text-xs mb-6">
               {activeMethod === 'email' 
                 ? "Connect your existing gala profile or create a new one via email." 
                 : "Enter digits only. Invitation code will be dispatched to this number."}
             </p>

             <form onSubmit={handleInputSubmit} className="space-y-4">
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-amber-500/50">
                    {activeMethod === 'email' ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" strokeWidth={2}/></svg>
                    ) : (
                      <span className="text-[10px] font-bold">+91</span>
                    )}
                 </div>
                 <input 
                   required
                   autoFocus
                   type={activeMethod === 'email' ? 'email' : 'tel'} 
                   inputMode={activeMethod === 'phone' ? 'numeric' : 'email'}
                   pattern={activeMethod === 'phone' ? '[0-9]*' : undefined}
                   value={inputValue}
                   onChange={e => {
                     const val = e.target.value;
                     setInputValue(activeMethod === 'phone' ? val.replace(/\D/g, '') : val);
                   }}
                   placeholder={activeMethod === 'email' ? 'director@studio.com' : '9999901234'}
                   className="w-full bg-neutral-800 border border-neutral-700 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white focus:border-amber-500 outline-none transition-all placeholder:text-neutral-600"
                 />
               </div>
               
               <button 
                 type="submit"
                 className="w-full py-4 bg-red-carpet gold-glow rounded-xl text-white font-bold uppercase tracking-[0.2em] text-[10px] hover:scale-[1.02] transition-all shadow-xl"
               >
                 Verify & Continue
               </button>
             </form>
          </div>
        )}

        {step === 'ii_loading' && (
          <div className="text-center py-10 animate-in fade-in zoom-in duration-500">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-10 h-10 text-amber-500/50" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9V5a1 1 0 112 0v4h1a1 1 0 112 0v4h1a1 1 0 112 0v4h1a1 1 0 110 2h-2v1a1 1 0 11-2 0v-2H7a1 1 0 110-2h2z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <h4 className="text-amber-500 font-serif text-xl font-bold animate-pulse">
              {activeMethod === 'google' ? 'Syncing Gmail...' : 'Verifying Identity...'}
            </h4>
            <p className="text-neutral-500 text-[10px] mt-3 uppercase tracking-widest font-bold">Checking for existing profile...</p>
          </div>
        )}

        {step === 'signup' && (
          <form onSubmit={handleSubmitProfile} className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-xl mb-2">
              <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">Credentials Confirmed</p>
              <p className="text-[11px] text-neutral-400 mt-1">Join the community. Complete your contact and visionary details.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-bold text-amber-500 uppercase tracking-widest mb-1.5 ml-1">Screen Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Cinephile Prime" className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-amber-500 uppercase tracking-widest mb-1.5 ml-1">Gender</label>
                <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none appearance-none cursor-pointer transition-all" >
                  {GENDER_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-bold text-amber-500 uppercase tracking-widest mb-1.5 ml-1">Official Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="alex@cinema.com" className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-amber-500 uppercase tracking-widest mb-1.5 ml-1">Phone Number (Digits Only)</label>
                <input 
                  required 
                  type="tel" 
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})} 
                  placeholder="9999900000" 
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none transition-all" 
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-bold text-amber-500 uppercase tracking-widest mb-1.5 ml-1">Festival Role</label>
              <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as UserRole})} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none appearance-none cursor-pointer transition-all" >
                {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[9px] font-bold text-amber-500 uppercase tracking-widest mb-1.5 ml-1">Short Bio</label>
              <textarea required value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} placeholder="Share your passion for the silver screen..." className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none h-16 resize-none transition-all" />
            </div>

            <button type="submit" disabled={isAuthenticating} className={`w-full py-4 bg-red-carpet gold-glow rounded-xl text-white font-bold uppercase tracking-[0.2em] text-[10px] hover:scale-[1.02] transition-all shadow-xl flex items-center justify-center gap-3`} >
              {isAuthenticating && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
              {isAuthenticating ? 'Generating Festival ID...' : 'Join the Gala'}
            </button>
          </form>
        )}
      </div>
    </BaseModal>
  );
};

export default AuthModal;
