import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { Navbar } from '../components/common/Navbar';
import { Toast } from '../components/common/Toast';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { TaskList } from '../components/tasks/TaskList';
import { TaskFormModal } from '../components/tasks/TaskFormModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { PlusCircle, CheckSquare, Layers } from 'lucide-react';

export const TasksPage = () => {
  const { createTask, updateTask, deleteTask } = useTasks();

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

  // Delete confirmation handler
  const handleConfirmDelete = async () => {
    if (!deletingTaskId) return;
    setDeleteLoading(true);
    await deleteTask(deletingTaskId);
    setDeleteLoading(false);
    setDeletingTaskId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar onOpenNewTask={() => setIsNewTaskModalOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Page Title & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2.5">
              <CheckSquare className="w-7 h-7 text-indigo-600" />
              Student Task & Assignment Hub
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage coursework, homework assignments, exams, and personal study goals
            </p>
          </div>

          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm rounded-xl shadow-md hover:shadow transition-all shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Task</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <section>
          <TaskFilters />
        </section>

        {/* Task Cards List / Grid */}
        <section>
          <TaskList
            onEditTask={(t) => setEditingTask(t)}
            onDeleteTask={(id) => setDeletingTaskId(id)}
            onOpenNewTask={() => setIsNewTaskModalOpen(true)}
          />
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

      {/* Delete Confirmation Dialog */}
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
