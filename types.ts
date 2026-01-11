
export enum ChatbotType {
  NEUTRAL = 'neutral',
  CULTURALLY_SENSITIVE = 'culturally_sensitive'
}

export interface Message {
  id: string;
  role: 'user' | 'model' | 'system' | 'crisis';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  type: ChatbotType;
  messages: Message[];
  isLocked: boolean;
  startTime: string;
}

export interface AppState {
  view: 'landing' | 'consent' | 'chat';
  currentType: ChatbotType | null;
  currentSession: ChatSession | null;
}
