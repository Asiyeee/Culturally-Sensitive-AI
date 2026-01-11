
import React, { useState, useRef, useEffect } from 'react';
import { ChatSession, Message, ChatbotType } from '../types';
import { CRISIS_KEYWORDS, CRISIS_RESPONSE, SYSTEM_PROMPTS } from '../constants';
import { getGeminiResponse } from '../services/gemini';

interface ChatInterfaceProps {
  session: ChatSession;
  onUpdateSession: (session: ChatSession) => void;
  onReset: () => void;
  onExport: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ session, onUpdateSession, onReset, onExport }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [session.messages, isTyping]);

  const checkForCrisis = (text: string) => {
    const lowerText = text.toLowerCase();
    return CRISIS_KEYWORDS.some(keyword => lowerText.includes(keyword));
  };

  const handleSend = async () => {
    if (!input.trim() || session.isLocked || isTyping) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...session.messages, userMessage];
    let isLocked = false;
    let crisisMsg: Message | null = null;

    if (checkForCrisis(input)) {
      isLocked = true;
      crisisMsg = {
        id: crypto.randomUUID(),
        role: 'crisis',
        content: CRISIS_RESPONSE,
        timestamp: new Date().toISOString()
      };
      updatedMessages.push(crisisMsg);
      onUpdateSession({ ...session, messages: updatedMessages, isLocked });
      setInput('');
      return;
    }

    onUpdateSession({ ...session, messages: updatedMessages });
    setInput('');
    setIsTyping(true);

    const systemPrompt = SYSTEM_PROMPTS[session.type];
    const aiResponse = await getGeminiResponse(updatedMessages, systemPrompt);

    const modelMessage: Message = {
      id: crypto.randomUUID(),
      role: 'model',
      content: aiResponse,
      timestamp: new Date().toISOString()
    };

    setIsTyping(false);
    onUpdateSession({ ...session, messages: [...updatedMessages, modelMessage] });
  };

  return (
    <div className="flex flex-col h-full max-h-[70vh]">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
        <div>
          <h3 className="font-bold text-slate-800 capitalize">{session.type.replace('_', ' ')} Chatbot</h3>
          <p className="text-xs text-slate-400">Session: {session.id.substring(0, 8)}</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={onExport} 
            title="Export Data"
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <i className="fa-solid fa-download"></i>
          </button>
          <button 
            onClick={onReset} 
            title="Reset Session"
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <i className="fa-solid fa-rotate-right"></i>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {session.messages.length === 0 && (
          <div className="text-center py-10">
            <div className="inline-block p-4 bg-white rounded-2xl shadow-sm mb-4">
              <i className="fa-regular fa-comment-dots text-4xl text-slate-300"></i>
            </div>
            <p className="text-slate-400">How can I help you today?</p>
          </div>
        )}
        
        {session.messages.map((m) => (
          <div 
            key={m.id} 
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] px-4 py-2 rounded-2xl ${
                m.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none shadow-md' 
                  : m.role === 'crisis'
                  ? 'bg-red-50 border border-red-200 text-red-700 rounded-tl-none'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm'
              }`}
            >
              <div className="text-sm whitespace-pre-wrap">{m.content}</div>
              <div className={`text-[10px] mt-1 ${m.role === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-2 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-75"></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}

        {session.isLocked && (
          <div className="bg-red-100 p-4 rounded-xl flex items-start space-x-3 mt-4">
            <i className="fa-solid fa-lock text-red-600 mt-1"></i>
            <div>
              <p className="text-sm font-bold text-red-800">Conversation Locked</p>
              <p className="text-xs text-red-700">A crisis keyword was detected. This session has been halted for your safety. Please use the "Get Help" resource if needed.</p>
              <button 
                className="mt-2 text-xs font-bold bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                onClick={() => alert("Redirecting to mental health resources (Mock Link)")}
              >
                GET HELP
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex items-center space-x-2">
          <textarea
            disabled={session.isLocked}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={session.isLocked ? "Chat is locked" : "Type a message..."}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none max-h-32 disabled:bg-slate-100 disabled:cursor-not-allowed"
            rows={1}
          />
          <button
            disabled={!input.trim() || session.isLocked || isTyping}
            onClick={handleSend}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-2 text-center">
          Press Enter to send. Research Study: Non-Clinical Assistant.
        </p>
      </div>
    </div>
  );
};
