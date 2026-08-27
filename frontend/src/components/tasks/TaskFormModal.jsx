import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { formatInputDate } from '../../utils/dateUtils';
import { POPULAR_SUBJECTS } from '../../utils/constants';
import { PlusCircle, Save, Sparkles } from 'lucide-react';

export const TaskFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const isEditMode = !!initialData;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: 'Computer Science',
    priority: 'Medium',
    status: 'Pending',
    dueDate: formatInputDate(new Date(Date.now() + 24 * 60 * 60 * 1000)), // default tomorrow
    isImportant: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Pre-fill form when initialData changes or modal opens
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        subject: initialData.subject || 'General',
        priority: initialData.priority || 'Medium',
        status: initialData.status || 'Pending',
        dueDate: formatInputDate(initialData.dueDate),
        isImportant: Boolean(initialData.isImportant),
      });
    } else {
      // Reset for new task
      setFormData({
        title: '',
        description: '',
        subject: 'Computer Science',
        priority: 'Medium',
        status: 'Pending',
        dueDate: formatInputDate(new Date(Date.now() + 24 * 60 * 60 * 1000)),
        isImportant: false,
      });
    }
    setFormError('');
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Task title is required');
      return;
    }
    if (!formData.dueDate) {
      setFormError('Please select a due date');
      return;
    }

    setSubmitting(true);
    setFormError('');

    const result = await onSubmit(formData);
    setSubmitting(false);

    if (result && result.success) {
      onClose();
    } else if (result && result.error) {
      setFormError(result.error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Task / Assignment' : 'Create New Task / Assignment'}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {formError && (
          <div className="p-3 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
            {formError}
          </div>
        )}

        {/* Task Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Task / Assignment Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Implement Binary Search Tree in C++"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            required
            maxLength={120}
          />
        </div>

        {/* Subject / Course */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Subject / Course
            </label>
            <input
              type="text"
              name="subject"
              list="subject-suggestions"
              value={formData.subject}
              onChange={handleChange}
              placeholder="e.g. Web Development"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            <datalist id="subject-suggestions">
              {POPULAR_SUBJECTS.filter((s) => s !== 'All').map((subj) => (
                <option key={subj} value={subj} />
              ))}
            </datalist>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Due Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              required
            />
          </div>
        </div>

        {/* Priority & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Priority Level
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            >
              <option value="Low">🟢 Low Priority</option>
              <option value="Medium">🟡 Medium Priority</option>
              <option value="High">🔴 High Priority</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Task Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            >
              <option value="Pending">⏳ Pending</option>
              <option value="In Progress">⚡ In Progress</option>
              <option value="Completed">✅ Completed</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Description / Requirements (Optional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Add assignment rubric, submission portal link, team member notes..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
            maxLength={1000}
          />
        </div>

        {/* Important Checkbox */}
        <div className="flex items-center gap-2.5 pt-1">
          <input
            type="checkbox"
            id="isImportant"
            name="isImportant"
            checked={formData.isImportant}
            onChange={handleChange}
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
          />
          <label htmlFor="isImportant" className="text-sm font-medium text-slate-700 flex items-center gap-1.5 cursor-pointer">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Mark as High Importance / Major Deadline
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow transition-all disabled:opacity-50"
          >
            {submitting ? (
              <span>Saving...</span>
            ) : isEditMode ? (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Add Task</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
