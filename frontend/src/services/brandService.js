import api from './api';

const BRAND_ENDPOINTS = {
  GET_ALL: '/brands',
  GET_ACTIVE: '/brands/active',
  GET_TOP: '/brands/top',
  GET_BY_ID: (id) => `/brands/${id}`,
  CREATE: '/brands',
  UPDATE: (id) => `/brands/${id}`,
  DELETE: (id) => `/brands/${id}`,
  TOGGLE_STATUS: (id) => `/brands/${id}/toggle-status`,
};

export const brandService = {
  // Lấy tất cả thương hiệu với phân trang và tìm kiếm
  getAll: (params = {}) => {
    const { page = 0, size = 10, search = '', status = null } = params;
    return api.get(BRAND_ENDPOINTS.GET_ALL, {
      params: { page, size, search, status }
    });
  },

  // Lấy thương hiệu hoạt động (cho dropdown)
  getActive: () => {
    return api.get(BRAND_ENDPOINTS.GET_ACTIVE);
  },

  // Lấy top thương hiệu
  getTop: (limit = 10) => {
    return api.get(BRAND_ENDPOINTS.GET_TOP, {
      params: { limit }
    });
  },

  // Lấy thương hiệu theo ID
  getById: (id) => {
    return api.get(BRAND_ENDPOINTS.GET_BY_ID(id));
  },

  // Tạo thương hiệu mới
  create: (data) => {
    return api.post(BRAND_ENDPOINTS.CREATE, data);
  },

  // Cập nhật thương hiệu
  update: (id, data) => {
    return api.put(BRAND_ENDPOINTS.UPDATE(id), data);
  },

  // Xóa thương hiệu
  delete: (id) => {
    return api.delete(BRAND_ENDPOINTS.DELETE(id));
  },

  // Bật/tắt trạng thái thương hiệu
  toggleStatus: (id) => {
    return api.post(BRAND_ENDPOINTS.TOGGLE_STATUS(id));
  },
};

export default brandService;