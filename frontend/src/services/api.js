import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS, MESSAGES } from '../utils/constants';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
          localStorage.removeItem(STORAGE_KEYS.CART);
          
          // Only redirect if not already on login/register page
          if (!['/login', '/register'].includes(window.location.pathname)) {
            window.location.href = '/login';
          }
          break;
        case 403:
          // Forbidden - redirect to unauthorized page
          if (window.location.pathname !== '/unauthorized') {
            window.location.href = '/unauthorized';
          }
          break;
        case 404:
          console.error(MESSAGES.ERROR.NOT_FOUND);
          break;
        case 500:
          console.error(MESSAGES.ERROR.SERVER_ERROR);
          break;
        default:
          console.error('API Error:', error.response.data?.message || error.message);
      }
    } else if (error.request) {
      // Network error
      console.error(MESSAGES.ERROR.NETWORK_ERROR);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  test: () => api.post('/auth/test'),
  refreshToken: () => api.post('/auth/refresh'),
};

// Test API
export const testAPI = {
  public: () => api.get('/test/all'),
  customer: () => api.get('/test/customer'),
  employee: () => api.get('/test/employee'),
  admin: () => api.get('/test/admin'),
};

// User API
export const userAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
  toggleStatus: (id) => api.post(`/users/${id}/toggle-status`),
  resetPassword: (id, newPassword) => api.post(`/users/${id}/reset-password`, { newPassword }),
  changePassword: (id, data) => api.put(`/users/${id}/password`, data),
  getUserOrders: (id) => api.get(`/users/${id}/orders`),
};

// Category API
export const categoryAPI = {
  getAll: (params) => api.get('/categories', { params }),
  getActive: () => api.get('/categories/active'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (categoryData) => api.post('/categories', categoryData),
  update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  delete: (id) => api.delete(`/categories/${id}`),
  toggleStatus: (id) => api.post(`/categories/${id}/toggle-status`),
  getProducts: (id, params) => api.get(`/categories/${id}/products`, { params }),
};

// Brand API
export const brandAPI = {
  getAll: (params) => api.get('/brands', { params }),
  getActive: () => api.get('/brands/active'),
  getTop: (limit) => api.get('/brands/top', { params: { limit } }),
  getById: (id) => api.get(`/brands/${id}`),
  create: (brandData) => api.post('/brands', brandData),
  update: (id, brandData) => api.put(`/brands/${id}`, brandData),
  delete: (id) => api.delete(`/brands/${id}`),
  toggleStatus: (id) => api.post(`/brands/${id}/toggle-status`),
};

// Size API
export const sizeAPI = {
  getAll: (params) => api.get('/sizes', { params }),
  getActive: () => api.get('/sizes/active'),
  getByUnit: (unit) => api.get(`/sizes/by-unit/${unit}`),
  getById: (id) => api.get(`/sizes/${id}`),
  create: (sizeData) => api.post('/sizes', sizeData),
  update: (id, sizeData) => api.put(`/sizes/${id}`, sizeData),
  delete: (id) => api.delete(`/sizes/${id}`),
  toggleStatus: (id) => api.post(`/sizes/${id}/toggle-status`),
  updateDisplayOrder: (sizeIds) => api.put('/sizes/display-order', sizeIds),
};

// Product Type API
export const productTypeAPI = {
  getAll: (params) => api.get('/product-types', { params }),
  getActive: () => api.get('/product-types/active'),
  getByCategory: (categoryId) => api.get(`/product-types/by-category/${categoryId}`),
  getById: (id) => api.get(`/product-types/${id}`),
  create: (data) => api.post('/product-types', data),
  update: (id, data) => api.put(`/product-types/${id}`, data),
  delete: (id) => api.delete(`/product-types/${id}`),
  toggleStatus: (id) => api.post(`/product-types/${id}/toggle-status`),
};

// Product API
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (productData) => api.post('/products', productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`),
  search: (params) => api.get('/products/search', { params }),
  getFeatured: (params) => api.get('/products/featured', { params }),
  getOnSale: (params) => api.get('/products/on-sale', { params }),
  getBestSellers: (params) => api.get('/products/bestsellers', { params }),
  getLowStock: (params) => api.get('/products/low-stock', { params }),
  getRelated: (id, params) => api.get(`/products/${id}/related`, { params }),
  uploadImage: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/products/${id}/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  updateStock: (id, data) => api.put(`/products/${id}/stock`, data),
};

// Order API
export const orderAPI = {
  getAll: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  getMyOrders: (params) => api.get('/orders/my-orders', { params }),
  getByStatus: (status, params) => api.get(`/orders/status/${status}`, { params }),
  create: (orderData) => api.post('/orders', orderData),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  cancel: (id, data) => api.delete(`/orders/${id}`, { data }),
  cancelByCustomer: (id, data) => api.post(`/orders/${id}/cancel`, data),
  confirm: (id) => api.post(`/orders/${id}/confirm`),
  ship: (id, trackingNumber) => api.post(`/orders/${id}/ship`, { trackingNumber }),
  complete: (id) => api.post(`/orders/${id}/complete`),
  tracking: (id) => api.get(`/orders/${id}/tracking`),
};

// Promotion API
export const promotionAPI = {
  getAll: (params) => api.get('/promotions', { params }),
  getActive: (params) => api.get('/promotions/active', { params }),
  getApplicable: () => api.get('/promotions/applicable'),
  getById: (id) => api.get(`/promotions/${id}`),
  create: (data) => api.post('/promotions', data),
  update: (id, data) => api.put(`/promotions/${id}`, data),
  delete: (id) => api.delete(`/promotions/${id}`),
  toggleStatus: (id) => api.post(`/promotions/${id}/toggle`),
  validateCoupon: (data) => api.post('/promotions/validate-coupon', data),
};

// Cart API
export const cartAPI = {
  getCart: () => api.get('/cart'),
  getCartSummary: () => api.get('/cart/summary'),
  addToCart: (data) => api.post('/cart/items', data),
  updateCartItem: (itemId, data) => api.put(`/cart/items/${itemId}`, data),
  removeFromCart: (itemId) => api.delete(`/cart/items/${itemId}`),
  clearCart: () => api.delete('/cart/clear'),
  applyCoupon: (data) => api.post('/cart/apply-coupon', data),
};

// Address API
export const addressAPI = {
  getProvinces: () => api.get('/addresses/provinces'),
  getDistricts: (provinceId) => api.get(`/addresses/districts/${provinceId}`),
  getWards: (districtId) => api.get(`/addresses/wards/${districtId}`),
  getUserAddresses: (userId) => api.get(`/users/${userId}/addresses`),
  createAddress: (userId, data) => api.post(`/users/${userId}/addresses`, data),
  updateAddress: (id, data) => api.put(`/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/addresses/${id}`),
  setDefaultAddress: (id) => api.post(`/addresses/${id}/set-default`),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentOrders: (params) => api.get('/dashboard/recent-orders', { params }),
  getTopProducts: (params) => api.get('/dashboard/top-products', { params }),
  getRevenueChart: (params) => api.get('/dashboard/revenue-chart', { params }),
  getOrderChart: (params) => api.get('/dashboard/order-chart', { params }),
  getCustomerStats: () => api.get('/dashboard/customer-stats'),
  getInventoryStats: () => api.get('/dashboard/inventory-stats'),
  getSystemHealth: () => api.get('/dashboard/system-health'),
};

// Report API
export const reportAPI = {
  getSalesReport: (params) => api.get('/reports/sales', { params }),
  getInventoryReport: (params) => api.get('/reports/inventory', { params }),
  getCustomerReport: (params) => api.get('/reports/customers', { params }),
  getProductReport: (params) => api.get('/reports/products', { params }),
  exportReport: (type, params) => api.get(`/reports/export/${type}`, {
    params,
    responseType: 'blob'
  }),
};

// Notification API
export const notificationAPI = {
  getNotifications: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
  getUnreadCount: () => api.get('/notifications/unread-count'),
};

export default api;