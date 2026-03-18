import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, BookOpen, Settings, User, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="fixed top-4 left-4 right-4 z-50 glass rounded-2xl px-6 py-3 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="bg-brand-primary p-2 rounded-lg group-hover:bg-brand-secondary transition-colors">
          <BookOpen size={24} className="text-white" />
        </div>
        <span className="font-bold text-xl tracking-tight hidden sm:block">ProductWiki</span>
      </Link>

      <div className="flex items-center gap-1 sm:gap-4">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${isActive ? 'bg-white/10 text-brand-primary shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          <LayoutDashboard size={20} />
          <span className="hidden md:block font-medium">Dashboard</span>
        </NavLink>

        {user.role === 'admin' && (
          <NavLink 
            to="/admin" 
            className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${isActive ? 'bg-white/10 text-brand-primary shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <Settings size={20} />
            <span className="hidden md:block font-medium">Admin Panel</span>
          </NavLink>
        )}
      </div>

      <div className="flex items-center gap-4 border-l border-white/10 pl-4">
        <div className="hidden sm:flex flex-col items-end mr-2">
          <span className="text-sm font-semibold text-white">{user.name}</span>
          <span className="text-xs text-slate-400 uppercase tracking-widest">{user.role}</span>
        </div>
        <button 
          onClick={handleLogout}
          className="p-2.5 rounded-xl text-slate-400 hover:text-pink-500 hover:bg-pink-500/10 transition-all border border-transparent hover:border-pink-500/20"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
