
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../store/AppContext';
import { UserRole, FilmCategory, Competition, Film, User, Advertisement, DirectorInterview } from '../types';
import { Icons } from '../constants';
import VideoPlayerModal from '../components/Modals/VideoPlayerModal';
import BaseModal from '../components/Modals/BaseModal';

type AdminTab = 'overview' | 'films' | 'competitions' | 'ads' | 'interviews' | 'users';

const Admin: React.FC = () => {
  const { 
    user, films, knownUsers, competitions, advertisements, interviews, deleteFilm, updateFilm, 
    addCompetition, updateCompetition, 
    deleteCompetition, deleteUser, addAd, updateAd, deleteAd,
    addInterview, updateInterview, deleteInterview
  } = useAppContext();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [playingFilm, setPlayingFilm] = useState<Film | null>(null);
  const [editingComp, setEditingComp] = useState<Competition | null>(null);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [editingInterview, setEditingInterview] = useState<DirectorInterview | null>(null);
  const [isCompModalOpen, setIsCompModalOpen] = useState(false);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  
  const [filmFilter, setFilmFilter] = useState<string>('all');
  const [userFilter, setUserFilter] = useState<string>('all');

  const [compForm, setCompForm] = useState<Omit<Competition, 'id'>>({
    name: '',
    description: '',
    prize: '',
    entryFee: 0,
    endsAt: new Date().toISOString().split('T')[0]
  });

  const [adForm, setAdForm] = useState<Omit<Advertisement, 'id'>>({
    title: '',
    subtitle: '',
    description: '',
    actionText: '',
    isActive: true,
    prize: '',
    entryFee: 0,
    imageUrl: '',
    targetForm: 'competition'
  });

  const [interviewForm, setInterviewForm] = useState<Omit<DirectorInterview, 'id'>>({
    name: '',
    portraitUrl: '',
    quote: '',
    videoUrl: '',
    expertise: '',
    filmTitle: ''
  });

  if (!user || user.role !== UserRole.ADMIN) {
    return (
      <div className="pt-32 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-20 h-20 bg-red-900/10 rounded-full flex items-center justify-center border border-red-500/20">
          <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2-2V6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-3xl font-serif font-bold text-white uppercase tracking-tighter">Access Denied</h2>
        <p className="text-neutral-500 text-sm max-w-xs font-serif italic">The backstage entrance is restricted to Festival Directors.</p>
        <button onClick={() => window.location.hash = '#/'} className="px-8 py-3 bg-neutral-900 border border-neutral-800 rounded-full text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-all">Exit Dashboard</button>
      </div>
    );
  }

  const activeUsers = useMemo(() => {
    const now = new Date();
    return knownUsers.filter(u => {
      const lastActive = new Date(u.lastActive);
      return (now.getTime() - lastActive.getTime()) < (30 * 60 * 1000);
    });
  }, [knownUsers]);

  const handleOpenCompModal = (comp?: Competition) => {
    if (comp) {
      setEditingComp(comp);
      setCompForm({ ...comp });
    } else {
      setEditingComp(null);
      setCompForm({
        name: '',
        description: '',
        prize: '',
        entryFee: 1500,
        endsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    }
    setIsCompModalOpen(true);
  };

  const handleOpenAdModal = (ad?: Advertisement) => {
    if (ad) {
      setEditingAd(ad);
      setAdForm({ ...ad });
    } else {
      setEditingAd(null);
      setAdForm({
        title: '',
        subtitle: 'LIVE NOW',
        description: '',
        actionText: 'Take Action',
        isActive: true,
        prize: '',
        entryFee: 0,
        imageUrl: '',
        targetForm: 'competition'
      });
    }
    setIsAdModalOpen(true);
  };

  const handleOpenInterviewModal = (interview?: DirectorInterview) => {
    if (interview) {
      setEditingInterview(interview);
      setInterviewForm({ ...interview });
    } else {
      setEditingInterview(null);
      setInterviewForm({
        name: '',
        portraitUrl: '',
        quote: '',
        videoUrl: '',
        expertise: '',
        filmTitle: ''
      });
    }
    setIsInterviewModalOpen(true);
  };

  const handleAdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAd) {
      updateAd(editingAd.id, adForm);
    } else {
      addAd(adForm);
    }
    setIsAdModalOpen(false);
  };

  const handleCompSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingComp) {
      updateCompetition(editingComp.id, compForm);
    } else {
      addCompetition(compForm);
    }
    setIsCompModalOpen(false);
  };

  const handleInterviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingInterview) {
      updateInterview(editingInterview.id, interviewForm);
    } else {
      addInterview(interviewForm);
    }
    setIsInterviewModalOpen(false);
  };

  const filteredFilms = useMemo(() => {
    if (filmFilter === 'all') return films;
    return films.filter(f => f.category.toLowerCase() === filmFilter.toLowerCase());
  }, [films, filmFilter]);

  const filteredUsers = useMemo(() => {
    if (userFilter === 'active') return activeUsers;
    if (userFilter === 'all') return knownUsers;
    return knownUsers.filter(u => u.role.toLowerCase() === userFilter.toLowerCase());
  }, [knownUsers, activeUsers, userFilter]);

  const NavItem = ({ id, label, icon }: { id: AdminTab, label: string, icon: React.ReactNode }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-4 px-6 py-4 transition-all border-r-4 ${
        activeTab === id 
        ? 'bg-amber-500/10 border-amber-500 text-amber-500' 
        : 'border-transparent text-neutral-500 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{label}</span>
    </button>
  );

  return (
    <div className="pt-24 min-h-screen bg-[#050505]">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row min-h-[calc(100vh-6rem)]">
        
        <aside className="w-full lg:w-64 border-r border-neutral-900 bg-black/40 backdrop-blur-xl shrink-0">
          <div className="p-8 border-b border-neutral-900 mb-4">
             <div className="text-[9px] font-bold text-amber-500 uppercase tracking-[0.4em] mb-1">Backstage Access</div>
             <h2 className="text-xl font-serif font-bold text-white tracking-tight">Command Center</h2>
          </div>
          <nav className="space-y-1">
            <NavItem id="overview" label="Overview" icon={<Icons.Trophy className="w-4 h-4" />} />
            <NavItem id="films" label="Cinema Library" icon={<Icons.Film className="w-4 h-4" />} />
            <NavItem id="competitions" label="Contests" icon={<Icons.Star className="w-4 h-4" />} />
            <NavItem id="ads" label="Ad Banners" icon={<Icons.Share className="w-4 h-4" />} />
            <NavItem id="interviews" label="Visionary Spotlight" icon={<Icons.Mic className="w-4 h-4" />} />
            <NavItem id="users" label="Visionaries" icon={<Icons.Ovation className="w-4 h-4" />} />
          </nav>
        </aside>

        <main className="flex-grow p-4 lg:p-12 animate-in fade-in slide-in-from-right-4 duration-700 overflow-hidden">
          
          {activeTab === 'overview' && (
            <div className="space-y-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Total Submissions", val: films.length, sub: "Verified Works", icon: <Icons.Film className="w-5 h-5" /> },
                  { label: "Active Presence", val: activeUsers.length, sub: "Online Now", icon: <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> },
                  { label: "Community Size", val: knownUsers.length, sub: "Registered Users", icon: <Icons.Ovation className="w-5 h-5" /> },
                  { label: "Active Spotlight", val: interviews.length, sub: "Visionary Interviews", icon: <Icons.Mic className="w-5 h-5 text-amber-500" /> }
                ].map((s, i) => (
                  <div key={i} className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-[2rem] shadow-xl hover:border-amber-500/20 transition-all">
                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center mb-4 border border-neutral-800">
                       {s.icon}
                    </div>
                    <div className="text-3xl font-serif font-bold text-white mb-1">{s.val}</div>
                    <p className="text-[8px] text-neutral-600 font-bold uppercase tracking-widest">{s.label}</p>
                    <p className="text-[10px] text-neutral-500 mt-2 font-medium">{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'films' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                <h3 className="text-2xl font-serif font-bold text-white">Exhibition Management</h3>
                <div className="flex flex-wrap items-center gap-2 p-2 bg-neutral-900 rounded-full border border-neutral-800">
                   {['all', 'selection', 'premiere', 'contest'].map(cat => (
                     <button key={cat} onClick={() => setFilmFilter(cat)} className={`px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${filmFilter === cat ? 'bg-amber-500 text-black shadow-lg' : 'text-neutral-500 hover:text-white'}`}>{cat}</button>
                   ))}
                </div>
              </div>
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-[2rem] overflow-x-auto shadow-inner">
                <table className="w-full text-left min-w-[800px]">
                  <thead><tr className="bg-black/60 border-b border-neutral-800 text-[9px] font-bold text-neutral-600 uppercase tracking-widest"><th className="px-8 py-4">Title</th><th className="px-6 py-4">Status / Hall</th><th className="px-6 py-4 text-center">Reactions</th><th className="px-8 py-4 text-right">Actions</th></tr></thead>
                  <tbody className="divide-y divide-neutral-800/40">
                    {filteredFilms.length > 0 ? filteredFilms.map(f => (
                      <tr key={f.id} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <img src={f.thumbnailUrl} className="w-12 h-8 rounded object-cover border border-neutral-800" alt="" />
                            <div>
                               <div className="text-xs font-bold text-white">{f.title}</div>
                               <div className="text-[9px] text-neutral-500 italic">Creator: {f.creatorId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <select 
                            value={f.category} 
                            onChange={(e) => updateFilm(f.id, { category: e.target.value as FilmCategory })} 
                            className="bg-black/40 border border-neutral-800 rounded-lg px-3 py-1.5 text-[10px] font-bold text-amber-500/80 outline-none hover:border-amber-500/30 transition-all cursor-pointer"
                          >
                            {Object.values(FilmCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                          </select>
                        </td>
                        <td className="px-6 py-5 text-center">
                            <div className="text-xs text-white font-bold">{f.votes} <span className="text-[9px] text-neutral-500">votes</span></div>
                            <div className="text-[9px] text-amber-500/70">{f.score?.toFixed(1) || 'N/A'} score</div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button onClick={() => setPlayingFilm(f)} className="p-2 text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors">
                              <Icons.Film className="w-4 h-4" />
                            </button>
                            <button onClick={() => deleteFilm(f.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="py-20 text-center text-neutral-700 font-serif italic">The screening room is currently empty.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'competitions' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-neutral-900 pb-8 gap-4">
                 <div>
                    <h3 className="text-3xl font-serif font-bold gold-text">Active Prize Pools</h3>
                    <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest mt-1">Regulate entry fees and jury rewards</p>
                 </div>
                 <button onClick={() => handleOpenCompModal()} className="w-full sm:w-auto px-8 py-3 bg-amber-500 gold-glow rounded-xl text-black font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all">Create New Contest</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {competitions.map(comp => (
                  <div key={comp.id} className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6 hover:border-amber-500/30 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center border border-neutral-800 group-hover:border-amber-500/30 transition-all">
                        <Icons.Trophy className="w-5 h-5 text-amber-500" />
                      </div>
                      <span className="text-[9px] font-bold text-neutral-600 bg-black/40 px-2 py-1 rounded border border-neutral-800">₹{comp.entryFee} Entry Fee</span>
                    </div>
                    <h4 className="text-lg font-serif font-bold text-white mb-2">{comp.name}</h4>
                    <p className="text-[10px] text-neutral-400 line-clamp-2 mb-4 italic">"{comp.description}"</p>
                    <div className="py-3 border-y border-neutral-800/40 mb-4">
                       <div className="text-[8px] text-neutral-600 font-bold uppercase tracking-widest">Grand Prize Pool</div>
                       <div className="text-base font-bold text-amber-500">{comp.prize}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenCompModal(comp)} className="flex-1 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-[9px] font-bold uppercase text-white transition-all">Settings</button>
                      <button onClick={() => deleteCompetition(comp.id)} className="p-2 bg-red-900/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-all">Del</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ads' && (
            <div className="space-y-8">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-neutral-900 pb-8 gap-4">
                  <h3 className="text-3xl font-serif font-bold gold-text">Promotional Banners</h3>
                  <button onClick={() => handleOpenAdModal()} className="w-full sm:w-auto px-8 py-3 bg-red-carpet gold-glow rounded-xl text-white font-bold text-[10px] uppercase tracking-widest">Add New Banner</button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {advertisements.map(ad => (
                    <div key={ad.id} className={`bg-neutral-900/60 border rounded-3xl overflow-hidden group transition-all shadow-xl ${ad.isActive ? 'border-amber-500/30' : 'border-neutral-800 opacity-60'}`}>
                      {ad.imageUrl && (
                        <div className="h-28 overflow-hidden relative">
                          <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        </div>
                      )}
                      <div className="p-6 space-y-4">
                        <div className="flex justify-between items-start">
                           <h4 className="font-bold text-white text-sm">{ad.title}</h4>
                           <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${ad.isActive ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>{ad.isActive ? 'Active' : 'Inactive'}</span>
                        </div>
                        <p className="text-[10px] text-neutral-500 line-clamp-2">{ad.description}</p>
                        <div className="flex gap-2 pt-2">
                          <button onClick={() => updateAd(ad.id, { isActive: !ad.isActive })} className="flex-grow py-2 bg-neutral-800 rounded-xl text-[9px] font-bold uppercase text-amber-500 hover:bg-neutral-700 transition-colors">
                            {ad.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button onClick={() => handleOpenAdModal(ad)} className="p-2 bg-neutral-800 rounded-xl text-neutral-400">Edit</button>
                          <button onClick={() => deleteAd(ad.id)} className="p-2 bg-red-900/10 text-red-500 rounded-xl">Del</button>
                        </div>
                      </div>
                    </div>
                 ))}
               </div>
            </div>
          )}

          {activeTab === 'interviews' && (
            <div className="space-y-8">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-neutral-900 pb-8 gap-4">
                  <div>
                    <h3 className="text-3xl font-serif font-bold gold-text">Visionary Spotlight</h3>
                    <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest mt-1">Manage director masterclasses and interviews</p>
                  </div>
                  <button onClick={() => handleOpenInterviewModal()} className="w-full sm:w-auto px-8 py-3 bg-red-carpet gold-glow rounded-xl text-white font-bold text-[10px] uppercase tracking-widest">Add Masterclass</button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {interviews.map(i => (
                    <div key={i.id} className="bg-neutral-900/60 border border-neutral-800 rounded-3xl overflow-hidden group transition-all shadow-xl hover:border-amber-500/30">
                      <div className="h-32 overflow-hidden relative">
                        <img src={i.portraitUrl} alt={i.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                        <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-amber-500 rounded text-[8px] font-bold text-black uppercase">{i.expertise}</div>
                      </div>
                      <div className="p-5 space-y-3">
                        <h4 className="font-bold text-white text-base">{i.name}</h4>
                        <p className="text-[10px] text-neutral-500 line-clamp-2 italic">"{i.quote}"</p>
                        <div className="flex gap-2 pt-2">
                          <button onClick={() => handleOpenInterviewModal(i)} className="flex-grow py-2 bg-neutral-800 rounded-xl text-[9px] font-bold uppercase text-amber-500 hover:bg-neutral-700 transition-colors">Edit Masterclass</button>
                          <button onClick={() => deleteInterview(i.id)} className="p-2 bg-red-900/10 text-red-500 rounded-xl">Del</button>
                        </div>
                      </div>
                    </div>
                 ))}
               </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                <h3 className="text-2xl font-serif font-bold text-white">Visionary Directory</h3>
                <div className="flex flex-wrap items-center gap-2 p-2 bg-neutral-900 rounded-full border border-neutral-800 overflow-x-auto max-w-full">
                   {['all', 'active', 'audience', 'creator', 'judge', 'admin'].map(role => (
                     <button 
                       key={role} 
                       onClick={() => setUserFilter(role)}
                       className={`px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                         userFilter === role ? 'bg-amber-500 text-black shadow-lg' : 'text-neutral-500 hover:text-white'
                       }`}
                     >
                       {role}
                     </button>
                   ))}
                </div>
              </div>
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-[2rem] overflow-x-auto shadow-inner">
                <table className="w-full text-left min-w-[850px]">
                  <thead>
                    <tr className="bg-black/60 border-b border-neutral-800 text-[9px] font-bold text-neutral-600 uppercase tracking-widest">
                      <th className="px-8 py-4">Visionary Profile</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Identity Status</th>
                      <th className="px-8 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/40">
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-3">
                            <img src={u.avatarUrl} className="w-8 h-8 rounded-full border border-neutral-800" alt="" />
                            <div>
                               <div className="text-xs font-bold text-white">{u.name}</div>
                               <div className="text-[9px] text-neutral-600">ID: {u.principal}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] font-bold text-amber-500/70 uppercase tracking-widest">{u.role}</span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2">
                             <span className={`w-1.5 h-1.5 rounded-full ${activeUsers.some(active => active.id === u.id) ? 'bg-green-500 animate-pulse' : 'bg-neutral-700'}`}></span>
                             <span className="text-[10px] text-neutral-500 font-mono">Last seen {new Date(u.lastActive).toLocaleTimeString()}</span>
                           </div>
                        </td>
                        <td className="px-8 py-4 text-right">
                          <button onClick={() => deleteUser(u.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* AD MODAL */}
      <BaseModal isOpen={isAdModalOpen} onClose={() => setIsAdModalOpen(false)} title={editingAd ? "Modify Promotional Banner" : "Create New Banner"}>
        <form onSubmit={handleAdSubmit} className="space-y-5 py-2">
           <div>
              <label className="block text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1.5 ml-1">Banner Title</label>
              <input required value={adForm.title} onChange={e => setAdForm({...adForm, title: e.target.value})} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500" placeholder="e.g. Join the 2024 Gala" />
           </div>
           <div>
              <label className="block text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1.5 ml-1">Subtitle / Callout</label>
              <input required value={adForm.subtitle} onChange={e => setAdForm({...adForm, subtitle: e.target.value})} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500" placeholder="e.g. LIVE AUDITIONS" />
           </div>
           <div>
              <label className="block text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1.5 ml-1">Banner Image URL</label>
              <input value={adForm.imageUrl || ''} onChange={e => setAdForm({...adForm, imageUrl: e.target.value})} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500" placeholder="https://image-url.com/poster.jpg" />
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1.5 ml-1">Destination</label>
                <select value={adForm.targetForm} onChange={e => setAdForm({...adForm, targetForm: e.target.value as any})} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500">
                    <option value="competition">Competition Hall</option>
                    <option value="premiere">Premiere Booking</option>
                    <option value="festival">Festival Submission</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1.5 ml-1">Action Button</label>
                <input value={adForm.actionText} onChange={e => setAdForm({...adForm, actionText: e.target.value})} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500" placeholder="e.g. Sign Up" />
              </div>
           </div>
           <div>
              <label className="block text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1.5 ml-1">Marketing Description</label>
              <textarea required value={adForm.description} onChange={e => setAdForm({...adForm, description: e.target.value})} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white h-24 outline-none focus:border-amber-500" placeholder="Elevate the festival experience..." />
           </div>
           <button type="submit" className="w-full py-4 bg-red-carpet rounded-xl text-white font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition-all">Save Banner Data</button>
        </form>
      </BaseModal>

      {/* COMP MODAL */}
      <BaseModal isOpen={isCompModalOpen} onClose={() => setIsCompModalOpen(false)} title={editingComp ? "Update Contest Specs" : "Launch Global Contest"}>
        <form onSubmit={handleCompSubmit} className="space-y-5 py-2">
           <input required value={compForm.name} onChange={e => setCompForm({...compForm, name: e.target.value})} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500" placeholder="Contest Name" />
           <div className="grid grid-cols-2 gap-4">
              <input required value={compForm.prize} onChange={e => setCompForm({...compForm, prize: e.target.value})} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500" placeholder="Prize (e.g. ₹1M)" />
              <input required type="number" value={compForm.entryFee} onChange={e => setCompForm({...compForm, entryFee: parseInt(e.target.value) || 0})} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500" placeholder="Entry Fee (INR)" />
           </div>
           <textarea required value={compForm.description} onChange={e => setCompForm({...compForm, description: e.target.value})} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white h-24 outline-none focus:border-amber-500" placeholder="Judicial guidelines and themes..." />
           <button type="submit" className="w-full py-4 bg-amber-500 text-black font-bold uppercase tracking-widest text-[10px] rounded-xl hover:scale-105 transition-all">Initialize Contest</button>
        </form>
      </BaseModal>

      {/* INTERVIEW MODAL */}
      <BaseModal isOpen={isInterviewModalOpen} onClose={() => setIsInterviewModalOpen(false)} title={editingInterview ? "Update Spotlight Interview" : "Add New Visionary Interview"}>
        <form onSubmit={handleInterviewSubmit} className="space-y-5 py-2">
           <div>
              <label className="block text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1.5 ml-1">Director Name</label>
              <input required value={interviewForm.name} onChange={e => setInterviewForm({...interviewForm, name: e.target.value})} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500" placeholder="e.g. Christopher Nolan" />
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1.5 ml-1">Expertise Tag</label>
                <input required value={interviewForm.expertise} onChange={e => setInterviewForm({...interviewForm, expertise: e.target.value})} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500" placeholder="e.g. Master of Human Narrative" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1.5 ml-1">Associated Film</label>
                <input required value={interviewForm.filmTitle} onChange={e => setInterviewForm({...interviewForm, filmTitle: e.target.value})} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500" placeholder="e.g. Tenet" />
              </div>
           </div>
           <div>
              <label className="block text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1.5 ml-1">Portrait Image URL</label>
              <input required value={interviewForm.portraitUrl} onChange={e => setInterviewForm({...interviewForm, portraitUrl: e.target.value})} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500" placeholder="https://..." />
           </div>
           <div>
              <label className="block text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1.5 ml-1">YouTube Video URL</label>
              <input required value={interviewForm.videoUrl} onChange={e => setInterviewForm({...interviewForm, videoUrl: e.target.value})} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500" placeholder="https://youtube.com/..." />
           </div>
           <div>
              <label className="block text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1.5 ml-1">Cinematic Quote</label>
              <textarea required value={interviewForm.quote} onChange={e => setInterviewForm({...interviewForm, quote: e.target.value})} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white h-24 outline-none focus:border-amber-500" placeholder="A profound statement about cinema..." />
           </div>
           <button type="submit" className="w-full py-4 bg-red-carpet gold-glow rounded-xl text-white font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition-all">Save Interview Profile</button>
        </form>
      </BaseModal>

      <VideoPlayerModal film={playingFilm} isOpen={!!playingFilm} onClose={() => setPlayingFilm(null)} />
    </div>
  );
};

export default Admin;
