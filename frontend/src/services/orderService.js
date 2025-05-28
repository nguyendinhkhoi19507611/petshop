import api from './api';

const ORDER_ENDPOINTS = {
  GET_ALL: '/orders',
  GET_BY_ID: (id) => `/orders/${id}`,
  CREATE: '/orders',
  UPDATE_STATUS: (id) => `/orders/${id}/status`,
  CANCEL: (id) => `/orders/${id}`,
  MY_ORDERS: '/orders/my-orders',
  TRACKING: (id) => `/orders/${id}/tracking`,
  CANCEL_BY_CUSTOMER: (id) => `/orders/${id}/cancel`,
  BY_STATUS: (status) => `/orders/status/${status}`,
  CONFIRM: (id) => `/orders/${id}/confirm`,
  SHIP: (id) => `/orders/${id}/ship`,
  COMPLETE: (id) => `/orders/${id}/complete`,
};

export const orderService = {
  // Lấy tất cả đơn hàng (Admin/Employee)
  getAll: (params = {}) => {
    const { page = 0, size = 10, search = '', status = null } = params;
    return api.get(ORDER_ENDPOINTS.GET_ALL, {
      params: { page, size, search, status }
    });
  },

  // Lấy đơn hàng theo ID
  getById: (id) => {
    return api.get(ORDER_ENDPOINTS.GET_BY_ID(id));
  },

  // Tạo đơn hàng mới
  create: (data) => {
    return api.post(ORDER_ENDPOINTS.CREATE, data);
  },

  // Cập nhật trạng thái đơn hàng
  updateStatus: (id, data) => {
    return api.put(ORDER_ENDPOINTS.UPDATE_STATUS(id), data);
  },

  // Hủy đơn hàng (Admin/Employee)
  cancel: (id, data) => {
    return api.delete(ORDER_ENDPOINTS.CANCEL(id), { data });
  },

  // Lấy đơn hàng của tôi
  getMyOrders: (params = {}) => {
    const { page = 0, size = 10, status = null } = params;
    return api.get(ORDER_ENDPOINTS.MY_ORDERS, {
      params: { page, size, status }
    });
  },

  // Theo dõi đơn hàng
  trackOrder: (id) => {
    return api.get(ORDER_ENDPOINTS.TRACKING(id));
  },

  // Hủy đơn hàng (Customer)
  cancelByCustomer: (id, data) => {
    return api.post(ORDER_ENDPOINTS.CANCEL_BY_CUSTOMER(id), data);
  },

  // Lấy đơn hàng theo trạng thái
  getByStatus: (status, params = {}) => {
    const { page = 0, size = 10 } = params;
    return api.get(ORDER_ENDPOINTS.BY_STATUS(status), {
      params: { page, size }
    });
  },

  // Xác nhận đơn hàng
  confirm: (id) => {
    return api.post(ORDER_ENDPOINTS.CONFIRM(id));
  },

  // Giao hàng
  ship: (id, trackingNumber = null) => {
    return api.post(ORDER_ENDPOINTS.SHIP(id), { 
      params: { trackingNumber } 
    });
  },

  // Hoàn thành đơn hàng
  complete: (id) => {
    return api.post(ORDER_ENDPOINTS.COMPLETE(id));
  },
};

export default orderService;