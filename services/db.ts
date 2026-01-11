
import { ChatSession, ChatbotType, Message } from '../types';

const STORAGE_KEY = 'irb_study_chats';

export const db = {
  saveSession: (session: ChatSession) => {
    const sessions = db.getAllSessions();
    const index = sessions.findIndex(s => s.id === session.id);
    if (index > -1) {
      sessions[index] = session;
    } else {
      sessions.push(session);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  },

  getSession: (id: string): ChatSession | null => {
    const sessions = db.getAllSessions();
    return sessions.find(s => s.id === id) || null;
  },

  getAllSessions: (): ChatSession[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  createSession: (type: ChatbotType): ChatSession => {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      type,
      messages: [],
      isLocked: false,
      startTime: new Date().toISOString()
    };
    db.saveSession(newSession);
    return newSession;
  },

  deleteSession: (id: string) => {
    const sessions = db.getAllSessions().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }
};
