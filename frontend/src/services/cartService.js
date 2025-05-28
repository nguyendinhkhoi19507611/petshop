import api from './api';

const CART_ENDPOINTS = {
  GET_CART: '/cart',
  ADD_TO_CART: '/cart/items',
  UPDATE_ITEM: (itemId) => `/cart/items/${itemId}`,
  REMOVE_ITEM: (itemId) => `/cart/items/${itemId}`,
  CLEAR_CART: '/cart/clear',
  GET_SUMMARY: '/cart/summary',
  APPLY_COUPON: '/cart/apply-coupon',
};

export const cartService = {
  // Lấy giỏ hàng hiện tại
  getCart: () => {
    return api.get(CART_ENDPOINTS.GET_CART);
  },

  // Thêm sản phẩm vào giỏ
  addToCart: (data) => {
    return api.post(CART_ENDPOINTS.ADD_TO_CART, data);
  },

  // Cập nhật số lượng sản phẩm
  updateCartItem: (itemId, data) => {
    return api.put(CART_ENDPOINTS.UPDATE_ITEM(itemId), data);
  },

  // Xóa sản phẩm khỏi giỏ
  removeFromCart: (itemId) => {
    return api.delete(CART_ENDPOINTS.REMOVE_ITEM(itemId));
  },

  // Xóa toàn bộ giỏ hàng
  clearCart: () => {
    return api.delete(CART_ENDPOINTS.CLEAR_CART);
  },

  // Lấy tóm tắt giỏ hàng
  getCartSummary: () => {
    return api.get(CART_ENDPOINTS.GET_SUMMARY);
  },

  // Áp dụng mã giảm giá
  applyCoupon: (data) => {
    return api.post(CART_ENDPOINTS.APPLY_COUPON, data);
  },
};

export default cartService;