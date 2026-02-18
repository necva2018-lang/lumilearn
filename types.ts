export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoId: string; // Changed from youtubeId to videoId to be generic
  isFree: boolean;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: {
    name: string;
    avatar: string;
    bio: string;
  };
  price: number;
  originalPrice: number;
  rating: number;
  students: number;
  views: number;
  category: string;
  level: string;
  tags: string[];
  modules: Module[];
  updatedAt: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}