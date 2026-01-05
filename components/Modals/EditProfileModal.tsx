
import React, { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import { useAppContext } from '../../store/AppContext';
import { UserRole } from '../../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    role: UserRole.AUDIENCE,
    gender: 'Prefer not to say',
    website: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        bio: user.bio,
        role: user.role,
        gender: user.gender || 'Prefer not to say',
        website: (user as any).website || ''
      });
    }
  }, [user, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(formData);
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Gala Profile Settings">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-2xl mb-2">
          <p className="text-[10px] text-amber-500/70 font-bold uppercase tracking-widest">Identity Settings</p>
          <p className="text-[11px] text-neutral-400 mt-1">These details are visible to the entire festival audience.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[9px] font-bold text-amber-500 uppercase tracking-widest ml-1">Screen Name</label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none transition-all"
              placeholder="e.g. Director Smith"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[9px] font-bold text-amber-500 uppercase tracking-widest ml-1">Festival Role</label>
            <select 
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none appearance-none cursor-pointer transition-all"
            >
              <option value={UserRole.CREATOR}>Creator</option>
              <option value={UserRole.JUDGE}>Judge</option>
              <option value={UserRole.AUDIENCE}>Audience</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[9px] font-bold text-amber-500 uppercase tracking-widest ml-1">Gender Identity</label>
          <div className="flex flex-wrap gap-2">
            {GENDER_OPTIONS.map(g => (
              <button
                key={g}
                type="button"
                onClick={() => setFormData({...formData, gender: g})}
                className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                  formData.gender === g 
                  ? 'bg-amber-500 border-amber-500 text-black shadow-lg' 
                  : 'bg-neutral-800 border-neutral-700 text-neutral-500 hover:border-neutral-600'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[9px] font-bold text-amber-500 uppercase tracking-widest ml-1">Personal Website / Portfolio</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-600">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
            </div>
            <input 
              type="url" 
              value={formData.website}
              onChange={e => setFormData({...formData, website: e.target.value})}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-amber-500 outline-none transition-all"
              placeholder="https://yourwork.com"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[9px] font-bold text-amber-500 uppercase tracking-widest ml-1">Biography</label>
          <textarea 
            required
            value={formData.bio}
            onChange={e => setFormData({...formData, bio: e.target.value})}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none h-28 resize-none transition-all"
            placeholder="Tell your cinematic story..."
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button 
            type="button" 
            onClick={onClose}
            className="flex-1 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="flex-[2] py-4 bg-red-carpet gold-glow rounded-xl text-white font-bold uppercase tracking-[0.2em] text-[10px] hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
          >
            Save Masterpiece Profile
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default EditProfileModal;
