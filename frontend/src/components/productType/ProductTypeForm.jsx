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
} from '@mui/material';
import CategorySelector from '../category/CategorySelector';

const ProductTypeForm = ({ 
  open, 
  onClose, 
  onSubmit, 
  productType = null, 
  mode = 'create', // 'create', 'edit', 'view'
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    productTypeName: '',
    type: '',
    categoryId: '',
    description: '',
    status: true,
  });
  const [errors, setErrors] = useState({});

  // Update form data when productType changes
  useEffect(() => {
    if (productType) {
      setFormData({
        productTypeName: productType.productTypeName || '',
        type: productType.type || '',
        categoryId: productType.categoryId || '',
        description: productType.description || '',
        status: productType.status !== undefined ? productType.status : true,
      });
    } else {
      setFormData({
        productTypeName: '',
        type: '',
        categoryId: '',
        description: '',
        status: true,
      });
    }
    setErrors({});
  }, [productType, open]);

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

    if (!formData.productTypeName.trim()) {
      newErrors.productTypeName = 'Tên loại sản phẩm không được để trống';
    } else if (formData.productTypeName.length < 2) {
      newErrors.productTypeName = 'Tên loại sản phẩm phải có ít nhất 2 ký tự';
    } else if (formData.productTypeName.length > 50) {
      newErrors.productTypeName = 'Tên loại sản phẩm không được vượt quá 50 ký tự';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Vui lòng chọn danh mục';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Mô tả không được vượt quá 500 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (mode === 'view') return;
    
    if (validate()) {
      onSubmit(formData);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'create': return 'Thêm loại sản phẩm mới';
      case 'edit': return 'Chỉnh sửa loại sản phẩm';
      case 'view': return 'Chi tiết loại sản phẩm';
      default: return 'Loại sản phẩm';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{getTitle()}</DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3} className="mt-2">
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tên loại sản phẩm *"
              name="productTypeName"
              value={formData.productTypeName}
              onChange={handleChange}
              error={!!errors.productTypeName}
              helperText={errors.productTypeName}
              disabled={mode === 'view' || loading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CategorySelector
              value={formData.categoryId}
              onChange={(e) => handleChange({ target: { name: 'categoryId', value: e.target.value } })}
              error={!!errors.categoryId}
              helperText={errors.categoryId}
              required={true}
              disabled={mode === 'view' || loading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Mã loại"
              name="type"
              type="number"
              value={formData.type}
              onChange={handleChange}
              disabled={mode === 'view' || loading}
              placeholder="1, 2, 3..."
              helperText="Mã số để phân loại sản phẩm"
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
              placeholder="Nhập mô tả cho loại sản phẩm..."
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
            {mode === 'create' ? 'Tạo loại sản phẩm' : 'Cập nhật'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ProductTypeForm;