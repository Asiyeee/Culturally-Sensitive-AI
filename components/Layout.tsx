
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8">
      <header className="w-full max-w-4xl mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-800">Communication Styles Research Study</h1>
        <p className="text-slate-500 mt-2">University IRB Prototypes</p>
      </header>
      <main className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
        {children}
      </main>
      <footer className="mt-8 text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} Research Lab. All Rights Reserved.
      </footer>
    </div>
  );
};
