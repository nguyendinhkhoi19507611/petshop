import api from './api';

const ADDRESS_ENDPOINTS = {
  GET_PROVINCES: '/addresses/provinces',
  GET_DISTRICTS: (provinceId) => `/addresses/districts/${provinceId}`,
  GET_WARDS: (districtId) => `/addresses/wards/${districtId}`,
  GET_USER_ADDRESSES: (userId) => `/users/${userId}/addresses`,
  CREATE_ADDRESS: (userId) => `/users/${userId}/addresses`,
  UPDATE_ADDRESS: (id) => `/addresses/${id}`,
  DELETE_ADDRESS: (id) => `/addresses/${id}`,
  SET_DEFAULT: (id) => `/addresses/${id}/set-default`,
};

export const addressService = {
  // Lấy tất cả tỉnh/thành
  getProvinces: () => {
    return api.get(ADDRESS_ENDPOINTS.GET_PROVINCES);
  },

  // Lấy quận/huyện theo tỉnh
  getDistricts: (provinceId) => {
    return api.get(ADDRESS_ENDPOINTS.GET_DISTRICTS(provinceId));
  },

  // Lấy phường/xã theo quận
  getWards: (districtId) => {
    return api.get(ADDRESS_ENDPOINTS.GET_WARDS(districtId));
  },

  // Lấy địa chỉ của user
  getUserAddresses: (userId) => {
    return api.get(ADDRESS_ENDPOINTS.GET_USER_ADDRESSES(userId));
  },

  // Thêm địa chỉ mới
  createAddress: (userId, data) => {
    return api.post(ADDRESS_ENDPOINTS.CREATE_ADDRESS(userId), data);
  },

  // Cập nhật địa chỉ
  updateAddress: (id, data) => {
    return api.put(ADDRESS_ENDPOINTS.UPDATE_ADDRESS(id), data);
  },

  // Xóa địa chỉ
  deleteAddress: (id) => {
    return api.delete(ADDRESS_ENDPOINTS.DELETE_ADDRESS(id));
  },

  // Đặt địa chỉ mặc định
  setDefaultAddress: (id) => {
    return api.post(ADDRESS_ENDPOINTS.SET_DEFAULT(id));
  },
};

export default addressService;