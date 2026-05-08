import React from 'react';
import { User, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const TopNavBar: React.FC = () => {
  return (
    <header className="flex justify-between items-center px-8 h-16 w-full fixed top-0 z-50 bg-surface font-headline font-bold tracking-tight border-b border-outline-variant/10 glass-effect">
      <div className="text-xl font-bold text-on-surface tracking-tighter">Cognitive Curator</div>
      <nav className="hidden md:flex items-center gap-8">
        <TabButton to="/upload" icon={<User size={16} />} label="Upload Assets" />
        <TabButton to="/chat" icon={<Settings size={16} />} label="Query AI" />
      </nav>
      <div className="flex items-center gap-4">
        <button className="p-2 text-on-surface-variant hover:text-on-surface transition-all active:opacity-80">
          <User size={24} />
        </button>
        <button className="p-2 text-on-surface-variant hover:text-on-surface transition-all active:opacity-80">
          <Settings size={24} />
        </button>
      </div>
    </header>
  );
};


// Helper component for active tab styling
function TabButton({ to, icon, label }: { to: string; icon: any; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
          isActive 
            ? "bg-zinc-700 text-white shadow-md" 
            : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
        }`
      }
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </NavLink>
  );
}