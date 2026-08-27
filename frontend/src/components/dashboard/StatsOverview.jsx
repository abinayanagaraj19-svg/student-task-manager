import React from 'react';
import { StatCard } from '../common/StatCard';
import { useTasks } from '../../context/TaskContext';
import { CheckCircle2, Clock, ListTodo, AlertTriangle, PlayCircle } from 'lucide-react';

export const StatsOverview = () => {
  const { stats, statsLoading } = useTasks();

  if (statsLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-white rounded-2xl border border-slate-100 p-5 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Tasks"
        value={stats.total}
        icon={ListTodo}
        color="bg-indigo-50 text-indigo-600"
        subtitle={`${stats.completionRate}% completion rate`}
        progress={stats.completionRate}
      />

      <StatCard
        title="Pending Tasks"
        value={stats.pending}
        icon={Clock}
        color="bg-amber-50 text-amber-600"
        subtitle="Awaiting action"
      />

      <StatCard
        title="In Progress"
        value={stats.inProgress}
        icon={PlayCircle}
        color="bg-sky-50 text-sky-600"
        subtitle="Currently working on"
      />

      <StatCard
        title="Completed"
        value={stats.completed}
        icon={CheckCircle2}
        color="bg-emerald-50 text-emerald-600"
        subtitle={stats.overdue > 0 ? `⚠️ ${stats.overdue} overdue tasks` : 'All on track! 🎯'}
      />
    </div>
  );
};
