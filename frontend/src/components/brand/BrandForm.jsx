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
  Avatar,
  InputAdornment,
} from '@mui/material';
import { Image, Link as LinkIcon } from '@mui/icons-material';

const BrandForm = ({ 
  open, 
  onClose, 
  onSubmit, 
  brand = null, 
  mode = 'create', // 'create', 'edit', 'view'
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    brandName: '',
    description: '',
    logoUrl: '',
    website: '',
    status: true,
  });
  const [errors, setErrors] = useState({});

  // Update form data when brand changes
  useEffect(() => {
    if (brand) {
      setFormData({
        brandName: brand.brandName || '',
        description: brand.description || '',
        logoUrl: brand.logoUrl || '',
        website: brand.website || '',
        status: brand.status !== undefined ? brand.status : true,
      });
    } else {
      setFormData({
        brandName: '',
        description: '',
        logoUrl: '',
        website: '',
        status: true,
      });
    }
    setErrors({});
  }, [brand, open]);

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

    if (!formData.brandName.trim()) {
      newErrors.brandName = 'Tên thương hiệu không được để trống';
    } else if (formData.brandName.length < 2) {
      newErrors.brandName = 'Tên thương hiệu phải có ít nhất 2 ký tự';
    } else if (formData.brandName.length > 50) {
      newErrors.brandName = 'Tên thương hiệu không được vượt quá 50 ký tự';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Mô tả không được vượt quá 500 ký tự';
    }

    if (formData.website && !formData.website.match(/^https?:\/\/.+/)) {
      newErrors.website = 'Website phải bắt đầu bằng http:// hoặc https://';
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
      case 'create': return 'Thêm thương hiệu mới';
      case 'edit': return 'Chỉnh sửa thương hiệu';
      case 'view': return 'Chi tiết thương hiệu';
      default: return 'Thương hiệu';
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
              label="Tên thương hiệu *"
              name="brandName"
              value={formData.brandName}
              onChange={handleChange}
              error={!!errors.brandName}
              helperText={errors.brandName}
              disabled={mode === 'view' || loading}
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
              placeholder="Nhập mô tả cho thương hiệu..."
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Logo URL"
              name="logoUrl"
              value={formData.logoUrl}
              onChange={handleChange}
              disabled={mode === 'view' || loading}
              placeholder="https://example.com/logo.png"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Image className="text-gray-400" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              error={!!errors.website}
              helperText={errors.website}
              disabled={mode === 'view' || loading}
              placeholder="https://example.com"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkIcon className="text-gray-400" />
                  </InputAdornment>
                ),
              }}
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

          {formData.logoUrl && (
            <Grid item xs={12}>
              <Typography variant="body2" className="mb-2">
                Preview logo:
              </Typography>
              <Avatar
                src={formData.logoUrl}
                alt="Logo preview"
                sx={{ width: 64, height: 64 }}
              >
                {formData.brandName.charAt(0)}
              </Avatar>
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
            {mode === 'create' ? 'Tạo thương hiệu' : 'Cập nhật'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default BrandForm;