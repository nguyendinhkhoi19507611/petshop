import api from './api';

const CATEGORY_ENDPOINTS = {
  GET_ALL: '/categories',
  GET_ACTIVE: '/categories/active',
  GET_BY_ID: (id) => `/categories/${id}`,
  CREATE: '/categories',
  UPDATE: (id) => `/categories/${id}`,
  DELETE: (id) => `/categories/${id}`,
  TOGGLE_STATUS: (id) => `/categories/${id}/toggle-status`,
  GET_PRODUCTS: (id) => `/categories/${id}/products`,
};

export const categoryService = {
  // Lấy tất cả danh mục với phân trang và tìm kiếm
  getAll: (params = {}) => {
    const { page = 0, size = 10, search = '' } = params;
    return api.get(CATEGORY_ENDPOINTS.GET_ALL, {
      params: { page, size, search }
    });
  },

  // Lấy danh mục hoạt động (cho dropdown)
  getActive: () => {
    return api.get(CATEGORY_ENDPOINTS.GET_ACTIVE);
  },

  // Lấy danh mục theo ID
  getById: (id) => {
    return api.get(CATEGORY_ENDPOINTS.GET_BY_ID(id));
  },

  // Tạo danh mục mới
  create: (data) => {
    return api.post(CATEGORY_ENDPOINTS.CREATE, data);
  },

  // Cập nhật danh mục
  update: (id, data) => {
    return api.put(CATEGORY_ENDPOINTS.UPDATE(id), data);
  },

  // Xóa danh mục
  delete: (id) => {
    return api.delete(CATEGORY_ENDPOINTS.DELETE(id));
  },

  // Bật/tắt trạng thái danh mục
  toggleStatus: (id) => {
    return api.post(CATEGORY_ENDPOINTS.TOGGLE_STATUS(id));
  },

  // Lấy sản phẩm theo danh mục
  getProducts: (id) => {
    return api.get(CATEGORY_ENDPOINTS.GET_PRODUCTS(id));
  },
};

export default categoryService;