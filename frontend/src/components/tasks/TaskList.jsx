import React, { useState } from 'react';
import { TaskCard } from './TaskCard';
import { useTasks } from '../../context/TaskContext';
import { LayoutGrid, List, CheckCircle, PlusCircle, Inbox } from 'lucide-react';

export const TaskList = ({ onEditTask, onDeleteTask, onOpenNewTask }) => {
  const { tasks, loading, toggleTaskStatus, filters, resetFilters } = useTasks();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-2">
          <div className="h-6 w-32 bg-slate-200 animate-pulse rounded-md" />
          <div className="h-8 w-20 bg-slate-200 animate-pulse rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-44 bg-white rounded-2xl border border-slate-100 p-5 animate-pulse space-y-3"
            >
              <div className="flex gap-2">
                <div className="h-5 w-16 bg-slate-200 rounded-full" />
                <div className="h-5 w-20 bg-slate-200 rounded-full" />
              </div>
              <div className="h-5 w-3/4 bg-slate-200 rounded" />
              <div className="h-4 w-1/2 bg-slate-100 rounded" />
              <div className="pt-4 border-t border-slate-100 flex justify-between">
                <div className="h-4 w-24 bg-slate-100 rounded" />
                <div className="h-4 w-16 bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const isFiltered =
    filters.search !== '' ||
    filters.status !== 'All' ||
    filters.priority !== 'All' ||
    filters.subject !== 'All' ||
    filters.timeframe !== 'all';

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto shadow-sm">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          {isFiltered ? <Inbox className="w-8 h-8" /> : <CheckCircle className="w-8 h-8 text-emerald-500" />}
        </div>
        <h3 className="text-lg font-bold text-slate-800">
          {isFiltered ? 'No tasks matched your filters' : 'No tasks on your schedule yet!'}
        </h3>
        <p className="mt-1.5 text-sm text-slate-500 max-w-sm mx-auto">
          {isFiltered
            ? 'Try adjusting your search keywords, priority level, or reset active filters.'
            : 'Keep your academic assignments and homework organized by creating your first task.'}
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          {isFiltered ? (
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
            >
              Reset Filters
            </button>
          ) : (
            <button
              onClick={onOpenNewTask}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold rounded-xl shadow-md transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Add First Task
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header bar: Count & View Switcher */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-600">
          Showing <span className="text-slate-900 font-bold">{tasks.length}</span> {tasks.length === 1 ? 'task' : 'tasks'}
        </p>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('grid')}
            title="Grid view"
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === 'grid'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            title="Compact list view"
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === 'list'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Task Cards Grid/List */}
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
            : 'flex flex-col space-y-3'
        }
      >
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onToggleStatus={toggleTaskStatus}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))}
      </div>
    </div>
  );
};
