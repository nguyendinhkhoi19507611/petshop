import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import { productTypeService } from '../../services/productTypeService';

const ProductTypeSelector = ({ 
  value, 
  onChange, 
  error, 
  helperText, 
  label = "Loại sản phẩm",
  required = false,
  disabled = false,
  fullWidth = true,
  categoryId = null, // Filter by category
  groupByCategory = false 
}) => {
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProductTypes();
  }, [categoryId]);

  const loadProductTypes = async () => {
    try {
      setLoading(true);
      let response;
      
      if (categoryId) {
        response = await productTypeService.getByCategory(categoryId);
      } else {
        response = await productTypeService.getActive();
      }
      
      if (response.data.success) {
        setProductTypes(response.data.data);
      }
    } catch (error) {
      console.error('Error loading product types:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderProductTypeItem = (productType) => {
    return (
      <Box className="flex items-center justify-between w-full">
        <Typography variant="body2">
          {productType.productTypeName}
        </Typography>
        {productType.categoryName && (
          <Chip 
            label={productType.categoryName} 
            size="small" 
            variant="outlined"
            className="ml-2"
          />
        )}
      </Box>
    );
  };

  return (
    <FormControl fullWidth={fullWidth} error={error} disabled={disabled}>
      <InputLabel>{label}{required && ' *'}</InputLabel>
      <Select
        value={value || ''}
        onChange={onChange}
        label={label}
        disabled={disabled || loading}
        renderValue={(selected) => {
          if (!selected) return '';
          const selectedType = productTypes.find(pt => pt.id === selected);
          return selectedType ? selectedType.productTypeName : '';
        }}
      >
        {loading ? (
          <MenuItem disabled>
            <Box className="flex items-center">
              <CircularProgress size={16} className="mr-2" />
              Đang tải...
            </Box>
          </MenuItem>
        ) : (
          productTypes.map((productType) => (
            <MenuItem key={productType.id} value={productType.id}>
              {renderProductTypeItem(productType)}
            </MenuItem>
          ))
        )}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default ProductTypeSelector;