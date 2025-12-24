import api from './api';

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
