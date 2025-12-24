import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = async (credentials) => {
  return api.post('/auth/login', credentials);
};

export const registerUser = async (userData) => {
  return api.post('/auth/register', userData);
};

export const forgotPassword = async (email) => {
  return api.post('/auth/forgot-password', { email });
};

export const resetPassword = async (token, password) => {
  return api.post('/auth/reset-password', { token, password });
};

export const verifyEmail = async (token) => {
  return api.get(`/auth/verify-email/${token}`);
};

export const getCurrentUser = async () => {
  return api.get('/auth/me');
};

export const updateProfile = async (data) => {
  return api.put('/auth/profile', data);
};

export const changePassword = async (data) => {
  return api.put('/auth/change-password', data);
};

export default api;
