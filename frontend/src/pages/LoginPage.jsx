import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Lock, Mail, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, authError, setAuthError } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (authError) setAuthError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(formData.email, formData.password);
    setLoading(false);
    if (res.success) {
      navigate('/dashboard');
    }
  };

  // One-click demo login helper
  const handleDemoLogin = async () => {
    setFormData({
      email: 'alex.student@university.edu',
      password: 'password123',
    });
    setLoading(true);
    const res = await login('alex.student@university.edu', 'password123');
    setLoading(false);
    if (res.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="flex justify-center">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-500/20 text-white">
            <GraduationCap className="w-8 h-8" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          Welcome Back, Student!
        </h2>
        <p className="mt-1.5 text-center text-sm text-slate-500">
          Sign in to track your assignments, deadlines, and study goals
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100">
          {authError && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-semibold text-rose-700">
              {authError}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Student Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@university.edu"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In to StudySync'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Fill Button for Evaluation / Internship Presentation */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold rounded-xl border border-amber-200 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Fill Demo Credentials (alex.student@university.edu)</span>
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline">
              Create student account
            </Link>
          </div>
        </div>

        {/* Feature bullets */}
        <div className="mt-8 grid grid-cols-3 gap-2 text-center text-slate-500 text-xs">
          <div className="p-2">
            <span className="font-semibold text-slate-700 block">⚡ MERN Stack</span>
            <span className="text-[11px]">React + Express</span>
          </div>
          <div className="p-2">
            <span className="font-semibold text-slate-700 block">🔒 JWT Secured</span>
            <span className="text-[11px]">Private Tasks</span>
          </div>
          <div className="p-2">
            <span className="font-semibold text-slate-700 block">📊 Real-time</span>
            <span className="text-[11px]">Dashboard Stats</span>
          </div>
        </div>
      </div>
    </div>
  );
};
