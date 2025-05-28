// API Base URL
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    TEST: '/auth/test'
  },
  USERS: {
    GET_ALL: '/users',
    GET_BY_ID: (id) => `/users/${id}`,
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
    TOGGLE_STATUS: (id) => `/users/${id}/toggle-status`,
    RESET_PASSWORD: (id) => `/users/${id}/reset-password`
  },
  CATEGORIES: {
    GET_ALL: '/categories',
    GET_ACTIVE: '/categories/active',
    GET_BY_ID: (id) => `/categories/${id}`,
    CREATE: '/categories',
    UPDATE: (id) => `/categories/${id}`,
    DELETE: (id) => `/categories/${id}`,
    TOGGLE_STATUS: (id) => `/categories/${id}/toggle-status`,
    GET_PRODUCTS: (id) => `/categories/${id}/products`
  },
  BRANDS: {
    GET_ALL: '/brands',
    GET_ACTIVE: '/brands/active',
    GET_TOP: '/brands/top',
    GET_BY_ID: (id) => `/brands/${id}`,
    CREATE: '/brands',
    UPDATE: (id) => `/brands/${id}`,
    DELETE: (id) => `/brands/${id}`,
    TOGGLE_STATUS: (id) => `/brands/${id}/toggle-status`
  },
  SIZES: {
    GET_ALL: '/sizes',
    GET_ACTIVE: '/sizes/active',
    GET_BY_UNIT: (unit) => `/sizes/by-unit/${unit}`,
    GET_BY_ID: (id) => `/sizes/${id}`,
    CREATE: '/sizes',
    UPDATE: (id) => `/sizes/${id}`,
    DELETE: (id) => `/sizes/${id}`,
    TOGGLE_STATUS: (id) => `/sizes/${id}/toggle-status`,
    UPDATE_DISPLAY_ORDER: '/sizes/display-order'
  },
  PRODUCT_TYPES: {
    GET_ALL: '/product-types',
    GET_ACTIVE: '/product-types/active',
    GET_BY_CATEGORY: (categoryId) => `/product-types/by-category/${categoryId}`,
    GET_BY_ID: (id) => `/product-types/${id}`,
    CREATE: '/product-types',
    UPDATE: (id) => `/product-types/${id}`,
    DELETE: (id) => `/product-types/${id}`,
    TOGGLE_STATUS: (id) => `/product-types/${id}/toggle-status`
  },
  PRODUCTS: {
    GET_ALL: '/products',
    GET_BY_ID: (id) => `/products/${id}`,
    CREATE: '/products',
    UPDATE: (id) => `/products/${id}`,
    DELETE: (id) => `/products/${id}`,
    UPLOAD_IMAGE: (id) => `/products/${id}/upload-image`,
    SEARCH: '/products/search',
    FEATURED: '/products/featured',
    ON_SALE: '/products/on-sale'
  },
  ORDERS: {
    GET_ALL: '/orders',
    GET_BY_ID: (id) => `/orders/${id}`,
    CREATE: '/orders',
    UPDATE_STATUS: (id) => `/orders/${id}/status`,
    CANCEL: (id) => `/orders/${id}/cancel`,
    MY_ORDERS: '/orders/my-orders',
    BY_STATUS: (status) => `/orders/status/${status}`
  },
  PROMOTIONS: {
    GET_ALL: '/promotions',
    GET_ACTIVE: '/promotions/active',
    GET_BY_ID: (id) => `/promotions/${id}`,
    CREATE: '/promotions',
    UPDATE: (id) => `/promotions/${id}`,
    DELETE: (id) => `/promotions/${id}`,
    TOGGLE_STATUS: (id) => `/promotions/${id}/toggle`,
    VALIDATE_COUPON: '/promotions/validate-coupon'
  },
  CART: {
    GET_CART: '/cart',
    ADD_ITEM: '/cart/items',
    UPDATE_ITEM: (itemId) => `/cart/items/${itemId}`,
    REMOVE_ITEM: (itemId) => `/cart/items/${itemId}`,
    CLEAR: '/cart/clear',
    SUMMARY: '/cart/summary',
    APPLY_COUPON: '/cart/apply-coupon'
  },
  ADDRESSES: {
    GET_PROVINCES: '/addresses/provinces',
    GET_DISTRICTS: (provinceId) => `/addresses/districts/${provinceId}`,
    GET_WARDS: (districtId) => `/addresses/wards/${districtId}`,
    USER_ADDRESSES: (userId) => `/users/${userId}/addresses`,
    CREATE: (userId) => `/users/${userId}/addresses`,
    UPDATE: (id) => `/addresses/${id}`,
    DELETE: (id) => `/addresses/${id}`,
    SET_DEFAULT: (id) => `/addresses/${id}/set-default`
  }
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  EMPLOYEE: 'NHÂN VIÊN',
  CUSTOMER: 'KHÁCH HÀNG'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'pet_shop_token',
  USER: 'pet_shop_user',
  CART: 'pet_shop_cart'
};

// Navigation Items
export const NAVIGATION_ITEMS = {
  ADMIN: [
    { title: 'Dashboard', path: '/dashboard', icon: 'Home' },
    { title: 'Quản lý danh mục', path: '/admin/categories', icon: 'Folder' },
    { title: 'Quản lý thương hiệu', path: '/admin/brands', icon: 'Tag' },
    { title: 'Quản lý kích cỡ', path: '/admin/sizes', icon: 'Ruler' },
    { title: 'Loại sản phẩm', path: '/admin/product-types', icon: 'List' },
    { title: 'Quản lý sản phẩm', path: '/admin/products', icon: 'Package' },
    { title: 'Quản lý người dùng', path: '/admin/users', icon: 'Users' },
    { title: 'Quản lý đơn hàng', path: '/admin/orders', icon: 'ShoppingCart' },
    { title: 'Khuyến mãi', path: '/admin/promotions', icon: 'Gift' },
    { title: 'Báo cáo', path: '/admin/reports', icon: 'BarChart3' }
  ],
  EMPLOYEE: [
    { title: 'Dashboard', path: '/dashboard', icon: 'Home' },
    { title: 'Danh mục', path: '/employee/categories', icon: 'Folder' },
    { title: 'Thương hiệu', path: '/employee/brands', icon: 'Tag' },
    { title: 'Kích cỡ', path: '/employee/sizes', icon: 'Ruler' },
    { title: 'Sản phẩm', path: '/employee/products', icon: 'Package' },
    { title: 'Đơn hàng', path: '/employee/orders', icon: 'ShoppingCart' },
    { title: 'Hỗ trợ khách hàng', path: '/employee/support', icon: 'MessageCircle' }
  ],
  CUSTOMER: [
    { title: 'Trang chủ', path: '/dashboard', icon: 'Home' },
    { title: 'Sản phẩm', path: '/products', icon: 'Package' },
    { title: 'Giỏ hàng', path: '/cart', icon: 'ShoppingCart' },
    { title: 'Đơn hàng của tôi', path: '/my-orders', icon: 'List' },
    { title: 'Hỗ trợ', path: '/support', icon: 'MessageCircle' }
  ]
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'CHỜ_XỬ_LÝ',
  CONFIRMED: 'ĐÃ_XÁC_NHẬN',
  PREPARING: 'ĐANG_CHUẨN_BỊ',
  SHIPPING: 'ĐANG_GIAO',
  COMPLETED: 'HOÀN_THÀNH',
  CANCELLED: 'ĐÃ_HỦY'
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'CHỜ_THANH_TOÁN',
  PAID: 'ĐÃ_THANH_TOÁN',
  FAILED: 'THẤT_BẠI',
  REFUNDED: 'HOÀN_TIỀN'
};

// Payment Methods
export const PAYMENT_METHODS = {
  COD: 'COD',
  BANK_TRANSFER: 'BANK_TRANSFER',
  CREDIT_CARD: 'CREDIT_CARD',
  E_WALLET: 'E_WALLET'
};

// Common Messages
export const MESSAGES = {
  SUCCESS: {
    LOGIN: 'Đăng nhập thành công!',
    LOGOUT: 'Đăng xuất thành công!',
    REGISTER: 'Đăng ký thành công!',
    CREATE: 'Tạo mới thành công!',
    UPDATE: 'Cập nhật thành công!',
    DELETE: 'Xóa thành công!',
    STATUS_CHANGED: 'Thay đổi trạng thái thành công!',
    CART_ADDED: 'Đã thêm vào giỏ hàng!',
    CART_UPDATED: 'Cập nhật giỏ hàng thành công!',
    ORDER_CREATED: 'Đặt hàng thành công!',
    PASSWORD_RESET: 'Đặt lại mật khẩu thành công!'
  },
  ERROR: {
    LOGIN_FAILED: 'Đăng nhập thất bại!',
    REGISTER_FAILED: 'Đăng ký thất bại!',
    NETWORK_ERROR: 'Lỗi kết nối mạng!',
    SERVER_ERROR: 'Lỗi máy chủ!',
    UNAUTHORIZED: 'Bạn không có quyền truy cập!',
    FORBIDDEN: 'Truy cập bị từ chối!',
    NOT_FOUND: 'Không tìm thấy dữ liệu!',
    VALIDATION_ERROR: 'Dữ liệu không hợp lệ!',
    DUPLICATE_ERROR: 'Dữ liệu đã tồn tại!',
    DELETE_ERROR: 'Không thể xóa do có dữ liệu liên quan!',
    OUT_OF_STOCK: 'Sản phẩm đã hết hàng!',
    INVALID_COUPON: 'Mã giảm giá không hợp lệ!',
    ORDER_CANCELLED: 'Đơn hàng đã bị hủy!'
  },
  CONFIRM: {
    DELETE: 'Bạn có chắc chắn muốn xóa?',
    CANCEL: 'Bạn có chắc chắn muốn hủy?',
    LOGOUT: 'Bạn có chắc chắn muốn đăng xuất?',
    CLEAR_CART: 'Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng?'
  }
};

// Pagination Config
export const PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 10,
  SIZE_OPTIONS: [5, 10, 25, 50],
  MAX_SIZE: 100
};

// Form Validation
export const VALIDATION = {
  USER: {
    USERNAME_MIN_LENGTH: 3,
    USERNAME_MAX_LENGTH: 50,
    PASSWORD_MIN_LENGTH: 6,
    FULL_NAME_MIN_LENGTH: 2,
    FULL_NAME_MAX_LENGTH: 100
  },
  CATEGORY: {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 100,
    DESCRIPTION_MAX_LENGTH: 500
  },
  BRAND: {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 50,
    DESCRIPTION_MAX_LENGTH: 500,
    WEBSITE_PATTERN: /^https?:\/\/.+/
  },
  SIZE: {
    NAME_MAX_LENGTH: 50,
    DESCRIPTION_MAX_LENGTH: 500,
    VALUE_MAX_LENGTH: 20,
    DISPLAY_ORDER_MIN: 0,
    DISPLAY_ORDER_MAX: 999
  },
  PRODUCT: {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 500,
    DESCRIPTION_MAX_LENGTH: 5000,
    PRICE_MIN: 0,
    STOCK_MIN: 0
  },
  ADDRESS: {
    RECEIVER_NAME_MAX_LENGTH: 50,
    PHONE_PATTERN: /^[0-9]{10,11}$/,
    STREET_ADDRESS_MAX_LENGTH: 100,
    NOTE_MAX_LENGTH: 500
  }
};

// Size Units
export const SIZE_UNITS = {
  WEIGHT: {
    value: 'weight',
    label: 'Trọng lượng',
    suffix: 'g',
    examples: ['100g', '500g', '1kg', '2kg']
  },
  VOLUME: {
    value: 'volume',
    label: 'Thể tích',
    suffix: 'ml',
    examples: ['250ml', '500ml', '1L']
  },
  SIZE: {
    value: 'size',
    label: 'Kích cỡ',
    suffix: '',
    examples: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  LENGTH: {
    value: 'length',
    label: 'Chiều dài',
    suffix: 'cm',
    examples: ['10cm', '20cm', '50cm']
  },
  OTHER: {
    value: 'other',
    label: 'Khác',
    suffix: '',
    examples: ['Custom']
  }
};

// Discount Types
export const DISCOUNT_TYPES = {
  PERCENTAGE: 'PERCENTAGE',
  FIXED_AMOUNT: 'FIXED_AMOUNT'
};

// Product Status
export const PRODUCT_STATUS = {
  ACTIVE: true,
  INACTIVE: false
};

// Gender
export const GENDER = {
  MALE: true,
  FEMALE: false
};

// File Upload
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
};

// Date Format
export const DATE_FORMAT = {
  DISPLAY: 'dd/MM/yyyy',
  API: 'yyyy-MM-dd',
  DATETIME: 'dd/MM/yyyy HH:mm',
  TIME: 'HH:mm'
};