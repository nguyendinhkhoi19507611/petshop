import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS, MESSAGES } from '../utils/constants';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
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
          
          // Only redirect if not already on login page
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
        case 403:
          // Forbidden - redirect to unauthorized page
          window.location.href = '/unauthorized';
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
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
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
  getProducts: (id) => api.get(`/categories/${id}/products`),
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

// Product API (placeholder for future implementation)
export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (productData) => api.post('/products', productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`),
};

export default api;