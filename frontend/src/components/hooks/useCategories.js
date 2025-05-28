import { useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService';

export const useCategories = (options = {}) => {
  const {
    page = 0,
    size = 10,
    search = '',
    autoLoad = true,
    activeOnly = false
  } = options;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [metadata, setMetadata] = useState({});

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (activeOnly) {
        response = await categoryService.getActive();
      } else {
        response = await categoryService.getAll({ page, size, search });
      }

      if (response.data.success) {
        setCategories(response.data.data);
        setMetadata(response.data.metadata || {});
      } else {
        setError(response.data.message || 'Không thể tải danh mục');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData) => {
    try {
      setLoading(true);
      const response = await categoryService.create(categoryData);
      
      if (response.data.success) {
        await loadCategories(); // Reload list
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

  const updateCategory = async (id, categoryData) => {
    try {
      setLoading(true);
      const response = await categoryService.update(id, categoryData);
      
      if (response.data.success) {
        await loadCategories(); // Reload list
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

  const deleteCategory = async (id) => {
    try {
      setLoading(true);
      const response = await categoryService.delete(id);
      
      if (response.data.success) {
        await loadCategories(); // Reload list
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
      const response = await categoryService.toggleStatus(id);
      
      if (response.data.success) {
        await loadCategories(); // Reload list
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
      loadCategories();
    }
  }, [page, size, search, activeOnly, autoLoad]);

  return {
    categories,
    loading,
    error,
    metadata,
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleStatus,
  };
};

export default useCategories;