import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Box,
  Avatar,
  Typography,
} from '@mui/material';
import { brandService } from '../../services/brandService';

const BrandSelector = ({ 
  value, 
  onChange, 
  error, 
  helperText, 
  label = "Thương hiệu",
  required = false,
  disabled = false,
  fullWidth = true,
  showLogo = false 
}) => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      setLoading(true);
      const response = await brandService.getActive();
      
      if (response.data.success) {
        setBrands(response.data.data);
      }
    } catch (error) {
      console.error('Error loading brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderBrandItem = (brand) => {
    if (showLogo) {
      return (
        <Box className="flex items-center space-x-2">
          <Avatar
            src={brand.logoUrl}
            alt={brand.brandName}
            sx={{ width: 24, height: 24 }}
          >
            {brand.brandName.charAt(0)}
          </Avatar>
          <Typography variant="body2">{brand.brandName}</Typography>
        </Box>
      );
    }
    return brand.brandName;
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
          const selectedBrand = brands.find(b => b.id === selected);
          return selectedBrand ? renderBrandItem(selectedBrand) : '';
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
          brands.map((brand) => (
            <MenuItem key={brand.id} value={brand.id}>
              {renderBrandItem(brand)}
            </MenuItem>
          ))
        )}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default BrandSelector;