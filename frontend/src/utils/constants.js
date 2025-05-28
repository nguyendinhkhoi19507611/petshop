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
    DELETE: (id) => `/users/${id}`
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
  PRODUCTS: {
    GET_ALL: '/products',
    GET_BY_ID: (id) => `/products/${id}`,
    CREATE: '/products',
    UPDATE: (id) => `/products/${id}`,
    DELETE: (id) => `/products/${id}`
  }
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'Admin',
  EMPLOYEE: 'Nhân viên',
  CUSTOMER: 'Khách hàng'
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
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: 'Home'
    },
    {
      title: 'Quản lý danh mục',
      path: '/admin/categories',
      icon: 'Folder'
    },
    {
      title: 'Quản lý thương hiệu',
      path: '/admin/brands',
      icon: 'Tag'
    },
    {
      title: 'Quản lý kích cỡ',
      path: '/admin/sizes',
      icon: 'Ruler'
    },
    {
      title: 'Quản lý sản phẩm',
      path: '/admin/products',
      icon: 'Package'
    },
    {
      title: 'Quản lý người dùng',
      path: '/admin/users',
      icon: 'Users'
    },
    {
      title: 'Quản lý đơn hàng',
      path: '/admin/orders',
      icon: 'ShoppingCart'
    },
    {
      title: 'Khuyến mãi',
      path: '/admin/promotions',
      icon: 'Gift'
    },
    {
      title: 'Báo cáo',
      path: '/admin/reports',
      icon: 'BarChart3'
    }
  ],
  EMPLOYEE: [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: 'Home'
    },
    {
      title: 'Danh mục',
      path: '/employee/categories',
      icon: 'Folder'
    },
    {
      title: 'Thương hiệu',
      path: '/employee/brands',
      icon: 'Tag'
    },
    {
      title: 'Kích cỡ',
      path: '/employee/sizes',
      icon: 'Ruler'
    },
    {
      title: 'Đơn hàng',
      path: '/employee/orders',
      icon: 'ShoppingCart'
    },
    {
      title: 'Sản phẩm',
      path: '/employee/products',
      icon: 'Package'
    },
    {
      title: 'Hỗ trợ khách hàng',
      path: '/employee/support',
      icon: 'MessageCircle'
    }
  ],
  CUSTOMER: [
    {
      title: 'Trang chủ',
      path: '/dashboard',
      icon: 'Home'
    },
    {
      title: 'Sản phẩm',
      path: '/products',
      icon: 'Package'
    },
    {
      title: 'Giỏ hàng',
      path: '/cart',
      icon: 'ShoppingCart'
    },
    {
      title: 'Đơn hàng của tôi',
      path: '/my-orders',
      icon: 'List'
    },
    {
      title: 'Hỗ trợ',
      path: '/support',
      icon: 'MessageCircle'
    }
  ]
};

// Common Messages
export const MESSAGES = {
  SUCCESS: {
    LOGIN: 'Đăng nhập thành công!',
    LOGOUT: 'Đăng xuất thành công!',
    CREATE: 'Tạo mới thành công!',
    UPDATE: 'Cập nhật thành công!',
    DELETE: 'Xóa thành công!',
    CATEGORY_CREATED: 'Tạo danh mục thành công!',
    CATEGORY_UPDATED: 'Cập nhật danh mục thành công!',
    CATEGORY_DELETED: 'Xóa danh mục thành công!',
    CATEGORY_STATUS_CHANGED: 'Thay đổi trạng thái danh mục thành công!',
    BRAND_CREATED: 'Tạo thương hiệu thành công!',
    BRAND_UPDATED: 'Cập nhật thương hiệu thành công!',
    BRAND_DELETED: 'Xóa thương hiệu thành công!',
    BRAND_STATUS_CHANGED: 'Thay đổi trạng thái thương hiệu thành công!',
    SIZE_CREATED: 'Tạo kích cỡ thành công!',
    SIZE_UPDATED: 'Cập nhật kích cỡ thành công!',
    SIZE_DELETED: 'Xóa kích cỡ thành công!',
    SIZE_STATUS_CHANGED: 'Thay đổi trạng thái kích cỡ thành công!',
    SIZE_ORDER_UPDATED: 'Cập nhật thứ tự hiển thị thành công!'
  },
  ERROR: {
    LOGIN_FAILED: 'Đăng nhập thất bại!',
    NETWORK_ERROR: 'Lỗi kết nối mạng!',
    SERVER_ERROR: 'Lỗi máy chủ!',
    UNAUTHORIZED: 'Bạn không có quyền truy cập!',
    NOT_FOUND: 'Không tìm thấy dữ liệu!',
    VALIDATION_ERROR: 'Dữ liệu không hợp lệ!',
    CATEGORY_NOT_FOUND: 'Không tìm thấy danh mục!',
    CATEGORY_DUPLICATE: 'Tên danh mục đã tồn tại!',
    CATEGORY_DELETE_ERROR: 'Không thể xóa danh mục có sản phẩm!',
    BRAND_NOT_FOUND: 'Không tìm thấy thương hiệu!',
    BRAND_DUPLICATE: 'Tên thương hiệu đã tồn tại!',
    SIZE_NOT_FOUND: 'Không tìm thấy kích cỡ!',
    SIZE_DUPLICATE: 'Tên kích cỡ đã tồn tại!',
    SIZE_DELETE_ERROR: 'Không thể xóa kích cỡ có sản phẩm!'
  },
  CONFIRM: {
    DELETE_CATEGORY: 'Bạn có chắc chắn muốn xóa danh mục này?',
    DISABLE_CATEGORY: 'Bạn có chắc chắn muốn vô hiệu hóa danh mục này?',
    ENABLE_CATEGORY: 'Bạn có chắc chắn muốn kích hoạt danh mục này?',
    DELETE_BRAND: 'Bạn có chắc chắn muốn xóa thương hiệu này?',
    DISABLE_BRAND: 'Bạn có chắc chắn muốn vô hiệu hóa thương hiệu này?',
    ENABLE_BRAND: 'Bạn có chắc chắn muốn kích hoạt thương hiệu này?',
    DELETE_SIZE: 'Bạn có chắc chắn muốn xóa kích cỡ này?',
    DISABLE_SIZE: 'Bạn có chắc chắn muốn vô hiệu hóa kích cỡ này?',
    ENABLE_SIZE: 'Bạn có chắc chắn muốn kích hoạt kích cỡ này?'
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
    UNIT_MAX_LENGTH: 10,
    DISPLAY_ORDER_MIN: 0,
    DISPLAY_ORDER_MAX: 999
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