import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const isAuthPath = config.url.includes('/login') || config.url.includes('/register');
  if (token && !isAuthPath) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor to handle expired tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && [401, 403].includes(error.response.status)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login if on protected page
      if (!window.location.pathname.includes('/login')) {
         window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (formData) => api.post('/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }),
  register: (userData) => api.post('/register', userData),
};

export const userService = {
  getAll: () => api.get('/users'),
  getMe: () => api.get('/me'),
  assignFeatures: (userId, featureIds) => api.put(`/assign-features/${userId}`, featureIds),
};

export const featureService = {
  getAll: () => api.get('/features'),
  create: (featureData) => api.post('/features', featureData),
};

export const docService = {
  getAll: () => api.get('/documents'),
  getById: (id) => api.get(`/documents/${id}`),
  create: (docData) => api.post('/documents', docData),
  update: (id, docData) => api.put(`/documents/${id}`, docData),
  delete: (id) => api.delete(`/documents/${id}`),
  getVersions: (id) => api.get(`/documents/${id}/versions`),
  search: (query) => api.get(`/search?query=${query}`),
};

export default api;
