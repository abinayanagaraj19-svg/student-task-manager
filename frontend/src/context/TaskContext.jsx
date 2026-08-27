import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/api';
import { useAuth } from './AuthContext';

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
    overdue: 0,
    completionRate: 0,
    priorityCounts: { High: 0, Medium: 0, Low: 0 },
    subjectCounts: {},
    upcomingTasks: [],
    recentTasks: [],
  });

  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Toast notification state
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  // Filter & Search states
  const [filters, setFilters] = useState({
    search: '',
    status: 'All',
    priority: 'All',
    subject: 'All',
    timeframe: 'all',
    sortBy: 'dueDate_asc',
  });

  // Fetch tasks with current filters
  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.status && filters.status !== 'All') params.status = filters.status;
      if (filters.priority && filters.priority !== 'All') params.priority = filters.priority;
      if (filters.subject && filters.subject !== 'All') params.subject = filters.subject;
      if (filters.timeframe && filters.timeframe !== 'all') params.timeframe = filters.timeframe;
      if (filters.sortBy) params.sortBy = filters.sortBy;

      const res = await taskService.getTasks(params);
      if (res.data.success) {
        setTasks(res.data.tasks);
      }
    } catch (err) {
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, filters]);

  // Fetch dashboard statistics
  const fetchStats = useCallback(async () => {
    if (!isAuthenticated) return;
    setStatsLoading(true);
    try {
      const res = await taskService.getStats();
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Error fetching statistics:', err.message);
    } finally {
      setStatsLoading(false);
    }
  }, [isAuthenticated]);

  // Refresh both on mount/filter changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [fetchTasks, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [fetchStats, isAuthenticated]);

  // Create Task
  const createTask = async (taskData) => {
    try {
      const res = await taskService.createTask(taskData);
      if (res.data.success) {
        showToast('Task added successfully! 🎉', 'success');
        await Promise.all([fetchTasks(), fetchStats()]);
        return { success: true, task: res.data.task };
      }
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  // Update Task
  const updateTask = async (id, taskData) => {
    try {
      const res = await taskService.updateTask(id, taskData);
      if (res.data.success) {
        showToast('Task updated successfully!', 'success');
        await Promise.all([fetchTasks(), fetchStats()]);
        return { success: true, task: res.data.task };
      }
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  // Toggle Status
  const toggleTaskStatus = async (id) => {
    try {
      // Optimistic update for ultra snappy feel
      setTasks((prev) =>
        prev.map((t) =>
          t._id === id
            ? {
                ...t,
                status: t.status === 'Completed' ? 'Pending' : 'Completed',
                completedAt: t.status === 'Completed' ? null : new Date().toISOString(),
              }
            : t
        )
      );

      const res = await taskService.toggleStatus(id);
      if (res.data.success) {
        showToast(res.data.message, 'success');
        fetchStats();
      }
    } catch (err) {
      showToast(err.message, 'error');
      fetchTasks(); // rollback if failed
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
    try {
      const res = await taskService.deleteTask(id);
      if (res.data.success) {
        showToast('Task deleted successfully', 'success');
        setTasks((prev) => prev.filter((t) => t._id !== id));
        fetchStats();
        return { success: true };
      }
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  // Filter setters
  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      status: 'All',
      priority: 'All',
      subject: 'All',
      timeframe: 'all',
      sortBy: 'dueDate_asc',
    });
  };

  const value = {
    tasks,
    stats,
    loading,
    statsLoading,
    error,
    filters,
    toast,
    showToast,
    hideToast,
    fetchTasks,
    fetchStats,
    createTask,
    updateTask,
    toggleTaskStatus,
    deleteTask,
    updateFilter,
    resetFilters,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
