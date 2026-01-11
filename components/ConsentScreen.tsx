
import React, { useState } from 'react';
import { DISCLAIMER_TEXT } from '../constants';

interface ConsentScreenProps {
  onConsent: () => void;
  onBack: () => void;
  botType: string;
}

export const ConsentScreen: React.FC<ConsentScreenProps> = ({ onConsent, onBack, botType }) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="p-8 flex flex-col h-full overflow-y-auto">
      <div className="flex items-center space-x-2 mb-6">
        <button onClick={onBack} className="text-slate-400 hover:text-slate-600">
          <i className="fa-solid fa-arrow-left"></i> Back
        </button>
        <span className="text-slate-300">/</span>
        <span className="text-slate-500 capitalize">{botType.replace('_', ' ')} Chatbot</span>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-8 rounded-r-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <i className="fa-solid fa-circle-exclamation text-amber-400 text-xl"></i>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-amber-800">Important Disclaimer</h3>
            <div className="mt-2 text-sm text-amber-700">
              <p className="whitespace-pre-line">{DISCLAIMER_TEXT}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Consent to Participate</h2>
        <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
          <p>
            By participating in this interaction, you agree that your conversation logs will be recorded 
            anonymously for research purposes. We do not collect names, email addresses, or IP addresses.
          </p>
          <p>
            You may stop the conversation at any time. If you experience any distress, 
            please discontinue the session and contact professional support.
          </p>
        </div>
      </div>

      <div className="mt-8 border-t border-slate-100 pt-6 flex flex-col items-center">
        <label className="flex items-center space-x-3 cursor-pointer mb-6 select-none group">
          <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${agreed ? 'bg-blue-600 border-blue-600' : 'border-slate-300 group-hover:border-blue-400'}`}>
            <input 
              type="checkbox" 
              className="hidden" 
              checked={agreed} 
              onChange={() => setAgreed(!agreed)} 
            />
            {agreed && <i className="fa-solid fa-check text-white text-xs"></i>}
          </div>
          <span className="text-slate-700 font-medium">I agree to participate and understand the disclaimer</span>
        </label>

        <button
          disabled={!agreed}
          onClick={onConsent}
          className={`px-12 py-3 rounded-full font-bold text-white shadow-lg transition-all ${
            agreed ? 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95' : 'bg-slate-300 cursor-not-allowed'
          }`}
        >
          Start Session
        </button>
      </div>
    </div>
  );
};
