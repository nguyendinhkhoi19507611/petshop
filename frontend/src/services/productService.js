import api from './api';

const PRODUCT_ENDPOINTS = {
  GET_ALL: '/products',
  GET_BY_ID: (id) => `/products/${id}`,
  CREATE: '/products',
  UPDATE: (id) => `/products/${id}`,
  DELETE: (id) => `/products/${id}`,
  SEARCH: '/products/search',
  FILTER: '/products/filter',
  UPLOAD_IMAGE: (id) => `/products/${id}/upload-image`,
  UPDATE_STOCK: (id) => `/products/${id}/stock`,
  LOW_STOCK: '/products/low-stock',
  BESTSELLERS: '/products/bestsellers',
  FEATURED: '/products/featured',
  ON_SALE: '/products/on-sale',
  RELATED: (id) => `/products/${id}/related`,
};

export const productService = {
  // Lấy tất cả sản phẩm với phân trang và tìm kiếm
  getAll: (params = {}) => {
    const { page = 0, size = 12, search = '', status = null } = params;
    return api.get(PRODUCT_ENDPOINTS.GET_ALL, {
      params: { page, size, search, status }
    });
  },

  // Lấy sản phẩm theo ID
  getById: (id) => {
    return api.get(PRODUCT_ENDPOINTS.GET_BY_ID(id));
  },

  // Tạo sản phẩm mới
  create: (data) => {
    return api.post(PRODUCT_ENDPOINTS.CREATE, data);
  },

  // Cập nhật sản phẩm
  update: (id, data) => {
    return api.put(PRODUCT_ENDPOINTS.UPDATE(id), data);
  },

  // Xóa sản phẩm
  delete: (id) => {
    return api.delete(PRODUCT_ENDPOINTS.DELETE(id));
  },

  // Tìm kiếm sản phẩm
  search: (params = {}) => {
    const { query, page = 0, size = 12 } = params;
    return api.get(PRODUCT_ENDPOINTS.SEARCH, {
      params: { query, page, size }
    });
  },

  // Lọc sản phẩm
  filter: (data) => {
    return api.post(PRODUCT_ENDPOINTS.FILTER, data);
  },

  // Upload hình ảnh sản phẩm
  uploadImage: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(PRODUCT_ENDPOINTS.UPLOAD_IMAGE(id), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Cập nhật tồn kho
  updateStock: (id, data) => {
    return api.put(PRODUCT_ENDPOINTS.UPDATE_STOCK(id), data);
  },

  // Lấy sản phẩm sắp hết hàng
  getLowStock: (params = {}) => {
    const { page = 0, size = 10 } = params;
    return api.get(PRODUCT_ENDPOINTS.LOW_STOCK, {
      params: { page, size }
    });
  },

  // Lấy sản phẩm bán chạy
  getBestSellers: (params = {}) => {
    const { page = 0, size = 12 } = params;
    return api.get(PRODUCT_ENDPOINTS.BESTSELLERS, {
      params: { page, size }
    });
  },

  // Lấy sản phẩm nổi bật
  getFeatured: (params = {}) => {
    const { page = 0, size = 12 } = params;
    return api.get(PRODUCT_ENDPOINTS.FEATURED, {
      params: { page, size }
    });
  },

  // Lấy sản phẩm khuyến mãi
  getOnSale: (params = {}) => {
    const { page = 0, size = 12 } = params;
    return api.get(PRODUCT_ENDPOINTS.ON_SALE, {
      params: { page, size }
    });
  },

  // Lấy sản phẩm liên quan
  getRelated: (id, params = {}) => {
    const { page = 0, size = 8 } = params;
    return api.get(PRODUCT_ENDPOINTS.RELATED(id), {
      params: { page, size }
    });
  },
};

export default productService;