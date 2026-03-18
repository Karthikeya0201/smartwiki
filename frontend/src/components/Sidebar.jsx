import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LogOut,
  BookOpen,
  LayoutDashboard,
  Shield
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      to: '/admin',
      label: 'Admin Hub',
      icon: Shield,
      adminOnly: true
    }
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-300 flex flex-col z-50">

      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-200">
        <div className="bg-blue-700 p-2 rounded-md">
          <BookOpen size={20} className="text-white" />
        </div>
        <h1 className="text-lg font-semibold text-black">
          SmartWiki
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 px-4 py-6">
        <p className="text-xs text-gray-500 uppercase mb-2 px-2">
          Menu
        </p>

        {navItems.map((item) => {
          if (item.adminOnly && user.role?.toLowerCase() !== 'admin') return null;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? 'bg-blue-700 text-white'
                    : 'text-black hover:bg-gray-100'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="flex-grow" />

      {/* User Section */}
      <div className="border-t border-gray-200 px-4 py-5">
        <div className="mb-3">
          <p className="text-black font-medium text-sm">
            {user.name}
          </p>
          <p className="text-xs text-gray-600">
            {user.role}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-md text-sm"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

    </div>
  );
};

export default Sidebar;