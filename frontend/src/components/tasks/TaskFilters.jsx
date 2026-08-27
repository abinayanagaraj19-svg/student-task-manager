import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { SORT_OPTIONS, POPULAR_SUBJECTS } from '../../utils/constants';
import { Search, X, Filter, ArrowUpDown, Calendar, AlertCircle } from 'lucide-react';

export const TaskFilters = () => {
  const { filters, updateFilter, resetFilters, stats } = useTasks();

  const isFiltered =
    filters.search !== '' ||
    filters.status !== 'All' ||
    filters.priority !== 'All' ||
    filters.subject !== 'All' ||
    filters.timeframe !== 'all' ||
    filters.sortBy !== 'dueDate_asc';

  // Gather unique subjects from stats and defaults
  const subjectList = Array.from(
    new Set(['All', ...POPULAR_SUBJECTS.filter((s) => s !== 'All'), ...Object.keys(stats?.subjectCounts || {})])
  );

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
      {/* Top Row: Search & Sort */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Live Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            placeholder="Search tasks by title, description, or subject..."
            className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          {filters.search && (
            <button
              onClick={() => updateFilter('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort By Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilter('sortBy', e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                Sort: {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Second Row: Timeframe & Status Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] mr-1 shrink-0">
          Timeframe:
        </span>
        {[
          { id: 'all', label: 'All Time' },
          { id: 'today', label: 'Due Today' },
          { id: 'upcoming', label: 'Upcoming' },
          { id: 'overdue', label: 'Overdue' },
        ].map((tf) => (
          <button
            key={tf.id}
            onClick={() => updateFilter('timeframe', tf.id)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
              filters.timeframe === tf.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tf.label}
          </button>
        ))}

        <div className="h-4 w-px bg-slate-200 mx-1 shrink-0" />

        {/* Status Pills */}
        <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] mr-1 shrink-0">
          Status:
        </span>
        {['All', 'Pending', 'In Progress', 'Completed'].map((st) => (
          <button
            key={st}
            onClick={() => updateFilter('status', st)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
              filters.status === st
                ? 'bg-slate-800 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Third Row: Dropdown Selectors for Subject & Priority */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-3">
          {/* Priority Select */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Priority:</span>
            <select
              value={filters.priority}
              onChange={(e) => updateFilter('priority', e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="All">All Priorities</option>
              <option value="High">🔴 High Priority</option>
              <option value="Medium">🟡 Medium Priority</option>
              <option value="Low">🟢 Low Priority</option>
            </select>
          </div>

          {/* Subject Select */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Subject:</span>
            <select
              value={filters.subject}
              onChange={(e) => updateFilter('subject', e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 max-w-[200px]"
            >
              {subjectList.map((subj) => (
                <option key={subj} value={subj}>
                  {subj === 'All' ? 'All Subjects' : subj}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reset Filters */}
        {isFiltered && (
          <button
            onClick={resetFilters}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 py-1"
          >
            <X className="w-3.5 h-3.5" />
            Reset all filters
          </button>
        )}
      </div>
    </div>
  );
};
