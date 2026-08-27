import React from 'react';
import { TASK_STATUSES, TASK_PRIORITIES } from '../../utils/constants';

export const StatusBadge = ({ status }) => {
  const config = TASK_STATUSES.find((s) => s.id === status) || {
    label: status,
    color: 'bg-slate-50 text-slate-700 border-slate-200 ring-slate-500/10',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ring-1 ring-inset ${config.color}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-75 animate-pulse" />
      {config.label}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const config = TASK_PRIORITIES.find((p) => p.id === priority) || {
    label: priority,
    badgeColor: 'bg-slate-50 text-slate-700 border-slate-200 ring-slate-500/10',
    dotColor: 'bg-slate-500',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ring-1 ring-inset ${config.badgeColor}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dotColor}`} />
      {config.label}
    </span>
  );
};

export const SubjectBadge = ({ subject }) => {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
      📚 {subject || 'General'}
    </span>
  );
};
