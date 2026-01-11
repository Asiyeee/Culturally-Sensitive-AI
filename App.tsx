
import React, { useState, useEffect } from 'react';
import { AppState, ChatbotType, ChatSession } from './types';
import { db } from './services/db';
import { Layout } from './components/Layout';
import { LandingView } from './components/LandingView';
import { ConsentScreen } from './components/ConsentScreen';
import { ChatInterface } from './components/ChatInterface';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    view: 'landing',
    currentType: null,
    currentSession: null
  });

  const handleSelectType = (type: ChatbotType) => {
    setState({ ...state, currentType: type, view: 'consent' });
  };

  const handleConsent = () => {
    if (state.currentType) {
      const session = db.createSession(state.currentType);
      setState({ ...state, currentSession: session, view: 'chat' });
    }
  };

  const handleUpdateSession = (updatedSession: ChatSession) => {
    db.saveSession(updatedSession);
    setState({ ...state, currentSession: updatedSession });
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the session? All current conversation history will be lost.")) {
      if (state.currentSession) {
        db.deleteSession(state.currentSession.id);
      }
      setState({ view: 'landing', currentType: null, currentSession: null });
    }
  };

  const handleExport = () => {
    if (!state.currentSession) return;

    const session = state.currentSession;
    
    // JSON Export
    const jsonStr = JSON.stringify(session, null, 2);
    const jsonBlob = new Blob([jsonStr], { type: 'application/json' });
    const jsonUrl = URL.createObjectURL(jsonBlob);
    const jsonLink = document.createElement('a');
    jsonLink.href = jsonUrl;
    jsonLink.download = `session_${session.id.substring(0, 8)}_export.json`;
    jsonLink.click();

    // CSV Export
    const headers = ['id', 'role', 'content', 'timestamp'];
    const rows = session.messages.map(m => [
      m.id,
      m.role,
      `"${m.content.replace(/"/g, '""')}"`,
      m.timestamp
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const csvBlob = new Blob([csvContent], { type: 'text/csv' });
    const csvUrl = URL.createObjectURL(csvBlob);
    const csvLink = document.createElement('a');
    csvLink.href = csvUrl;
    csvLink.download = `session_${session.id.substring(0, 8)}_export.csv`;
    csvLink.click();
  };

  return (
    <Layout>
      {state.view === 'landing' && (
        <LandingView onSelect={handleSelectType} />
      )}
      
      {state.view === 'consent' && state.currentType && (
        <ConsentScreen 
          botType={state.currentType}
          onConsent={handleConsent} 
          onBack={() => setState({ ...state, view: 'landing', currentType: null })} 
        />
      )}

      {state.view === 'chat' && state.currentSession && (
        <ChatInterface 
          session={state.currentSession}
          onUpdateSession={handleUpdateSession}
          onReset={handleReset}
          onExport={handleExport}
        />
      )}
    </Layout>
  );
};

export default App;
