import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="p-4 bg-indigo-50 text-indigo-600 rounded-3xl mb-4">
        <GraduationCap className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-800">404</h1>
      <p className="mt-2 text-lg font-bold text-slate-700">Page Not Found</p>
      <p className="mt-1 text-sm text-slate-500 max-w-sm">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md transition-all"
      >
        <Home className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};
