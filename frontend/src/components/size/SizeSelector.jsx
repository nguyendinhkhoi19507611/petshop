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
import { sizeService } from '../../services/sizeService';

const SizeSelector = ({ 
  value, 
  onChange, 
  error, 
  helperText, 
  label = "Kích cỡ",
  required = false,
  disabled = false,
  fullWidth = true,
  unitFilter = null, // Filter by unit type
  showUnit = true,
  groupByUnit = false 
}) => {
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSizes();
  }, [unitFilter]);

  const loadSizes = async () => {
    try {
      setLoading(true);
      let response;
      
      if (unitFilter) {
        response = await sizeService.getByUnit(unitFilter);
      } else {
        response = await sizeService.getActive();
      }
      
      if (response.data.success) {
        setSizes(response.data.data);
      }
    } catch (error) {
      console.error('Error loading sizes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUnitLabel = (unit) => {
    const unitLabels = {
      weight: 'Trọng lượng',
      volume: 'Thể tích',
      size: 'Kích cỡ',
      length: 'Chiều dài',
      other: 'Khác'
    };
    return unitLabels[unit] || unit;
  };

  const formatSizeDisplay = (size) => {
    let display = size.sizeName;
    
    if (size.value) {
      const unitSuffix = {
        weight: 'g',
        volume: 'ml',
        length: 'cm'
      };
      display += ` (${size.value}${unitSuffix[size.unit] || ''})`;
    }
    
    return display;
  };

  const renderSizeItem = (size) => {
    return (
      <Box className="flex items-center justify-between w-full">
        <Typography variant="body2">
          {formatSizeDisplay(size)}
        </Typography>
        {showUnit && size.unit && (
          <Chip 
            label={getUnitLabel(size.unit)} 
            size="small" 
            variant="outlined"
            className="ml-2"
          />
        )}
      </Box>
    );
  };

  const groupSizesByUnit = () => {
    const grouped = {};
    sizes.forEach(size => {
      const unit = size.unit || 'other';
      if (!grouped[unit]) {
        grouped[unit] = [];
      }
      grouped[unit].push(size);
    });
    return grouped;
  };

  const renderGroupedSizes = () => {
    const grouped = groupSizesByUnit();
    const items = [];
    
    Object.keys(grouped).forEach(unit => {
      items.push(
        <MenuItem key={`header-${unit}`} disabled className="font-semibold">
          {getUnitLabel(unit)}
        </MenuItem>
      );
      
      grouped[unit].forEach(size => {
        items.push(
          <MenuItem key={size.id} value={size.id} className="pl-6">
            {formatSizeDisplay(size)}
          </MenuItem>
        );
      });
    });
    
    return items;
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
          const selectedSize = sizes.find(s => s.id === selected);
          return selectedSize ? formatSizeDisplay(selectedSize) : '';
        }}
      >
        {loading ? (
          <MenuItem disabled>
            <Box className="flex items-center">
              <CircularProgress size={16} className="mr-2" />
              Đang tải...
            </Box>
          </MenuItem>
        ) : groupByUnit ? (
          renderGroupedSizes()
        ) : (
          sizes.map((size) => (
            <MenuItem key={size.id} value={size.id}>
              {renderSizeItem(size)}
            </MenuItem>
          ))
        )}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default SizeSelector;