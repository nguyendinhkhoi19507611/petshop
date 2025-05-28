import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Box,
} from '@mui/material';
import { categoryService } from '../../services/categoryService';

const CategorySelector = ({ 
  value, 
  onChange, 
  error, 
  helperText, 
  label = "Danh mục",
  required = false,
  disabled = false,
  fullWidth = true 
}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getActive();
      
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormControl fullWidth={fullWidth} error={error} disabled={disabled}>
      <InputLabel>{label}{required && ' *'}</InputLabel>
      <Select
        value={value || ''}
        onChange={onChange}
        label={label}
        disabled={disabled || loading}
      >
        {loading ? (
          <MenuItem disabled>
            <Box className="flex items-center">
              <CircularProgress size={16} className="mr-2" />
              Đang tải...
            </Box>
          </MenuItem>
        ) : (
          categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.categoryName}
            </MenuItem>
          ))
        )}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default CategorySelector;