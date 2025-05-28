import api from './api';

const PROMOTION_ENDPOINTS = {
  GET_ALL: '/promotions',
  GET_ACTIVE: '/promotions/active',
  GET_APPLICABLE: '/promotions/applicable',
  GET_BY_ID: (id) => `/promotions/${id}`,
  CREATE: '/promotions',
  UPDATE: (id) => `/promotions/${id}`,
  DELETE: (id) => `/promotions/${id}`,
  TOGGLE_STATUS: (id) => `/promotions/${id}/toggle`,
  VALIDATE_COUPON: '/promotions/validate-coupon',
};

export const promotionService = {
  // Lấy tất cả khuyến mãi với phân trang và tìm kiếm
  getAll: (params = {}) => {
    const { page = 0, size = 10, search = '', status = null } = params;
    return api.get(PROMOTION_ENDPOINTS.GET_ALL, {
      params: { page, size, search, status }
    });
  },

  // Lấy khuyến mãi đang hoạt động
  getActive: (params = {}) => {
    const { page = 0, size = 10 } = params;
    return api.get(PROMOTION_ENDPOINTS.GET_ACTIVE, {
      params: { page, size }
    });
  },

  // Lấy khuyến mãi có thể áp dụng
  getApplicable: () => {
    return api.get(PROMOTION_ENDPOINTS.GET_APPLICABLE);
  },

  // Lấy khuyến mãi theo ID
  getById: (id) => {
    return api.get(PROMOTION_ENDPOINTS.GET_BY_ID(id));
  },

  // Tạo khuyến mãi mới
  create: (data) => {
    return api.post(PROMOTION_ENDPOINTS.CREATE, data);
  },

  // Cập nhật khuyến mãi
  update: (id, data) => {
    return api.put(PROMOTION_ENDPOINTS.UPDATE(id), data);
  },

  // Xóa khuyến mãi
  delete: (id) => {
    return api.delete(PROMOTION_ENDPOINTS.DELETE(id));
  },

  // Bật/tắt trạng thái khuyến mãi
  toggleStatus: (id) => {
    return api.post(PROMOTION_ENDPOINTS.TOGGLE_STATUS(id));
  },

  // Validate mã giảm giá
  validateCoupon: (data) => {
    return api.post(PROMOTION_ENDPOINTS.VALIDATE_COUPON, data);
  },
};

export default promotionService;