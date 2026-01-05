
import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../store/AppContext';
import { UserRole } from '../types';
import BaseModal from '../components/Modals/BaseModal';
import EditProfileModal from '../components/Modals/EditProfileModal';

const CameraCapture: React.FC<{ onCapture: (dataUrl: string) => void, onClose: () => void }> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function setupCamera() {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user', width: { ideal: 400 }, height: { ideal: 400 } } 
        });
        setStream(userStream);
        if (videoRef.current) {
          videoRef.current.srcObject = userStream;
        }
      } catch (err) {
        console.error("Camera error:", err);
        setError("Unable to access camera. Please check your permissions.");
      }
    }
    setupCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        onCapture(dataUrl);
        onClose();
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {error ? (
        <div className="text-red-500 text-xs text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
          {error}
        </div>
      ) : (
        <div className="relative w-full aspect-square max-w-[300px] rounded-2xl overflow-hidden border border-amber-500/30 bg-black">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 pointer-events-none border-4 border-amber-500/10 rounded-2xl"></div>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
      <div className="flex gap-3 w-full">
        <button 
          onClick={onClose}
          className="flex-1 py-2 text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button 
          disabled={!!error || !stream}
          onClick={takePhoto}
          className={`flex-1 py-2 bg-red-carpet gold-glow rounded-full text-white font-bold uppercase tracking-widest text-[10px] transition-all ${(!error && stream) ? 'hover:scale-105 active:scale-95' : 'opacity-50 cursor-not-allowed'}`}
        >
          Capture Frame
        </button>
      </div>
    </div>
  );
};

const Profile: React.FC = () => {
  const { user, updateUser, films, logout } = useAppContext();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoSource, setPhotoSource] = useState<'selection' | 'camera' | 'gallery'>('selection');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) {
    return (
      <div className="pt-32 pb-16 px-6 text-center max-w-xl mx-auto min-h-[70vh] flex flex-col justify-center items-center">
        <div className="w-16 h-16 bg-red-carpet/10 rounded-full flex items-center justify-center mb-5 border border-amber-500/10">
          <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2-2V6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-3xl font-serif font-bold mb-3 gold-text">Exclusive Access</h2>
        <p className="text-neutral-500 mb-6 leading-relaxed max-sm text-sm">
          Please sign in via Internet Identity to manage your cinematic profile.
        </p>
        <button 
          onClick={() => window.location.hash = '/'}
          className="px-8 py-3 bg-red-carpet gold-glow rounded-full font-bold uppercase tracking-[0.2em] text-[10px] hover:scale-105 transition-all"
        >
          Grand Entrance
        </button>
      </div>
    );
  }

  const handleCameraCapture = (dataUrl: string) => {
    updateUser({ avatarUrl: dataUrl });
    setShowPhotoModal(false);
    setPhotoSource('selection');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUser({ avatarUrl: reader.result as string });
        setShowPhotoModal(false);
        setPhotoSource('selection');
      };
      reader.readAsDataURL(file);
    }
  };

  const myFilms = films.filter(f => f.creatorId === user.id);

  return (
    <div className="pt-24 pb-16 px-6 max-w-5xl mx-auto">
      {/* Profile Header Card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-[2rem] overflow-hidden mb-12 shadow-xl">
        <div className="h-40 bg-red-carpet relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -bottom-12 left-8 md:left-12">
            <div className="group relative">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-neutral-800 border-4 border-neutral-900 overflow-hidden gold-glow transition-transform">
                <img 
                  src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} 
                  alt="profile" 
                  className="w-full h-full object-cover bg-neutral-700" 
                />
              </div>
              <button 
                onClick={() => {
                  setPhotoSource('selection');
                  setShowPhotoModal(true);
                }}
                className="absolute bottom-1 right-1 w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center text-black border-2 border-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                title="Update Profile Picture"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="absolute bottom-4 right-8 flex gap-2">
             <button 
              onClick={() => setIsEditModalOpen(true)}
              className="px-5 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-[9px] font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Edit Profile
            </button>
          </div>
        </div>
        
        <div className="pt-16 px-8 md:px-12 pb-8">
          <div className="grid lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h2 className="text-3xl font-serif font-bold tracking-tight">{user.name}</h2>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-[8px] font-bold uppercase tracking-[0.2em]">
                    {user.role}
                  </span>
                  {user.gender && (
                    <span className="px-3 py-1 bg-white/5 text-neutral-400 border border-white/10 rounded-full text-[8px] font-bold uppercase tracking-[0.2em]">
                      {user.gender}
                    </span>
                  )}
                </div>
              </div>
              
              {(user as any).website && (
                <a 
                  href={(user as any).website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mb-4 text-[10px] text-amber-500 hover:text-amber-400 transition-colors font-bold uppercase tracking-widest"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                  Portfolio Website
                </a>
              )}

              <div className="flex items-center gap-1.5 mb-6 text-neutral-600">
                <span className="text-[9px] font-mono tracking-tighter opacity-60">ID: {user.principal}</span>
              </div>
              <p className="text-neutral-400 leading-relaxed text-base font-serif pl-3 italic border-l border-neutral-800">
                {user.bio || "Director, Visionary, Storyteller."}
              </p>
            </div>
            <div className="bg-black/20 rounded-2xl p-6 border border-neutral-800 space-y-4">
               <div className="flex justify-between items-center pb-3 border-b border-neutral-800/30">
                  <span className="text-[9px] text-neutral-600 uppercase tracking-widest font-bold">Works</span>
                  <span className="text-xl font-serif font-bold text-amber-500">{myFilms.length}</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-[9px] text-neutral-600 uppercase tracking-widest font-bold">Awards</span>
                  <span className="text-xl font-serif font-bold text-white">3</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Section */}
      <div className="space-y-6">
        <div className="flex items-end justify-between border-b border-neutral-800 pb-4">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-1">Portfolio</h3>
            <p className="text-neutral-600 text-[10px]">Managing your cinematic legacy.</p>
          </div>
        </div>

        {myFilms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {myFilms.map(film => (
              <div 
                key={film.id} 
                className="group flex gap-4 p-4 bg-neutral-900/60 border border-neutral-800 rounded-2xl hover:border-amber-500/20 transition-all duration-300 shadow-lg"
              >
                <div className="w-32 h-20 relative flex-shrink-0 overflow-hidden rounded-xl">
                  <img src={film.thumbnailUrl} className="w-full h-full object-cover" alt={film.title} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <div className="w-7 h-7 bg-red-carpet gold-glow rounded-full flex items-center justify-center text-white scale-75">
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                     </div>
                  </div>
                </div>
                <div className="flex flex-col justify-between flex-grow">
                   <div>
                     <h4 className="font-bold text-sm group-hover:text-amber-500 transition-colors leading-tight mb-0.5">{film.title}</h4>
                     <p className="text-[9px] text-neutral-600 font-medium italic">Uploaded on {new Date(film.uploadDate).toLocaleDateString()}</p>
                   </div>
                   <div className="flex items-center gap-2">
                     <button className="flex-grow py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-[8px] font-bold uppercase tracking-[0.1em] text-white border border-neutral-700">
                        Manage
                     </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 px-6 text-center border-2 border-dashed border-neutral-800/50 rounded-2xl bg-neutral-900/10">
             <h4 className="text-base font-serif font-bold mb-1">No Submissions Found</h4>
             <button 
               onClick={() => window.location.hash = '/'}
               className="mt-4 px-6 py-2 bg-neutral-800 text-white font-bold uppercase text-[9px] tracking-[0.15em] rounded-full hover:bg-amber-500 hover:text-black transition-colors"
             >
               Start Participation
             </button>
          </div>
        )}
      </div>

      <div className="mt-16 pt-8 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-neutral-600 text-[9px] italic">
          Internet Identity Secure Session.
        </div>
        <button 
          onClick={logout}
          className="px-6 py-2 bg-red-900/10 text-red-500 border border-red-500/10 rounded-full text-[8px] font-bold uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all"
        >
          Logout
        </button>
      </div>

      {/* Profile Picture Update Modal */}
      <BaseModal isOpen={showPhotoModal} onClose={() => setShowPhotoModal(false)} title="Update Masterpiece Frame">
        {photoSource === 'selection' && (
          <div className="flex flex-col gap-4 py-4 animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setPhotoSource('camera')}
              className="group flex items-center gap-4 p-5 bg-neutral-800 border border-neutral-700 rounded-2xl hover:border-amber-500 hover:bg-amber-500/5 transition-all text-left"
            >
              <div className="w-12 h-12 bg-red-carpet/20 rounded-full flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Use Live Camera</h4>
                <p className="text-[10px] text-neutral-500 mt-0.5">Capture a new frame right now.</p>
              </div>
            </button>

            <button 
              onClick={() => fileInputRef.current?.click()}
              className="group flex items-center gap-4 p-5 bg-neutral-800 border border-neutral-700 rounded-2xl hover:border-amber-500 hover:bg-amber-500/5 transition-all text-left"
            >
              <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Upload from Gallery</h4>
                <p className="text-[10px] text-neutral-500 mt-0.5">Choose a saved masterpiece.</p>
              </div>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
          </div>
        )}

        {photoSource === 'camera' && (
          <CameraCapture 
            onCapture={handleCameraCapture} 
            onClose={() => setPhotoSource('selection')} 
          />
        )}
      </BaseModal>

      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
    </div>
  );
};

export default Profile;
