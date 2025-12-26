import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh-token`, {
            refreshToken,
          });

          const { accessToken } = response.data.data;
          Cookies.set('accessToken', accessToken, { expires: 1 / 96 }); // 15 minutes

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Clear tokens and redirect to login
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  instructorLogin: (data: any) => api.post('/auth/instructor/login', data),
  adminLogin: (data: any) => api.post('/auth/admin/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) => api.put(`/auth/reset-password/${token}`, { password }),
  changePassword: (data: any) => api.put('/auth/change-password', data),
  updateProfile: (data: any) => api.put('/auth/update-profile', data),
  verifyEmail: (token: string) => api.get(`/auth/verify-email/${token}`),
  createInstructor: (data: any) => api.post('/auth/create-instructor', data),
};

// Course endpoints
export const courseAPI = {
  getAll: (params?: any) => api.get('/courses', { params }),
  getById: (id: string) => api.get(`/courses/id/${id}`),
  getBySlug: (slug: string) => api.get(`/courses/${slug}`),
  create: (data: any) => api.post('/courses', data),
  update: (id: string, data: any) => api.put(`/courses/${id}`, data),
  delete: (id: string) => api.delete(`/courses/${id}`),
  uploadThumbnail: (id: string, formData: FormData) =>
    api.put(`/courses/${id}/thumbnail`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  addSection: (id: string, data: any) => api.post(`/courses/${id}/sections`, data),
  submitForReview: (id: string) => api.put(`/courses/${id}/submit`),
  getInstructorCourses: (params?: any) => api.get('/courses/instructor/my-courses', { params }),
  getPendingCourses: (params?: any) => api.get('/courses/admin/pending', { params }),
  approveCourse: (id: string, data: any) => api.put(`/courses/${id}/approval`, data),
};

// Lesson endpoints
export const lessonAPI = {
  create: (courseId: string, data: any) => api.post(`/lessons/courses/${courseId}/lessons`, data),
  get: (id: string) => api.get(`/lessons/${id}`),
  update: (id: string, data: any) => api.put(`/lessons/${id}`, data),
  delete: (id: string) => api.delete(`/lessons/${id}`),
  uploadVideo: (id: string, formData: FormData) =>
    api.put(`/lessons/${id}/video`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateProgress: (id: string, data: any) => api.put(`/lessons/${id}/progress`, data),
  markComplete: (id: string) => api.put(`/lessons/${id}/complete`),
};

// Enrollment endpoints
export const enrollmentAPI = {
  getAll: (params?: any) => api.get('/enrollments', { params }),
  get: (enrollmentId: string) => api.get(`/enrollments/${enrollmentId}`),
  getByCourse: (courseId: string) => api.get(`/enrollments/course/${courseId}`),
  enrollFree: (courseId: string) => api.post(`/enrollments/free/${courseId}`),
  getCourseStudents: (courseId: string, params?: any) =>
    api.get(`/enrollments/course/${courseId}/students`, { params }),
  getAnalytics: (courseId: string) => api.get(`/enrollments/course/${courseId}/analytics`),
};

// Progress endpoints
export const progressAPI = {
  get: (lessonId: string) => api.get(`/lessons/${lessonId}/progress`),
  updateProgress: (lessonId: string, data: any) => api.put(`/lessons/${lessonId}/progress`, data),
  markComplete: (lessonId: string) => api.put(`/lessons/${lessonId}/complete`),
};

// Doubt endpoints
export const doubtAPI = {
  create: (data: any) => api.post('/doubts', data),
  getAll: (params?: any) => api.get('/doubts', { params }),
  get: (id: string) => api.get(`/doubts/${id}`),
  reply: (id: string, data: any) => api.post(`/doubts/${id}/reply`, data),
  resolve: (id: string) => api.put(`/doubts/${id}/resolve`),
  getInstructorDoubts: (params?: any) => api.get('/doubts/instructor/pending', { params }),
};

// Note endpoints
export const noteAPI = {
  create: (data: any) => api.post('/notes', data),
  getAll: (params?: any) => api.get('/notes', { params }),
  get: (id: string) => api.get(`/notes/${id}`),
  update: (id: string, data: any) => api.put(`/notes/${id}`, data),
  delete: (id: string) => api.delete(`/notes/${id}`),
  getLessonNotes: (lessonId: string) => api.get(`/notes/lesson/${lessonId}`),
};

// Test endpoints
export const testAPI = {
  create: (data: any) => api.post('/tests', data),
  getCourseTests: (courseId: string) => api.get(`/tests/course/${courseId}`),
  get: (id: string) => api.get(`/tests/${id}`),
  update: (id: string, data: any) => api.put(`/tests/${id}`, data),
  addQuestion: (id: string, data: any) => api.post(`/tests/${id}/questions`, data),
  start: (id: string) => api.post(`/tests/${id}/start`),
  submit: (id: string, data: any) => api.post(`/tests/${id}/submit`, data),
  getResult: (testId: string, resultId: string) => api.get(`/tests/${testId}/results/${resultId}`),
  getLeaderboard: (id: string) => api.get(`/tests/${id}/leaderboard`),
};

// Certificate endpoints
export const certificateAPI = {
  generate: (enrollmentId: string) => api.post(`/certificates/generate/${enrollmentId}`),
  getMy: (params?: any) => api.get('/certificates/my', { params }),
  getAll: (params?: any) => api.get('/certificates', { params }),
  get: (id: string) => api.get(`/certificates/${id}`),
  verify: (certificateId: string) => api.get(`/certificates/verify/${certificateId}`),
  download: (id: string) => api.get(`/certificates/${id}/download`),
};

// Payment endpoints
export const paymentAPI = {
  createIntent: (data: any) => api.post('/payments/create-intent', data),
  confirm: (data: any) => api.post('/payments/confirm', data),
  getOrders: (params?: any) => api.get('/payments/my-orders', { params }),
  getOrder: (orderId: string) => api.get(`/payments/order/${orderId}`),
  getInstructorEarnings: (params?: any) => api.get('/payments/instructor/earnings', { params }),
};

// Notification endpoints
export const notificationAPI = {
  getAll: (params?: any) => api.get('/notifications', { params }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id: string) => api.delete(`/notifications/${id}`),
};

// Category endpoints
export const categoryAPI = {
  getAll: (params?: any) => api.get('/categories', { params }),
  get: (slug: string) => api.get(`/categories/${slug}`),
};

// Review endpoints
export const reviewAPI = {
  getCourseReviews: (courseId: string, params?: any) =>
    api.get(`/reviews/course/${courseId}`, { params }),
  create: (courseId: string, data: any) => api.post(`/reviews/course/${courseId}`, data),
  markHelpful: (id: string, data: any) => api.put(`/reviews/${id}/helpful`, data),
};

// Admin endpoints
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  getUserDetails: (id: string) => api.get(`/admin/users/${id}`),
  updateUserStatus: (id: string, data: any) => api.put(`/admin/users/${id}/status`, data),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  getInstructors: (params?: any) => api.get('/admin/instructors', { params }),
  getAnalytics: (params?: any) => api.get('/admin/analytics', { params }),
  getAuditLogs: (params?: any) => api.get('/admin/audit-logs', { params }),
  sendAnnouncement: (data: any) => api.post('/admin/announcements', data),
};

export default api;
