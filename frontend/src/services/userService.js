import api from './api';

const USER_ENDPOINTS = {
  GET_ALL: '/users',
  GET_BY_ID: (id) => `/users/${id}`,
  UPDATE: (id) => `/users/${id}`,
  DELETE: (id) => `/users/${id}`,
  TOGGLE_STATUS: (id) => `/users/${id}/toggle-status`,
  GET_ORDERS: (id) => `/users/${id}/orders`,
  CHANGE_PASSWORD: (id) => `/users/${id}/password`,
  RESET_PASSWORD: (id) => `/users/${id}/reset-password`,
};

export const userService = {
  // Lấy tất cả người dùng (Admin only)
  getAll: (params = {}) => {
    const { page = 0, size = 10, search = '', role = '', status = null } = params;
    return api.get(USER_ENDPOINTS.GET_ALL, {
      params: { page, size, search, role, status }
    });
  },

  // Lấy người dùng theo ID
  getById: (id) => {
    return api.get(USER_ENDPOINTS.GET_BY_ID(id));
  },

  // Cập nhật người dùng
  update: (id, data) => {
    return api.put(USER_ENDPOINTS.UPDATE(id), data);
  },

  // Xóa người dùng
  delete: (id) => {
    return api.delete(USER_ENDPOINTS.DELETE(id));
  },

  // Bật/tắt trạng thái người dùng
  toggleStatus: (id) => {
    return api.post(USER_ENDPOINTS.TOGGLE_STATUS(id));
  },

  // Lấy đơn hàng của người dùng
  getUserOrders: (id) => {
    return api.get(USER_ENDPOINTS.GET_ORDERS(id));
  },

  // Đổi mật khẩu
  changePassword: (id, data) => {
    return api.put(USER_ENDPOINTS.CHANGE_PASSWORD(id), data);
  },

  // Reset mật khẩu (Admin only)
  resetPassword: (id, newPassword) => {
    return api.post(USER_ENDPOINTS.RESET_PASSWORD(id), { newPassword });
  },
};

export default userService;