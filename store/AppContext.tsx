
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
  register: (data: { name: string; bio: string; role: UserRole; gender: string; identifier: string }) => void;
  signIn: (identifier: string) => boolean;
  updateUser: (data: Partial<User>) => void;
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

const STORAGE_KEY_USERS = 'cinefest_users_metadata_v2';
const STORAGE_KEY_SESSION = 'cinefest_session_id_v2';
const STORAGE_KEY_FILMS = 'cinefest_films_metadata_v2';
const STORAGE_KEY_VOTES = 'cinefest_user_reactions_v2';
const STORAGE_KEY_RATINGS = 'cinefest_user_star_ratings_v2';
const STORAGE_KEY_COMPS = 'cinefest_competitions_v2';
const STORAGE_KEY_ADS = 'cinefest_ads_v2';
const STORAGE_KEY_INTERVIEWS = 'cinefest_interviews_v2';

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

  // Hydrate State
  useEffect(() => {
    const savedUsers = localStorage.getItem(STORAGE_KEY_USERS);
    const initialUsers = savedUsers ? JSON.parse(savedUsers) : [
      {
        id: 'dir-01',
        name: 'Festival Director',
        bio: 'Chief Curator of Bharat CINEFEST.',
        role: UserRole.ADMIN,
        principal: 'admin-access-prime',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Director',
        lastActive: new Date().toISOString(),
        joinedAt: '2023-01-01T09:00:00Z'
      }
    ];
    setKnownUsers(initialUsers);

    const sessionId = localStorage.getItem(STORAGE_KEY_SESSION);
    if (sessionId) {
      const activeUser = initialUsers.find((u: User) => u.id === sessionId);
      if (activeUser) setUser(activeUser);
    }

    const savedFilms = localStorage.getItem(STORAGE_KEY_FILMS);
    setFilms(savedFilms ? JSON.parse(savedFilms) : TEST_FILMS);

    const savedVotes = localStorage.getItem(STORAGE_KEY_VOTES);
    if (savedVotes) setVotedFilmIds(JSON.parse(savedVotes));

    const savedRatings = localStorage.getItem(STORAGE_KEY_RATINGS);
    if (savedRatings) setUserRatings(JSON.parse(savedRatings));

    const savedComps = localStorage.getItem(STORAGE_KEY_COMPS);
    setCompetitions(savedComps ? JSON.parse(savedComps) : INITIAL_COMPETITIONS);

    const savedAds = localStorage.getItem(STORAGE_KEY_ADS);
    setAdvertisements(savedAds ? JSON.parse(savedAds) : [
      {
        id: 'ad-contest',
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
        id: 'ad-premiere',
        title: 'The Silent Monsoon',
        subtitle: 'UPCOMING PREMIERE',
        description: 'Book your seat for the grand live screening of the years most anticipated short.',
        actionText: 'Reserve My Slot',
        entryFee: 800,
        isActive: true,
        targetForm: 'premiere',
        videoUrl: 'https://www.youtube.com/watch?v=yW8nS-r9R8I',
        imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1600'
      },
      {
        id: 'ad-trailer',
        title: 'Neural Dreams Vol. 2',
        subtitle: 'TRAILER PREVIEW',
        description: 'Watch the official trailer for the leading entry in our AI Hall of Fame.',
        actionText: 'Watch Full Trailer',
        isActive: true,
        targetForm: 'festival',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        imageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1600'
      }
    ]);

    const savedInterviews = localStorage.getItem(STORAGE_KEY_INTERVIEWS);
    setInterviews(savedInterviews ? JSON.parse(savedInterviews) : INITIAL_INTERVIEWS);
  }, []);

  // Persistence Hooks
  useEffect(() => { localStorage.setItem(STORAGE_KEY_FILMS, JSON.stringify(films)); }, [films]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_VOTES, JSON.stringify(votedFilmIds)); }, [votedFilmIds]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_RATINGS, JSON.stringify(userRatings)); }, [userRatings]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(knownUsers)); }, [knownUsers]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_ADS, JSON.stringify(advertisements)); }, [advertisements]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_COMPS, JSON.stringify(competitions)); }, [competitions]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_INTERVIEWS, JSON.stringify(interviews)); }, [interviews]);

  const login = useCallback(() => setShowAuthModal(true), []);

  const register = useCallback((data: { name: string; bio: string; role: UserRole; gender: string; identifier: string }) => {
    setIsAuthenticating(true);
    const normalizedId = data.identifier.trim().toLowerCase();
    
    setTimeout(() => {
      const newUser: User = {
        id: 'u-' + Math.random().toString(36).substr(2, 6),
        name: data.name,
        bio: data.bio,
        role: data.role,
        gender: data.gender,
        principal: normalizedId,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
        lastActive: new Date().toISOString(),
        joinedAt: new Date().toISOString()
      };
      
      setKnownUsers(prev => [...prev, newUser]);
      localStorage.setItem(STORAGE_KEY_SESSION, newUser.id);
      setUser(newUser);
      setIsAuthenticating(false);
      setShowAuthModal(false);
    }, 1000);
  }, []);

  const signIn = useCallback((identifier: string): boolean => {
    const normalizedId = identifier.trim().toLowerCase();
    const existingUser = knownUsers.find(u => u.principal.toLowerCase() === normalizedId);
    
    if (existingUser) {
      setUser(existingUser);
      localStorage.setItem(STORAGE_KEY_SESSION, existingUser.id);
      setShowAuthModal(false);
      return true;
    }
    return false;
  }, [knownUsers]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY_SESSION);
    window.location.hash = '#/';
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      setKnownUsers(all => all.map(u => u.id === prev.id ? updated : u));
      return updated;
    });
  }, []);

  const deleteUser = useCallback((id: string) => {
    setKnownUsers(prev => prev.filter(u => u.id !== id));
  }, []);

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
      login, logout, setShowAuthModal, register, signIn, updateUser, deleteUser, addFilm, updateFilm, deleteFilm, toggleContestStatus, 
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
