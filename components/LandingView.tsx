
import React from 'react';
import { ChatbotType } from '../types';

interface LandingViewProps {
  onSelect: (type: ChatbotType) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onSelect }) => {
  return (
    <div className="p-8 flex flex-col items-center text-center space-y-8">
      <div className="max-w-xl">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Welcome to the Study</h2>
        <p className="text-slate-600 leading-relaxed">
          Please select one of the chatbot interfaces below to begin the session. 
          Each interface represents a unique interaction style for our research.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <button
          onClick={() => onSelect(ChatbotType.NEUTRAL)}
          className="group p-6 border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left"
        >
          <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
            <i className="fa-solid fa-robot text-slate-600 group-hover:text-blue-600 text-xl"></i>
          </div>
          <h3 className="text-lg font-bold text-slate-800">Neutral Prototype</h3>
          <p className="text-sm text-slate-500 mt-2">Direct, task-oriented assistance focused on informational clarity.</p>
        </button>

        <button
          onClick={() => onSelect(ChatbotType.CULTURALLY_SENSITIVE)}
          className="group p-6 border-2 border-slate-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 text-left"
        >
          <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
            <i className="fa-solid fa-heart text-slate-600 group-hover:text-purple-600 text-xl"></i>
          </div>
          <h3 className="text-lg font-bold text-slate-800">Sensitive Prototype</h3>
          <p className="text-sm text-slate-500 mt-2">Supportive, respectful communication styled after cultural norms.</p>
        </button>
      </div>
    </div>
  );
};
