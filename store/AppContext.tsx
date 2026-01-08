
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Film, UserRole, PaymentRecord, FilmCategory, Comment, Competition, Advertisement, DirectorInterview } from '../types';
import { COMPETITIONS as INITIAL_COMPETITIONS, FEATURED_INTERVIEWS as INITIAL_INTERVIEWS, TEST_FILMS } from '../constants';

interface AppState {
  user: User | null;
  films: Film[];
  competitions: Competition[];
  advertisements: Advertisement[];
  interviews: DirectorInterview[];
  payments: PaymentRecord[];
  votedFilmIds: string[];
  userRatings: Record<string, number>;
  isAuthenticating: boolean;
  showAuthModal: boolean;
  knownUsers: User[];
  login: () => void;
  logout: () => void;
  setShowAuthModal: (show: boolean) => void;
  register: (data: { name: string; bio: string; role: UserRole; gender: string; email: string; phone: string; identifier: string; website?: string }) => void;
  signIn: (identifier: string) => boolean;
  updateUser: (data: Partial<User>) => void;
  adminUpdateUser: (userId: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addFilm: (film: Omit<Film, 'id' | 'uploadDate' | 'votes' | 'comments' | 'ratingCount' | 'score'>) => void;
  updateFilm: (id: string, data: Partial<Film>) => void;
  deleteFilm: (filmId: string) => void;
  toggleContestStatus: (filmId: string) => void;
  submitVote: (filmId: string, amount?: number) => void;
  addComment: (filmId: string, text: string) => void;
  addRating: (filmId: string, rating: number) => void;
  addCompetition: (comp: Omit<Competition, 'id'>) => void;
  updateCompetition: (id: string, comp: Partial<Competition>) => void;
  deleteCompetition: (id: string) => void;
  addAd: (ad: Omit<Advertisement, 'id'>) => void;
  updateAd: (id: string, ad: Partial<Advertisement>) => void;
  deleteAd: (id: string) => void;
  addInterview: (interview: Omit<DirectorInterview, 'id'>) => void;
  updateInterview: (id: string, data: Partial<DirectorInterview>) => void;
  deleteInterview: (id: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'cinefest_users_metadata_v5',
  SESSION: 'cinefest_session_id_v5',
  FILMS: 'cinefest_films_metadata_v5',
  VOTES: 'cinefest_user_reactions_v5',
  RATINGS: 'cinefest_user_star_ratings_v5',
  COMPS: 'cinefest_competitions_v5',
  ADS: 'cinefest_ads_v5',
  INTERVIEWS: 'cinefest_interviews_v5',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [films, setFilms] = useState<Film[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [interviews, setInterviews] = useState<DirectorInterview[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [votedFilmIds, setVotedFilmIds] = useState<string[]>([]);
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [knownUsers, setKnownUsers] = useState<User[]>([]);

  useEffect(() => {
    const hydrate = <T,>(key: string, fallback: T): T => {
      try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
      } catch (e) {
        console.error(`Hydration error for ${key}:`, e);
        return fallback;
      }
    };

    const initialUsers = hydrate(STORAGE_KEYS.USERS, [
      {
        id: 'dir-01',
        name: 'Festival Director',
        bio: 'Chief Curator of Bharat CINEFEST. Overseeing human and AI expressions.',
        role: UserRole.ADMIN,
        email: 'director@bharatcinefest.com',
        phone: '+91 99999 88888',
        principal: 'admin-access-prime',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Director',
        lastActive: new Date().toISOString(),
        joinedAt: '2023-01-01T09:00:00Z'
      },
      {
        id: 'jury-01',
        name: 'Arjun Mehra',
        bio: 'Award-winning cinematographer and documentary filmmaker with 20 years of experience.',
        role: UserRole.JUDGE,
        email: 'arjun@cinema.com',
        phone: '+91 98888 77777',
        principal: 'jury-arjun',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun',
        lastActive: new Date().toISOString(),
        joinedAt: '2023-05-01T10:00:00Z'
      }
    ]);
    setKnownUsers(initialUsers);

    const sessionId = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (sessionId) {
      const activeUser = initialUsers.find((u: User) => u.id === sessionId);
      if (activeUser) {
        setUser(activeUser);
        const now = new Date().toISOString();
        setKnownUsers(all => all.map(u => u.id === activeUser.id ? { ...u, lastActive: now } : u));
      }
    }

    setFilms(hydrate(STORAGE_KEYS.FILMS, TEST_FILMS));
    setVotedFilmIds(hydrate(STORAGE_KEYS.VOTES, []));
    setUserRatings(hydrate(STORAGE_KEYS.RATINGS, {}));
    
    const compsWithJury = INITIAL_COMPETITIONS.map(c => ({
      ...c,
      juryIds: c.juryIds || ['dir-01', 'jury-01']
    }));
    setCompetitions(hydrate(STORAGE_KEYS.COMPS, compsWithJury));
    
    setInterviews(hydrate(STORAGE_KEYS.INTERVIEWS, INITIAL_INTERVIEWS));
    setAdvertisements(hydrate(STORAGE_KEYS.ADS, [
      {
        id: 'ad-1',
        title: 'Global Indie Gems',
        subtitle: 'CASH PRIZE REVEALED',
        description: 'Compete for the ultimate ₹1,00,000 prize pool and global recognition.',
        actionText: 'Enter Competition',
        prize: '₹1,00,000 INR',
        entryFee: 2000,
        isActive: true,
        targetForm: 'competition',
        imageUrl: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&q=80&w=1600'
      },
      {
        id: 'ad-2',
        title: 'Neural Dreams Vol. 1',
        subtitle: 'AI CINEMA SPECIAL',
        description: 'Witness the frontier of generative cinematography in our specialized AI Hall.',
        actionText: 'Explore AI Hall',
        isActive: true,
        targetForm: 'festival',
        imageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1600'
      },
      {
        id: 'ad-3',
        title: 'Premiere Night Schedule',
        subtitle: 'RESERVE YOUR SEAT',
        description: 'Book exclusive screening slots for your project and host a live digital premiere.',
        actionText: 'Book Premiere',
        isActive: true,
        targetForm: 'premiere',
        imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644ef7467?auto=format&fit=crop&q=80&w=1600'
      }
    ]));
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(knownUsers));
        localStorage.setItem(STORAGE_KEYS.FILMS, JSON.stringify(films));
        localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify(votedFilmIds));
        localStorage.setItem(STORAGE_KEYS.RATINGS, JSON.stringify(userRatings));
        localStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(advertisements));
        localStorage.setItem(STORAGE_KEYS.COMPS, JSON.stringify(competitions));
        localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify(interviews));
      } catch (e) {
        console.warn("Storage persistence warning (likely quota limit reached). Purging non-essential metadata.");
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [films, votedFilmIds, userRatings, knownUsers, advertisements, competitions, interviews]);

  const login = useCallback(() => setShowAuthModal(true), []);

  const register = useCallback((data: any) => {
    setIsAuthenticating(true);
    const identifier = data.identifier.trim().toLowerCase();
    
    // Simulate network delay for non-admin creation
    const delay = data.role === UserRole.JUDGE ? 0 : 1000;
    
    setTimeout(() => {
      const newUser: User = {
        id: 'u-' + Math.random().toString(36).substr(2, 6),
        name: data.name,
        bio: data.bio,
        role: data.role,
        gender: data.gender,
        email: data.email,
        phone: data.phone,
        website: data.website,
        principal: identifier,
        avatarUrl: data.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
        lastActive: new Date().toISOString(),
        joinedAt: new Date().toISOString()
      };
      
      setKnownUsers(prev => [...prev, newUser]);
      if (data.role !== UserRole.JUDGE) {
        localStorage.setItem(STORAGE_KEYS.SESSION, newUser.id);
        setUser(newUser);
      }
      setIsAuthenticating(false);
      setShowAuthModal(false);
    }, delay);
  }, []);

  const signIn = useCallback((identifier: string): boolean => {
    const normalizedId = identifier.trim().toLowerCase();
    const existingUser = knownUsers.find(u => u.principal.toLowerCase() === normalizedId);
    
    if (existingUser) {
      const now = new Date().toISOString();
      const updatedUser = { ...existingUser, lastActive: now };
      setKnownUsers(prev => prev.map(u => u.id === existingUser.id ? updatedUser : u));
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEYS.SESSION, updatedUser.id);
      setShowAuthModal(false);
      return true;
    }
    return false;
  }, [knownUsers]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    window.location.hash = '#/';
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...data, lastActive: new Date().toISOString() };
      setKnownUsers(all => all.map(u => u.id === prev.id ? updated : u));
      return updated;
    });
  }, []);

  const adminUpdateUser = useCallback((userId: string, data: Partial<User>) => {
    setKnownUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updated = { ...u, ...data };
        if (user?.id === userId) setUser(updated);
        return updated;
      }
      return u;
    }));
  }, [user]);

  const deleteUser = useCallback((id: string) => {
    // Also cleanup competitions if a judge is deleted
    setCompetitions(prev => prev.map(c => ({
      ...c,
      juryIds: c.juryIds.filter(jid => jid !== id)
    })));
    setKnownUsers(prev => prev.filter(u => u.id !== id));
    if (user?.id === id) logout();
  }, [user, logout]);

  const addFilm = useCallback((filmData: any) => {
    const newFilm: Film = {
      ...filmData,
      id: 'film-' + Math.random().toString(36).substr(2, 9),
      uploadDate: new Date().toISOString(),
      votes: 0,
      ratingCount: 0,
      score: 0,
      comments: []
    };
    setFilms(prev => [newFilm, ...prev]);
  }, []);

  const updateFilm = useCallback((id: string, data: Partial<Film>) => {
    setFilms(prev => prev.map(f => f.id === id ? { ...f, ...data } : f));
  }, []);

  const deleteFilm = useCallback((filmId: string) => {
    setFilms(prev => prev.filter(f => f.id !== filmId));
  }, []);

  const toggleContestStatus = useCallback((filmId: string) => {
    setFilms(prev => prev.map(f => f.id === filmId ? { ...f, isContestActive: !f.isContestActive } : f));
  }, []);

  const submitVote = useCallback((filmId: string, amount: number = 1) => {
    setFilms(prev => prev.map(f => f.id === filmId ? { ...f, votes: f.votes + (amount || 1) } : f));
    setVotedFilmIds(prev => [...new Set([...prev, filmId])]);
  }, []);

  const addComment = useCallback((filmId: string, text: string) => {
    if (!user) return;
    const newComment: Comment = {
      id: 'cmt-' + Math.random().toString(36).substr(2, 6),
      userId: user.id,
      userName: user.name,
      text,
      date: new Date().toISOString()
    };
    setFilms(prev => prev.map(f => f.id === filmId ? { ...f, comments: [newComment, ...f.comments] } : f));
  }, [user]);

  const addRating = useCallback((filmId: string, rating: number) => {
    setFilms(prev => prev.map(f => {
      if (f.id === filmId) {
        const oldCount = f.ratingCount || 0;
        const newCount = oldCount + 1;
        const currentTotal = (f.score || 0) * oldCount;
        const newScore = (currentTotal + rating) / newCount;
        return { ...f, score: Number(newScore.toFixed(1)), ratingCount: newCount };
      }
      return f;
    }));
    setUserRatings(prev => ({ ...prev, [filmId]: rating }));
  }, []);

  const addCompetition = useCallback((compData: Omit<Competition, 'id'>) => {
    const newComp = { ...compData, id: 'comp-' + Date.now() };
    setCompetitions(prev => [newComp, ...prev]);
  }, []);

  const updateCompetition = useCallback((id: string, compData: Partial<Competition>) => {
    setCompetitions(prev => prev.map(c => c.id === id ? { ...c, ...compData } : c));
  }, []);

  const deleteCompetition = useCallback((id: string) => {
    setCompetitions(prev => prev.filter(c => c.id !== id));
  }, []);

  const addAd = useCallback((adData: Omit<Advertisement, 'id'>) => {
    const newAd: Advertisement = { ...adData, id: 'ad-' + Date.now() };
    setAdvertisements(prev => [newAd, ...prev]);
  }, []);

  const updateAd = useCallback((id: string, adData: Partial<Advertisement>) => {
    setAdvertisements(prev => prev.map(a => a.id === id ? { ...a, ...adData } : a));
  }, []);

  const deleteAd = useCallback((id: string) => {
    setAdvertisements(prev => prev.filter(a => a.id !== id));
  }, []);

  const addInterview = useCallback((interviewData: Omit<DirectorInterview, 'id'>) => {
    const newInterview: DirectorInterview = { ...interviewData, id: 'int-' + Date.now() };
    setInterviews(prev => [newInterview, ...prev]);
  }, []);

  const updateInterview = useCallback((id: string, data: Partial<DirectorInterview>) => {
    setInterviews(prev => prev.map(i => i.id === id ? { ...i, ...data } : i));
  }, []);

  const deleteInterview = useCallback((id: string) => {
    setInterviews(prev => prev.filter(i => i.id !== id));
  }, []);

  return (
    <AppContext.Provider value={{
      user, films, competitions, advertisements, interviews, payments, votedFilmIds, userRatings, isAuthenticating, showAuthModal, knownUsers,
      login, logout, setShowAuthModal, register, signIn, updateUser, adminUpdateUser, deleteUser, addFilm, updateFilm, deleteFilm, toggleContestStatus, 
      submitVote, addComment, addRating, addCompetition, updateCompetition, deleteCompetition, addAd, updateAd, deleteAd,
      addInterview, updateInterview, deleteInterview
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
