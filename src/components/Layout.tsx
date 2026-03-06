import React from 'react';
import { Home, FileText, CheckSquare, Settings, LogOut } from 'lucide-react';
import { View } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  onViewChange: (view: View) => void;
  onLogout: () => void;
}

export default function Layout({ children, currentView, onViewChange, onLogout }: LayoutProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'home' },
    { id: 'notes', icon: FileText, label: 'notes' },
    { id: 'todo', icon: CheckSquare, label: 'to-do' },
    { id: 'settings', icon: Settings, label: 'settings' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-black px-4 py-3 flex items-center justify-between sticky top-0 bg-white z-50">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold tracking-tighter cursor-pointer" onClick={() => onViewChange('home')}>
            flow
          </h1>
          <div className="hidden sm:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id as View)}
                className={`flex items-center gap-2 text-sm transition-opacity ${
                  currentView === item.id ? 'opacity-100 font-bold' : 'opacity-40 hover:opacity-100'
                }`}
              >
                <item.icon size={18} />
                <span className="hidden md:inline">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="opacity-40 hover:opacity-100 transition-opacity"
          title="logout"
        >
          <LogOut size={18} />
        </button>
      </nav>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8">
        {children}
      </main>

      {/* Mobile Nav */}
      <div className="sm:hidden border-t border-black fixed bottom-0 left-0 right-0 bg-white flex justify-around p-3 z-50">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as View)}
            className={`p-2 ${currentView === item.id ? 'opacity-100' : 'opacity-40'}`}
          >
            <item.icon size={20} />
          </button>
        ))}
      </div>
    </div>
  );
}
