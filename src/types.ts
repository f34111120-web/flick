export type Screen = 'SIGNUP' | 'HOME' | 'CHAT' | 'POST' | 'SEARCH' | 'PROFILE';

export type TransitionType = 'none' | 'push' | 'push_back' | 'slide_up' | 'slide_down';

export interface Creator {
  username: string;
  name: string;
  avatar: string; // URL or CSS gradient
  bio?: string;
  followers?: number;
  following?: number;
  work?: string;
  discipline?: string;
}

export interface Post {
  id: string;
  creator: Creator;
  image?: string;
  video?: string;
  content: string;
  tags: string[];
  likes: number;
  commentsCount: number;
  timestamp: string;
  isLiked?: boolean;
  isSaved?: boolean;
  isPrivate?: boolean;
}

export interface Message {
  id: string;
  sender: 'user' | 'other';
  text: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  partner: Creator;
  messages: Message[];
  unread: boolean;
  online: boolean;
}
