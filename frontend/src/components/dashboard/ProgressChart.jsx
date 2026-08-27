import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { Target, Award, BookOpen } from 'lucide-react';

export const ProgressChart = () => {
  const { stats } = useTasks();

  const total = stats.total || 0;
  const highCount = stats.priorityCounts?.High || 0;
  const medCount = stats.priorityCounts?.Medium || 0;
  const lowCount = stats.priorityCounts?.Low || 0;

  const highPct = total > 0 ? Math.round((highCount / total) * 100) : 0;
  const medPct = total > 0 ? Math.round((medCount / total) * 100) : 0;
  const lowPct = total > 0 ? Math.round((lowCount / total) * 100) : 0;

  const getEncouragement = (rate) => {
    if (rate === 100 && total > 0) return '🎉 All assignments completed! Outstanding work!';
    if (rate >= 75) return '🔥 Crushing it! You are in the home stretch.';
    if (rate >= 50) return '💪 Halfway there! Keep the momentum going.';
    if (rate > 0) return '🚀 Great start! Knock out the next priority task.';
    return '📝 Add and tackle your tasks to start building momentum.';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Productivity & Completion Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              Academic Productivity Meter
            </h3>
            <span className="text-2xl font-extrabold text-indigo-600">
              {stats.completionRate}%
            </span>
          </div>

          <p className="mt-2 text-xs text-slate-500">
            {stats.completed} of {stats.total} total academic tasks completed
          </p>

          {/* Large Segmented Progress Bar */}
          <div className="mt-4 h-4 bg-slate-100 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${stats.completionRate}%` }}
              className="bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-700 rounded-full"
            />
          </div>

          {/* Encouragement message */}
          <div className="mt-5 p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-center gap-3">
            <Award className="w-5 h-5 text-indigo-600 shrink-0" />
            <p className="text-xs font-semibold text-indigo-900 leading-snug">
              {getEncouragement(stats.completionRate)}
            </p>
          </div>
        </div>

        {/* Quick status summary */}
        <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-3 text-center">
          <div>
            <span className="text-xs text-slate-400 font-medium">Pending</span>
            <p className="text-lg font-bold text-amber-600">{stats.pending}</p>
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">In Progress</span>
            <p className="text-lg font-bold text-sky-600">{stats.inProgress}</p>
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Completed</span>
            <p className="text-lg font-bold text-emerald-600">{stats.completed}</p>
          </div>
        </div>
      </div>

      {/* Priority & Subject Breakdown Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Task Breakdown & Priorities
          </h3>

          {/* Priority Multi-bar */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
              <span>Priority Distribution</span>
              <span>{total} Total</span>
            </div>

            {total > 0 ? (
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
                <div style={{ width: `${highPct}%` }} className="bg-rose-500" title={`High: ${highCount}`} />
                <div style={{ width: `${medPct}%` }} className="bg-amber-500" title={`Medium: ${medCount}`} />
                <div style={{ width: `${lowPct}%` }} className="bg-emerald-500" title={`Low: ${lowCount}`} />
              </div>
            ) : (
              <div className="h-3 bg-slate-100 rounded-full" />
            )}

            {/* Legend */}
            <div className="flex items-center justify-between text-xs mt-2.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-slate-600 font-medium">High ({highCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-slate-600 font-medium">Medium ({medCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-600 font-medium">Low ({lowCount})</span>
              </div>
            </div>
          </div>

          {/* Subject Badges */}
          <div className="mt-5">
            <p className="text-xs font-semibold text-slate-600 mb-2">Subject Activity</p>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {Object.keys(stats.subjectCounts || {}).length > 0 ? (
                Object.entries(stats.subjectCounts).map(([subject, count]) => (
                  <span
                    key={subject}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
                  >
                    <span>{subject}</span>
                    <span className="px-1.5 py-0.2 bg-indigo-100 text-indigo-800 rounded-md text-[10px] font-bold">
                      {count}
                    </span>
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">No subject data yet</span>
              )}
            </div>
          </div>
        </div>

        {/* Overdue alert banner if any */}
        {stats.overdue > 0 && (
          <div className="mt-4 p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs text-rose-800 font-semibold">
            <span>⚠️ You have {stats.overdue} overdue task{stats.overdue > 1 ? 's' : ''}!</span>
            <span className="text-[11px] underline cursor-pointer">View overdue</span>
          </div>
        )}
      </div>
    </div>
  );
};
