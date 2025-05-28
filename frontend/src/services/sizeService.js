import api from './api';

const SIZE_ENDPOINTS = {
  GET_ALL: '/sizes',
  GET_ACTIVE: '/sizes/active',
  GET_BY_UNIT: (unit) => `/sizes/by-unit/${unit}`,
  GET_BY_ID: (id) => `/sizes/${id}`,
  CREATE: '/sizes',
  UPDATE: (id) => `/sizes/${id}`,
  DELETE: (id) => `/sizes/${id}`,
  TOGGLE_STATUS: (id) => `/sizes/${id}/toggle-status`,
  UPDATE_DISPLAY_ORDER: '/sizes/display-order',
};

export const sizeService = {
  // Lấy tất cả kích cỡ với phân trang và tìm kiếm
  getAll: (params = {}) => {
    const { page = 0, size = 10, search = '', status = null } = params;
    return api.get(SIZE_ENDPOINTS.GET_ALL, {
      params: { page, size, search, status }
    });
  },

  // Lấy kích cỡ hoạt động (cho dropdown)
  getActive: () => {
    return api.get(SIZE_ENDPOINTS.GET_ACTIVE);
  },

  // Lấy kích cỡ theo đơn vị
  getByUnit: (unit) => {
    return api.get(SIZE_ENDPOINTS.GET_BY_UNIT(unit));
  },

  // Lấy kích cỡ theo ID
  getById: (id) => {
    return api.get(SIZE_ENDPOINTS.GET_BY_ID(id));
  },

  // Tạo kích cỡ mới
  create: (data) => {
    return api.post(SIZE_ENDPOINTS.CREATE, data);
  },

  // Cập nhật kích cỡ
  update: (id, data) => {
    return api.put(SIZE_ENDPOINTS.UPDATE(id), data);
  },

  // Xóa kích cỡ
  delete: (id) => {
    return api.delete(SIZE_ENDPOINTS.DELETE(id));
  },

  // Bật/tắt trạng thái kích cỡ
  toggleStatus: (id) => {
    return api.post(SIZE_ENDPOINTS.TOGGLE_STATUS(id));
  },

  // Cập nhật thứ tự hiển thị
  updateDisplayOrder: (sizeIds) => {
    return api.put(SIZE_ENDPOINTS.UPDATE_DISPLAY_ORDER, sizeIds);
  },
};

export default sizeService;