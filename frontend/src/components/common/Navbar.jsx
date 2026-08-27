import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Plus, LogOut, LayoutDashboard, CheckSquare, Menu, X, User } from 'lucide-react';

export const Navbar = ({ onOpenNewTask }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="p-2 bg-indigo-600 group-hover:bg-indigo-700 text-white rounded-xl shadow-md transition-colors">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent">
                  StudySync
                </span>
                <span className="hidden sm:inline-block ml-1.5 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100">
                  Student Task Mgr
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>

              <Link
                to="/tasks"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive('/tasks')
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                My Tasks
              </Link>
            </nav>
          </div>

          {/* Right Section: Actions & User Info */}
          <div className="hidden md:flex items-center gap-4">
            {/* New Task Button */}
            <button
              onClick={onOpenNewTask}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>

            {/* User Profile Pill */}
            {user && (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm"
                    style={{ backgroundColor: user.avatarColor || '#4f46e5' }}
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <div className="text-left leading-tight">
                    <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate max-w-[120px]">
                      {user.major || 'Student'}
                    </p>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  title="Log out"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenNewTask}
              className="p-2 bg-indigo-600 text-white rounded-xl shadow-sm"
              title="New Task"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2 animate-fade-in">
          {user && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: user.avatarColor || '#4f46e5' }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
                <p className="text-xs text-indigo-600 font-medium">{user.major}</p>
              </div>
            </div>
          )}

          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium ${
              isActive('/dashboard') ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>

          <Link
            to="/tasks"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium ${
              isActive('/tasks') ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            My Tasks
          </Link>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              logout();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </header>
  );
};
