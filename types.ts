
export enum UserRole {
  CREATOR = 'Creator',
  JUDGE = 'Judge',
  AUDIENCE = 'Audience',
  ADMIN = 'Admin'
}

export enum FilmCategory {
  SELECTION = 'Selection',
  PREMIERE = 'Premiere',
  CONTEST = 'Contest'
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  date: string;
}

export interface User {
  id: string;
  name: string;
  bio: string;
  role: UserRole;
  gender?: string;
  email: string;
  phone: string;
  principal: string;
  avatarUrl?: string;
  website?: string;
  lastActive: string;
  joinedAt: string;
}

export interface Film {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  uploadDate: string;
  status?: string;
  category: FilmCategory;
  genre: string;
  score?: number;
  votes: number;
  ratingCount: number;
  isContestActive?: boolean;
  comments: Comment[];
  isAiGenerated?: boolean;
}

export interface DirectorInterview {
  id: string;
  name: string;
  portraitUrl: string;
  quote: string;
  videoUrl: string;
  expertise: string;
  filmTitle: string;
}

export interface Competition {
  id: string;
  name: string;
  description: string;
  prize: string;
  entryFee: number;
  endsAt: string;
  imageUrl?: string;
  juryIds: string[]; // Linked jury member IDs
}

export interface Advertisement {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  actionText: string;
  prize?: string;
  entryFee?: number;
  isActive: boolean;
  imageUrl?: string;
  videoUrl?: string;
  targetForm?: 'festival' | 'competition' | 'premiere';
}

export interface PaymentRecord {
  id: string;
  userId: string;
  amount: number;
  type: 'festival' | 'competition' | 'premiere';
  date: string;
}
