import axios from 'axios';

const ADMIN_API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

ADMIN_API.interceptors.request.use((config) => {
  const token = localStorage.getItem('sharenest_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

ADMIN_API.interceptors.response.use(
  (res) => res,
  (error) => {
    // Don't redirect on login page itself
    const isLoginCall = error.config?.url?.includes('/admin/login');
    if (!isLoginCall && (error.response?.status === 401 || error.response?.status === 403)) {
      localStorage.removeItem('sharenest_admin_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const adminAPI = {
  login: (data) => ADMIN_API.post('/admin/login', data),
  getStats: () => ADMIN_API.get('/admin/stats'),
  // Users
  getUsers: (params) => ADMIN_API.get('/admin/users', { params }),
  getUser: (id) => ADMIN_API.get(`/admin/users/${id}`),
  toggleUserStatus: (id) => ADMIN_API.patch(`/admin/users/${id}/toggle-status`),
  verifyUser: (id, level) => ADMIN_API.patch(`/admin/users/${id}/verify`, { level }),
  deleteUser: (id) => ADMIN_API.delete(`/admin/users/${id}`),
  // Properties
  getProperties: (params) => ADMIN_API.get('/admin/properties', { params }),
  verifyProperty: (id) => ADMIN_API.patch(`/admin/properties/${id}/verify`),
  togglePropertyStatus: (id) => ADMIN_API.patch(`/admin/properties/${id}/toggle-status`),
  deleteProperty: (id) => ADMIN_API.delete(`/admin/properties/${id}`),
  // Bookings
  getBookings: (params) => ADMIN_API.get('/admin/bookings', { params }),
  updateBookingStatus: (id, status) => ADMIN_API.patch(`/admin/bookings/${id}/status`, { status }),
  // Moderation
  getModeration: (params) => ADMIN_API.get('/admin/moderation', { params }),
  moderateProperty: (id, status, note) => ADMIN_API.patch(`/admin/moderation/${id}`, { status, note }),
  setSafetyScore: (id, neighborhoodSafety) => ADMIN_API.patch(`/admin/properties/${id}/safety`, { neighborhoodSafety }),
  // Create admin
  createAdmin: (data) => ADMIN_API.post('/admin/create-admin', data),
};

export default ADMIN_API;
