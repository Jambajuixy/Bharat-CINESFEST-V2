
import React from 'react';
import { DirectorInterview, Competition, Film, FilmCategory } from './types';

export const COMPETITIONS: Competition[] = [
  { id: 'indie-2024', name: 'Global Indie Gems', description: 'Celebrating small crews with big hearts.', prize: '₹1,00,000 INR', entryFee: 2000, endsAt: '2024-12-31T23:59:59Z' },
  { id: 'sci-fi-shorts', name: 'Future Visions', description: 'The best in sci-fi and speculative fiction.', prize: '₹1,00,000 INR', entryFee: 1500, endsAt: '2024-11-15T23:59:59Z' },
  { id: 'docu-series', name: 'Real Life Frames', description: 'Brave stories from the real world.', prize: '₹1,00,000 INR', entryFee: 2500, endsAt: '2024-10-31T23:59:59Z' }
];

export const FEATURED_INTERVIEWS: DirectorInterview[] = [
  {
    id: 'int-1',
    name: 'Aarav Sharma',
    portraitUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
    quote: "Cinema isn't just about what you see; it's about the silence you feel between the frames.",
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    expertise: 'Master of Human Narrative',
    filmTitle: 'The Silent Monsoon'
  },
  {
    id: 'int-2',
    name: 'Elena Vance',
    portraitUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800',
    quote: "AI is the paintbrush of the 21st century. It doesn't replace the artist; it expands the canvas.",
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    expertise: 'AI Cinematography Pioneer',
    filmTitle: 'Neural Dreams'
  }
];

export const TEST_FILMS: Film[] = [
  // --- HUMAN HALL ---
  {
    id: 'film-h1',
    creatorId: 'dir-01',
    title: 'The Last Artisan',
    description: 'A poignant look at the dying art of hand-painted cinema posters in the heart of Mumbai.',
    youtubeUrl: 'https://www.youtube.com/watch?v=668nUCeB8XY',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=1200',
    uploadDate: '2024-03-01T10:00:00Z',
    category: FilmCategory.SELECTION,
    genre: 'Drama',
    votes: 124,
    ratingCount: 45,
    score: 4.8,
    comments: [],
    isAiGenerated: false
  },
  {
    id: 'film-h2',
    creatorId: 'u-abc123',
    title: 'Ganga\'s Echo',
    description: 'A cinematic journey through the spiritual and environmental heart of the Ganges river.',
    youtubeUrl: 'https://www.youtube.com/watch?v=C6pP9H_xG3k',
    thumbnailUrl: 'https://images.unsplash.com/photo-1588180864334-959735a8999f?auto=format&fit=crop&q=80&w=1200',
    uploadDate: '2024-03-05T14:30:00Z',
    category: FilmCategory.PREMIERE,
    genre: 'Documentary',
    votes: 560,
    ratingCount: 120,
    score: 4.9,
    comments: [],
    isAiGenerated: false
  },
  {
    id: 'film-h3',
    creatorId: 'u-def456',
    title: 'Midnight in Mumbai',
    description: 'A high-octane noir thriller set in the rain-slicked streets of a city that never sleeps.',
    youtubeUrl: 'https://www.youtube.com/watch?v=yW8nS-r9R8I',
    thumbnailUrl: 'https://images.unsplash.com/photo-1576085898323-2181577e3244?auto=format&fit=crop&q=80&w=1200',
    uploadDate: '2024-03-10T18:00:00Z',
    category: FilmCategory.CONTEST,
    genre: 'Noir',
    votes: 342,
    ratingCount: 88,
    score: 4.5,
    isContestActive: true,
    comments: [],
    isAiGenerated: false
  },
  {
    id: 'film-h4',
    creatorId: 'dir-01',
    title: 'Bazaar of Shadows',
    description: 'When an antique dealer finds a camera that captures the past, his life becomes a mystery.',
    youtubeUrl: 'https://www.youtube.com/watch?v=8Xq7I-UAt54',
    thumbnailUrl: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&q=80&w=1200',
    uploadDate: '2024-02-15T09:00:00Z',
    category: FilmCategory.SELECTION,
    genre: 'Mystery',
    votes: 89,
    ratingCount: 22,
    score: 4.2,
    comments: [],
    isAiGenerated: false
  },

  // --- AI HALL ---
  {
    id: 'film-a1',
    creatorId: 'visionary',
    title: 'Synthetica',
    description: 'A neural-generated odyssey through a world where dreams and digital signals collide.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200',
    uploadDate: '2024-03-12T11:00:00Z',
    category: FilmCategory.SELECTION,
    genre: 'Sci-Fi',
    votes: 210,
    ratingCount: 67,
    score: 4.7,
    comments: [],
    isAiGenerated: true
  },
  {
    id: 'film-a2',
    creatorId: 'u-ai-artist',
    title: 'Coded Dreams',
    description: 'The first full-length AI premiere exploring the subconscious of an artificial mind.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1200',
    uploadDate: '2024-03-20T20:00:00Z',
    category: FilmCategory.PREMIERE,
    genre: 'Experimental',
    votes: 890,
    ratingCount: 210,
    score: 4.9,
    comments: [],
    isAiGenerated: true
  },
  {
    id: 'film-a3',
    creatorId: 'u-neural',
    title: 'Neural Odyssey',
    description: 'Competing in the AI Hall of Fame, this piece showcases the limits of generative cinematography.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
    uploadDate: '2024-03-15T15:00:00Z',
    category: FilmCategory.CONTEST,
    genre: 'Sci-Fi',
    votes: 423,
    ratingCount: 95,
    score: 4.6,
    isContestActive: true,
    comments: [],
    isAiGenerated: true
  },
  {
    id: 'film-a4',
    creatorId: 'visionary',
    title: 'Digital Soul',
    description: 'An abstract exploration of what it means to be alive in an era of pure data.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1635332043388-5a4141119730?auto=format&fit=crop&q=80&w=1200',
    uploadDate: '2024-01-10T12:00:00Z',
    category: FilmCategory.SELECTION,
    genre: 'Abstract',
    votes: 156,
    ratingCount: 40,
    score: 4.3,
    comments: [],
    isAiGenerated: true
  }
];

export const Icons = {
  Trophy: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  Camera: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  Star: ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ),
  Share: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  ),
  Twitter: ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    </svg>
  ),
  Facebook: ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  Link: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  ),
  Film: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4" />
    </svg>
  ),
  Applause: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7 7m-7-7l-2.828 2.828M11 11L3 3m8 8L3 11" />
    </svg>
  ),
  Ovation: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Mic: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  )
};
