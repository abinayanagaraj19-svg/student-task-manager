import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor: Attach JWT token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('student_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Centralize error message extraction
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token expired or unauthorized, clear storage
    if (error.response && error.response.status === 401) {
      const isAuthEndpoint = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
      if (!isAuthEndpoint) {
        localStorage.removeItem('student_token');
        localStorage.removeItem('student_user');
        // Let the app know
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred. Please check your network connection.';

    return Promise.reject(new Error(message));
  }
);

// Auth Endpoints
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
};

// Task Endpoints
export const taskService = {
  getTasks: (params = {}) => api.get('/tasks', { params }),
  getTaskById: (id) => api.get(`/tasks/${id}`),
  createTask: (taskData) => api.post('/tasks', taskData),
  updateTask: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  toggleStatus: (id) => api.patch(`/tasks/${id}/toggle`),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  getStats: () => api.get('/tasks/stats'),
};

export default api;
