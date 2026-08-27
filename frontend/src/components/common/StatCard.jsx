import React from 'react';

export const StatCard = ({ title, value, icon: Icon, color, subtitle, progress }) => {
  return (
    <div className="relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <p className="mt-1 text-3xl font-extrabold text-slate-800">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {subtitle && (
        <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
          {subtitle}
        </p>
      )}

      {progress !== undefined && (
        <div className="mt-3">
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
