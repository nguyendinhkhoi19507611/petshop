import api from './api';

const PRODUCT_TYPE_ENDPOINTS = {
  GET_ALL: '/product-types',
  GET_ACTIVE: '/product-types/active',
  GET_BY_CATEGORY: (categoryId) => `/product-types/by-category/${categoryId}`,
  GET_BY_TYPE: (type) => `/product-types/by-type/${type}`,
  GET_BY_ID: (id) => `/product-types/${id}`,
  CREATE: '/product-types',
  UPDATE: (id) => `/product-types/${id}`,
  DELETE: (id) => `/product-types/${id}`,
  TOGGLE_STATUS: (id) => `/product-types/${id}/toggle-status`,
};

export const productTypeService = {
  // Lấy tất cả loại sản phẩm với phân trang và tìm kiếm
  getAll: (params = {}) => {
    const { page = 0, size = 10, search = '', status = null, categoryId = null } = params;
    return api.get(PRODUCT_TYPE_ENDPOINTS.GET_ALL, {
      params: { page, size, search, status, categoryId }
    });
  },

  // Lấy loại sản phẩm hoạt động (cho dropdown)
  getActive: () => {
    return api.get(PRODUCT_TYPE_ENDPOINTS.GET_ACTIVE);
  },

  // Lấy loại sản phẩm theo danh mục
  getByCategory: (categoryId) => {
    return api.get(PRODUCT_TYPE_ENDPOINTS.GET_BY_CATEGORY(categoryId));
  },

  // Lấy loại sản phẩm theo type code
  getByType: (type) => {
    return api.get(PRODUCT_TYPE_ENDPOINTS.GET_BY_TYPE(type));
  },

  // Lấy loại sản phẩm theo ID
  getById: (id) => {
    return api.get(PRODUCT_TYPE_ENDPOINTS.GET_BY_ID(id));
  },

  // Tạo loại sản phẩm mới
  create: (data) => {
    return api.post(PRODUCT_TYPE_ENDPOINTS.CREATE, data);
  },

  // Cập nhật loại sản phẩm
  update: (id, data) => {
    return api.put(PRODUCT_TYPE_ENDPOINTS.UPDATE(id), data);
  },

  // Xóa loại sản phẩm
  delete: (id) => {
    return api.delete(PRODUCT_TYPE_ENDPOINTS.DELETE(id));
  },

  // Bật/tắt trạng thái loại sản phẩm
  toggleStatus: (id) => {
    return api.post(PRODUCT_TYPE_ENDPOINTS.TOGGLE_STATUS(id));
  },
};

export default productTypeService;