import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/users/register', data),
  login: (data) => api.post('/users/login', data),
  verify: () => api.get('/users/verify'),
  resetPassword: (data) => api.post('/users/reset-password', data),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
  },
};

export const userAPI = {
  getById: (id) => api.get(`/users/${id}`),
};

export const scheduleAPI = {
  generate: (data) => api.post('/schedules/generate', data),
  getByUser: (userId) => api.get(`/schedules/user/${userId}`),
  getById: (id) => api.get(`/schedules/${id}`),
  updateTask: (scheduleId, dayIndex, taskIndex, data) => 
    api.patch(`/schedules/${scheduleId}/day/${dayIndex}/task/${taskIndex}`, data),
  delete: (id) => api.delete(`/schedules/${id}`),
};

export const quizAPI = {
  generate: (data) => api.post('/quizzes/generate', data),
  getByUser: (userId) => api.get(`/quizzes/user/${userId}`),
  getById: (id) => api.get(`/quizzes/${id}`),
  delete: (id) => api.delete(`/quizzes/${id}`),
};

export default api;
