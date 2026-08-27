import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { Navbar } from '../components/common/Navbar';
import { Toast } from '../components/common/Toast';
import { StatsOverview } from '../components/dashboard/StatsOverview';
import { ProgressChart } from '../components/dashboard/ProgressChart';
import { UpcomingDeadlines } from '../components/dashboard/UpcomingDeadlines';
import { TaskFormModal } from '../components/tasks/TaskFormModal';
import { TaskCard } from '../components/tasks/TaskCard';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { PlusCircle, Sparkles, CheckCircle2, Clock, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { createTask, updateTask, deleteTask, toggleTaskStatus, stats, tasks } = useTasks();

  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form submission handler (create or edit)
  const handleTaskSubmit = async (formData) => {
    if (editingTask) {
      const res = await updateTask(editingTask._id, formData);
      if (res.success) setEditingTask(null);
      return res;
    } else {
      const res = await createTask(formData);
      return res;
    }
  };

  // Delete handler
  const handleConfirmDelete = async () => {
    if (!deletingTaskId) return;
    setDeleteLoading(true);
    await deleteTask(deletingTaskId);
    setDeleteLoading(false);
    setDeletingTaskId(null);
  };

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  // Recent tasks (first 4)
  const recentTasks = tasks.slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar onOpenNewTask={() => setIsNewTaskModalOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Student Welcome Hero Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-600/10">
          {/* Decorative background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide text-indigo-100">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{todayFormatted}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {user?.name || 'Student'}! 👋
              </h1>
              <p className="text-sm sm:text-base text-indigo-100/90 max-w-xl">
                You have <span className="font-bold underline">{stats.pending} pending tasks</span> and{' '}
                <span className="font-bold underline">{stats.completed} completed</span> assignments. Let's make today productive!
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setIsNewTaskModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3 bg-white text-indigo-700 hover:bg-indigo-50 active:scale-95 font-bold text-sm rounded-2xl shadow-lg transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create New Task</span>
              </button>
            </div>
          </div>
        </div>

        {/* 1. Stat Summary Cards */}
        <section>
          <StatsOverview />
        </section>

        {/* 2. Visual Charts & Analytics */}
        <section>
          <ProgressChart />
        </section>

        {/* 3. Upcoming Deadlines Widget */}
        <section>
          <UpcomingDeadlines onOpenNewTask={() => setIsNewTaskModalOpen(true)} />
        </section>

        {/* 4. Recent Active Tasks */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Recent Assignments & Tasks</h3>
              <p className="text-xs text-slate-500">Quick view of your coursework queue</p>
            </div>
            <Link
              to="/tasks"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 hover:underline"
            >
              Go to Task Manager
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentTasks.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center text-slate-400 text-sm">
              <p>No tasks created yet. Click "Create New Task" above to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onToggleStatus={toggleTaskStatus}
                  onEdit={(t) => setEditingTask(t)}
                  onDelete={(id) => setDeletingTaskId(id)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Task Creation & Edit Modal */}
      <TaskFormModal
        isOpen={isNewTaskModalOpen || !!editingTask}
        onClose={() => {
          setIsNewTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleTaskSubmit}
        initialData={editingTask}
      />

      {/* Task Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingTaskId}
        onClose={() => setDeletingTaskId(null)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />

      {/* Global Toast Feedback */}
      <Toast />
    </div>
  );
};
