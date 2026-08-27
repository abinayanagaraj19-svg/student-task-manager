import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { formatDisplayDate, getRelativeDeadline } from '../../utils/dateUtils';
import { PriorityBadge } from '../common/Badge';
import { Bell, ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export const UpcomingDeadlines = ({ onOpenNewTask }) => {
  const { stats, toggleTaskStatus } = useTasks();
  const upcoming = stats.upcomingTasks || [];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Upcoming Deadlines (Next 72 Hours)
            </h3>
            <p className="text-xs text-slate-500">Stay ahead of pressing coursework</p>
          </div>
        </div>

        <Link
          to="/tasks"
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 hover:underline"
        >
          View All Tasks
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {upcoming.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-xs">
          <p className="font-medium text-slate-600 text-sm">No pressing deadlines in the next 72 hours! 🎉</p>
          <p className="mt-1">You are all caught up or have no pending assignments due soon.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {upcoming.map((task) => (
            <div
              key={task._id}
              className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100/70 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => toggleTaskStatus(task._id)}
                  title="Mark as Completed"
                  className="w-5 h-5 rounded-lg border-2 border-slate-300 hover:border-emerald-500 text-transparent hover:text-emerald-500 flex items-center justify-center shrink-0 transition-colors"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </button>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{task.title}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span>{task.subject}</span>
                    <span>•</span>
                    <span className="font-semibold text-amber-600">
                      {getRelativeDeadline(task.dueDate, task.status)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <PriorityBadge priority={task.priority} />
                <span className="text-xs text-slate-400 hidden sm:inline">
                  {formatDisplayDate(task.dueDate)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
