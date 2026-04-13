import API from './axios';

// Auth
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  changePassword: (data) => API.put('/auth/change-password', data),
};

// Users
export const usersAPI = {
  getUser: (id) => API.get(`/users/${id}`),
  updateProfile: (data) => API.put('/users/profile', data),
  uploadAvatar: (formData) => API.post('/users/upload-avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// Properties
export const propertiesAPI = {
  getAll: (params) => API.get('/properties', { params }),
  getOne: (id) => API.get(`/properties/${id}`),
  create: (formData) => API.post('/properties', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => API.put(`/properties/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => API.delete(`/properties/${id}`),
  getMyListings: () => API.get('/properties/user/my-listings'),
};

// Roommates
export const roommatesAPI = {
  getAll: (params) => API.get('/roommates', { params }),
  getOne: (id) => API.get(`/roommates/${id}`),
  getMyProfile: () => API.get('/roommates/my/profile'),
  createOrUpdate: (data) => API.post('/roommates', data),
  deactivate: () => API.delete('/roommates/my-profile'),
};

// Messages
export const messagesAPI = {
  getConversations: () => API.get('/messages/conversations'),
  getMessages: (conversationId, params) => API.get(`/messages/${conversationId}`, { params }),
  startConversation: (recipientId) => API.post('/messages/start', { recipientId }),
  sendMessage: (conversationId, content) => API.post(`/messages/${conversationId}`, { content }),
};

// Favorites
export const favoritesAPI = {
  getAll: (type) => API.get('/favorites', { params: type ? { type } : {} }),
  toggleProperty: (propertyId) => API.post(`/favorites/property/${propertyId}`),
  toggleRoommate: (roommateId) => API.post(`/favorites/roommate/${roommateId}`),
  checkProperty: (propertyId) => API.get(`/favorites/check/property/${propertyId}`),
};

// Bookings
export const bookingsAPI = {
  create: (data) => API.post('/bookings', data),
  getMy: () => API.get('/bookings/my'),
  getReceived: () => API.get('/bookings/received'),
  updateStatus: (id, status) => API.patch(`/bookings/${id}/status`, { status }),
};

// Auth - Google
export const googleAuthAPI = {
  login: (data) => API.post('/auth/google', data),
};

// OTP Verification
export const otpAPI = {
  verify: (otp) => API.post('/auth/verify-otp', { otp }),
  resend: () => API.post('/auth/resend-otp'),
};

// Forgot / Reset Password
export const passwordAPI = {
  forgot: (email) => API.post('/auth/forgot-password', { email }),
  reset: (email, otp, newPassword) => API.post('/auth/reset-password', { email, otp, newPassword }),
};

// Reviews
export const reviewsAPI = {
  getAll: (propertyId) => API.get(`/properties/${propertyId}/reviews`),
  create: (propertyId, data) => API.post(`/properties/${propertyId}/reviews`, data),
  delete: (propertyId, reviewId) => API.delete(`/properties/${propertyId}/reviews/${reviewId}`),
};

// Notifications
export const notificationsAPI = {
  getAll: () => API.get('/notifications'),
  readAll: () => API.put('/notifications/read-all'),
  readOne: (id) => API.put(`/notifications/${id}/read`),
  delete: (id) => API.delete(`/notifications/${id}`),
};
