import React from 'react';
import { StatusBadge, PriorityBadge, SubjectBadge } from '../common/Badge';
import { formatDisplayDate, isOverdue, isDueToday, getRelativeDeadline } from '../../utils/dateUtils';
import { Check, Clock, Calendar, Edit3, Trash2, AlertCircle, Star } from 'lucide-react';

export const TaskCard = ({ task, onToggleStatus, onEdit, onDelete }) => {
  const isDone = task.status === 'Completed';
  const overdue = isOverdue(task.dueDate, task.status);
  const dueToday = isDueToday(task.dueDate) && !isDone;
  const relativeText = getRelativeDeadline(task.dueDate, task.status);

  return (
    <div
      className={`group relative bg-white rounded-2xl p-5 border transition-all duration-200 hover:shadow-md ${
        isDone
          ? 'border-slate-100 bg-slate-50/60 opacity-80'
          : overdue
          ? 'border-rose-200 bg-rose-50/20 shadow-rose-100/50'
          : 'border-slate-200/80 hover:border-indigo-200'
      }`}
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
          <SubjectBadge subject={task.subject} />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            title="Edit Task"
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            title="Delete Task"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Task Content */}
      <div className="flex items-start gap-3 mt-2">
        {/* Quick Complete Button */}
        <button
          onClick={() => onToggleStatus(task._id)}
          title={isDone ? 'Mark as Pending' : 'Mark as Completed'}
          className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
            isDone
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-slate-300 hover:border-emerald-500 text-transparent hover:text-emerald-500'
          }`}
        >
          <Check className="w-4 h-4 stroke-[3]" />
        </button>

        {/* Title and Description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4
              className={`text-base font-semibold leading-snug break-words ${
                isDone ? 'line-through text-slate-400' : 'text-slate-800'
              }`}
            >
              {task.title}
            </h4>
            {task.isImportant && (
              <span title="Important Task">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
              </span>
            )}
          </div>

          {task.description && (
            <p
              className={`mt-1.5 text-xs sm:text-sm leading-relaxed line-clamp-2 ${
                isDone ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {task.description}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Footer: Due Date & Warning */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Due {formatDisplayDate(task.dueDate)}</span>
        </div>

        {/* Overdue / Due Today badge */}
        <div>
          {overdue && (
            <span className="inline-flex items-center gap-1 text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
              <AlertCircle className="w-3 h-3" />
              {relativeText}
            </span>
          )}
          {dueToday && (
            <span className="inline-flex items-center gap-1 text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
              <Clock className="w-3 h-3" />
              Due Today!
            </span>
          )}
          {!overdue && !dueToday && !isDone && (
            <span className="text-slate-500">{relativeText}</span>
          )}
          {isDone && task.completedAt && (
            <span className="text-emerald-600 font-medium">
              Completed {formatDisplayDate(task.completedAt)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
