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
} from '@mui/material';

const CategoryForm = ({ 
  open, 
  onClose, 
  onSubmit, 
  category = null, 
  mode = 'create', // 'create', 'edit', 'view'
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    categoryName: '',
    description: '',
    status: true,
  });
  const [errors, setErrors] = useState({});

  // Update form data when category changes
  useEffect(() => {
    if (category) {
      setFormData({
        categoryName: category.categoryName || '',
        description: category.description || '',
        status: category.status !== undefined ? category.status : true,
      });
    } else {
      setFormData({
        categoryName: '',
        description: '',
        status: true,
      });
    }
    setErrors({});
  }, [category, open]);

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

    if (!formData.categoryName.trim()) {
      newErrors.categoryName = 'Tên danh mục không được để trống';
    } else if (formData.categoryName.length < 2) {
      newErrors.categoryName = 'Tên danh mục phải có ít nhất 2 ký tự';
    } else if (formData.categoryName.length > 100) {
      newErrors.categoryName = 'Tên danh mục không được vượt quá 100 ký tự';
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
      case 'create': return 'Thêm danh mục mới';
      case 'edit': return 'Chỉnh sửa danh mục';
      case 'view': return 'Chi tiết danh mục';
      default: return 'Danh mục';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{getTitle()}</DialogTitle>
      
      <DialogContent>
        <Box className="space-y-4 mt-4">
          <TextField
            fullWidth
            label="Tên danh mục *"
            name="categoryName"
            value={formData.categoryName}
            onChange={handleChange}
            error={!!errors.categoryName}
            helperText={errors.categoryName}
            disabled={mode === 'view' || loading}
          />
          
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
            placeholder="Nhập mô tả cho danh mục..."
          />

          {mode === 'edit' && (
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
          )}

          {mode === 'view' && (
            <Box>
              <Typography variant="body2" className="text-gray-600">
                <strong>Trạng thái:</strong> {formData.status ? 'Hoạt động' : 'Không hoạt động'}
              </Typography>
            </Box>
          )}
        </Box>
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
            {mode === 'create' ? 'Tạo danh mục' : 'Cập nhật'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CategoryForm;