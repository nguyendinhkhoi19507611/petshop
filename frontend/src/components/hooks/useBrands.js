import { useState, useEffect } from 'react';
import { brandService } from '../services/brandService';

export const useBrands = (options = {}) => {
  const {
    page = 0,
    size = 10,
    search = '',
    status = null,
    autoLoad = true,
    activeOnly = false
  } = options;

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [metadata, setMetadata] = useState({});

  const loadBrands = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (activeOnly) {
        response = await brandService.getActive();
      } else {
        response = await brandService.getAll({ page, size, search, status });
      }

      if (response.data.success) {
        setBrands(response.data.data);
        setMetadata(response.data.metadata || {});
      } else {
        setError(response.data.message || 'Không thể tải thương hiệu');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  const createBrand = async (brandData) => {
    try {
      setLoading(true);
      const response = await brandService.create(brandData);
      
      if (response.data.success) {
        await loadBrands(); // Reload list
        return { success: true, data: response.data.data };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Lỗi kết nối' 
      };
    } finally {
      setLoading(false);
    }
  };

  const updateBrand = async (id, brandData) => {
    try {
      setLoading(true);
      const response = await brandService.update(id, brandData);
      
      if (response.data.success) {
        await loadBrands(); // Reload list
        return { success: true, data: response.data.data };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Lỗi kết nối' 
      };
    } finally {
      setLoading(false);
    }
  };

  const deleteBrand = async (id) => {
    try {
      setLoading(true);
      const response = await brandService.delete(id);
      
      if (response.data.success) {
        await loadBrands(); // Reload list
        return { success: true };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Lỗi kết nối' 
      };
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id) => {
    try {
      setLoading(true);
      const response = await brandService.toggleStatus(id);
      
      if (response.data.success) {
        await loadBrands(); // Reload list
        return { success: true, data: response.data.data };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Lỗi kết nối' 
      };
    } finally {
      setLoading(false);
    }
  };

  const getTopBrands = async (limit = 10) => {
    try {
      setLoading(true);
      const response = await brandService.getTop(limit);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Lỗi kết nối' 
      };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoLoad) {
      loadBrands();
    }
  }, [page, size, search, status, activeOnly, autoLoad]);

  return {
    brands,
    loading,
    error,
    metadata,
    loadBrands,
    createBrand,
    updateBrand,
    deleteBrand,
    toggleStatus,
    getTopBrands,
  };
};

export default useBrands;