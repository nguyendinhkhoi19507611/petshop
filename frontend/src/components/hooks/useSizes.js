import { useState, useEffect } from 'react';
import { sizeService } from '../../services/sizeService';

export const useSizes = (options = {}) => {
  const {
    page = 0,
    size = 10,
    search = '',
    status = null,
    unit = null,
    autoLoad = true,
    activeOnly = false
  } = options;

  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [metadata, setMetadata] = useState({});

  const loadSizes = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (activeOnly) {
        response = await sizeService.getActive();
      } else if (unit) {
        response = await sizeService.getByUnit(unit);
      } else {
        response = await sizeService.getAll({ page, size, search, status });
      }

      if (response.data.success) {
        setSizes(response.data.data);
        setMetadata(response.data.metadata || {});
      } else {
        setError(response.data.message || 'Không thể tải kích cỡ');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  const createSize = async (sizeData) => {
    try {
      setLoading(true);
      const response = await sizeService.create(sizeData);
      
      if (response.data.success) {
        await loadSizes(); // Reload list
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

  const updateSize = async (id, sizeData) => {
    try {
      setLoading(true);
      const response = await sizeService.update(id, sizeData);
      
      if (response.data.success) {
        await loadSizes(); // Reload list
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

  const deleteSize = async (id) => {
    try {
      setLoading(true);
      const response = await sizeService.delete(id);
      
      if (response.data.success) {
        await loadSizes(); // Reload list
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
      const response = await sizeService.toggleStatus(id);
      
      if (response.data.success) {
        await loadSizes(); // Reload list
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

  const updateDisplayOrder = async (sizeIds) => {
    try {
      setLoading(true);
      const response = await sizeService.updateDisplayOrder(sizeIds);
      
      if (response.data.success) {
        await loadSizes(); // Reload list
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

  useEffect(() => {
    if (autoLoad) {
      loadSizes();
    }
  }, [page, size, search, status, unit, activeOnly, autoLoad]);

  return {
    sizes,
    loading,
    error,
    metadata,
    loadSizes,
    createSize,
    updateSize,
    deleteSize,
    toggleStatus,
    updateDisplayOrder,
  };
};

export default useSizes;