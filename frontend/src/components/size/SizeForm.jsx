import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';

const SizeForm = ({ 
  open, 
  onClose, 
  onSubmit, 
  size = null, 
  mode = 'create', // 'create', 'edit', 'view'
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    sizeName: '',
    description: '',
    value: '',
    unit: '',
    displayOrder: '',
    status: true,
  });
  const [errors, setErrors] = useState({});

  const unitOptions = [
    { value: 'weight', label: 'Trọng lượng (g, kg)' },
    { value: 'volume', label: 'Thể tích (ml, l)' },
    { value: 'size', label: 'Kích cỡ (S, M, L, XL)' },
    { value: 'length', label: 'Chiều dài (cm, m)' },
    { value: 'other', label: 'Khác' },
  ];

  // Update form data when size changes
  useEffect(() => {
    if (size) {
      setFormData({
        sizeName: size.sizeName || '',
        description: size.description || '',
        value: size.value || '',
        unit: size.unit || '',
        displayOrder: size.displayOrder || '',
        status: size.status !== undefined ? size.status : true,
      });
    } else {
      setFormData({
        sizeName: '',
        description: '',
        value: '',
        unit: '',
        displayOrder: '',
        status: true,
      });
    }
    setErrors({});
  }, [size, open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.sizeName.trim()) {
      newErrors.sizeName = 'Tên kích cỡ không được để trống';
    } else if (formData.sizeName.length > 50) {
      newErrors.sizeName = 'Tên kích cỡ không được vượt quá 50 ký tự';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Mô tả không được vượt quá 500 ký tự';
    }

    if (formData.value && formData.value.length > 20) {
      newErrors.value = 'Giá trị không được vượt quá 20 ký tự';
    }

    if (formData.displayOrder && (isNaN(formData.displayOrder) || formData.displayOrder < 0 || formData.displayOrder > 999)) {
      newErrors.displayOrder = 'Thứ tự hiển thị phải là số từ 0-999';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (mode === 'view') return;
    
    if (validate()) {
      const submitData = {
        ...formData,
        displayOrder: formData.displayOrder ? parseInt(formData.displayOrder) : null,
      };
      onSubmit(submitData);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'create': return 'Thêm kích cỡ mới';
      case 'edit': return 'Chỉnh sửa kích cỡ';
      case 'view': return 'Chi tiết kích cỡ';
      default: return 'Kích cỡ';
    }
  };

  const getUnitSuffix = (unit) => {
    const suffixes = {
      weight: 'g',
      volume: 'ml',
      length: 'cm'
    };
    return suffixes[unit] || '';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{getTitle()}</DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3} className="mt-2">
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tên kích cỡ *"
              name="sizeName"
              value={formData.sizeName}
              onChange={handleChange}
              error={!!errors.sizeName}
              helperText={errors.sizeName}
              disabled={mode === 'view' || loading}
              placeholder="S, M, L, 100g, 500ml..."
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Giá trị"
              name="value"
              value={formData.value}
              onChange={handleChange}
              error={!!errors.value}
              helperText={errors.value || `Giá trị số hoặc ký tự${formData.unit ? ` (${getUnitSuffix(formData.unit)})` : ''}`}
              disabled={mode === 'view' || loading}
              placeholder="100, S, XL..."
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled={mode === 'view' || loading}>
              <InputLabel>Đơn vị</InputLabel>
              <Select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                label="Đơn vị"
              >
                {unitOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                Chọn loại đơn vị phù hợp với sản phẩm
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Thứ tự hiển thị"
              name="displayOrder"
              type="number"
              value={formData.displayOrder}
              onChange={handleChange}
              error={!!errors.displayOrder}
              helperText={errors.displayOrder || 'Số từ 0-999, để trống sẽ tự động gán'}
              disabled={mode === 'view' || loading}
              inputProps={{ min: 0, max: 999 }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mô tả"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
              multiline
              rows={3}
              disabled={mode === 'view' || loading}
              placeholder="Nhập mô tả cho kích cỡ..."
            />
          </Grid>

          {mode === 'edit' && (
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    name="status"
                    checked={formData.status}
                    onChange={handleChange}
                    disabled={loading}
                  />
                }
                label="Trạng thái hoạt động"
              />
            </Grid>
          )}

          {mode === 'view' && (
            <Grid item xs={12}>
              <Typography variant="body2" className="text-gray-600">
                <strong>Trạng thái:</strong> {formData.status ? 'Hoạt động' : 'Không hoạt động'}
              </Typography>
            </Grid>
          )}

          {/* Preview */}
          {(formData.sizeName || formData.value) && (
            <Grid item xs={12}>
              <Box className="p-3 bg-gray-50 rounded-lg">
                <Typography variant="caption" className="text-gray-600 block mb-1">
                  Xem trước:
                </Typography>
                <Typography variant="h6" className="text-primary-600">
                  {formData.sizeName}
                  {formData.value && ` (${formData.value}${getUnitSuffix(formData.unit)})`}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {mode === 'view' ? 'Đóng' : 'Hủy'}
        </Button>
        
        {mode !== 'view' && (
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
          >
            {mode === 'create' ? 'Tạo kích cỡ' : 'Cập nhật'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SizeForm;