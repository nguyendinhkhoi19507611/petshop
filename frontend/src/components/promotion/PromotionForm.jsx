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
  Chip,
  Autocomplete,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';

const PromotionForm = ({ 
  open, 
  onClose, 
  onSubmit, 
  promotion = null, 
  mode = 'create', // 'create', 'edit', 'view'
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    promotionName: '',
    description: '',
    couponCode: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    maxDiscountAmount: '',
    minOrderAmount: '',
    maxUsageCount: '',
    limitPerCustomer: 1,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days later
    status: true,
    applicableType: 'ALL',
    forNewCustomersOnly: false,
    applicableProductIds: [],
    applicableCategoryIds: [],
  });
  const [errors, setErrors] = useState({});

  // Update form data when promotion changes
  useEffect(() => {
    if (promotion) {
      setFormData({
        promotionName: promotion.promotionName || '',
        description: promotion.description || '',
        couponCode: promotion.couponCode || '',
        discountType: promotion.discountType || 'PERCENTAGE',
        discountValue: promotion.discountValue || '',
        maxDiscountAmount: promotion.maxDiscountAmount || '',
        minOrderAmount: promotion.minOrderAmount || '',
        maxUsageCount: promotion.maxUsageCount || '',
        limitPerCustomer: promotion.limitPerCustomer || 1,
        startDate: promotion.startDate ? new Date(promotion.startDate) : new Date(),
        endDate: promotion.endDate ? new Date(promotion.endDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: promotion.status !== undefined ? promotion.status : true,
        applicableType: promotion.applicableType || 'ALL',
        forNewCustomersOnly: promotion.forNewCustomersOnly || false,
        applicableProductIds: promotion.applicableProductIds || [],
        applicableCategoryIds: promotion.applicableCategoryIds || [],
      });
    } else {
      setFormData({
        promotionName: '',
        description: '',
        couponCode: '',
        discountType: 'PERCENTAGE',
        discountValue: '',
        maxDiscountAmount: '',
        minOrderAmount: '',
        maxUsageCount: '',
        limitPerCustomer: 1,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: true,
        applicableType: 'ALL',
        forNewCustomersOnly: false,
        applicableProductIds: [],
        applicableCategoryIds: [],
      });
    }
    setErrors({});
  }, [promotion, open]);

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

  const handleDateChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({
      ...prev,
      couponCode: result,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.promotionName.trim()) {
      newErrors.promotionName = 'Tên khuyến mãi không được để trống';
    } else if (formData.promotionName.length > 100) {
      newErrors.promotionName = 'Tên khuyến mãi không được vượt quá 100 ký tự';
    }

    if (!formData.couponCode.trim()) {
      newErrors.couponCode = 'Mã giảm giá không được để trống';
    } else if (formData.couponCode.length > 50) {
      newErrors.couponCode = 'Mã giảm giá không được vượt quá 50 ký tự';
    }

    if (!formData.discountValue || formData.discountValue <= 0) {
      newErrors.discountValue = 'Giá trị giảm giá phải lớn hơn 0';
    }

    if (formData.discountType === 'PERCENTAGE' && formData.discountValue > 100) {
      newErrors.discountValue = 'Giá trị giảm giá theo phần trăm không được vượt quá 100';
    }

    if (formData.endDate <= formData.startDate) {
      newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Mô tả không được vượt quá 1000 ký tự';
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
      case 'create': return 'Thêm khuyến mãi mới';
      case 'edit': return 'Chỉnh sửa khuyến mãi';
      case 'view': return 'Chi tiết khuyến mãi';
      default: return 'Khuyến mãi';
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>{getTitle()}</DialogTitle>
        
        <DialogContent>
          <Grid container spacing={3} className="mt-2">
            {/* Basic Info */}
            <Grid item xs={12}>
              <Typography variant="h6" className="font-semibold mb-3">
                Thông tin cơ bản
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tên khuyến mãi *"
                name="promotionName"
                value={formData.promotionName}
                onChange={handleChange}
                error={!!errors.promotionName}
                helperText={errors.promotionName}
                disabled={mode === 'view' || loading}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box className="flex space-x-2">
                <TextField
                  fullWidth
                  label="Mã giảm giá *"
                  name="couponCode"
                  value={formData.couponCode}
                  onChange={handleChange}
                  error={!!errors.couponCode}
                  helperText={errors.couponCode}
                  disabled={mode === 'view' || loading}
                />
                {mode !== 'view' && (
                  <Button
                    variant="outlined"
                    onClick={generateCouponCode}
                    disabled={loading}
                    className="whitespace-nowrap"
                  >
                    Tạo mã
                  </Button>
                )}
              </Box>
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
                placeholder="Nhập mô tả cho khuyến mãi..."
              />
            </Grid>

            {/* Discount Settings */}
            <Grid item xs={12}>
              <Typography variant="h6" className="font-semibold mb-3">
                Cài đặt giảm giá
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth disabled={mode === 'view' || loading}>
                <InputLabel>Loại giảm giá *</InputLabel>
                <Select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleChange}
                  label="Loại giảm giá *"
                >
                  <MenuItem value="PERCENTAGE">Phần trăm (%)</MenuItem>
                  <MenuItem value="FIXED_AMOUNT">Số tiền cố định (VNĐ)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Giá trị giảm giá *"
                name="discountValue"
                type="number"
                value={formData.discountValue}
                onChange={handleChange}
                error={!!errors.discountValue}
                helperText={errors.discountValue || (formData.discountType === 'PERCENTAGE' ? 'Nhập % (1-100)' : 'Nhập số tiền (VNĐ)')}
                disabled={mode === 'view' || loading}
                inputProps={{ min: 0 }}
              />
            </Grid>

            {formData.discountType === 'PERCENTAGE' && (
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Giảm tối đa"
                  name="maxDiscountAmount"
                  type="number"
                  value={formData.maxDiscountAmount}
                  onChange={handleChange}
                  disabled={mode === 'view' || loading}
                  helperText="Số tiền giảm tối đa (VNĐ)"
                  inputProps={{ min: 0 }}
                />
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Giá trị đơn hàng tối thiểu"
                name="minOrderAmount"
                type="number"
                value={formData.minOrderAmount}
                onChange={handleChange}
                disabled={mode === 'view' || loading}
                helperText="Để trống nếu không giới hạn"
                inputProps={{ min: 0 }}
              />
            </Grid>

            {/* Usage Limits */}
            <Grid item xs={12}>
              <Typography variant="h6" className="font-semibold mb-3">
                Giới hạn sử dụng
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Số lượng sử dụng tối đa"
                name="maxUsageCount"
                type="number"
                value={formData.maxUsageCount}
                onChange={handleChange}
                disabled={mode === 'view' || loading}
                helperText="Để trống nếu không giới hạn"
                inputProps={{ min: 1 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Giới hạn mỗi khách hàng *"
                name="limitPerCustomer"
                type="number"
                value={formData.limitPerCustomer}
                onChange={handleChange}
                disabled={mode === 'view' || loading}
                helperText="Số lần tối đa mỗi khách hàng có thể sử dụng"
                inputProps={{ min: 1 }}
              />
            </Grid>

            {/* Date Range */}
            <Grid item xs={12}>
              <Typography variant="h6" className="font-semibold mb-3">
                Thời gian áp dụng
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <DateTimePicker
                label="Ngày bắt đầu *"
                value={formData.startDate}
                onChange={(value) => handleDateChange('startDate', value)}
                disabled={mode === 'view' || loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={!!errors.startDate}
                    helperText={errors.startDate}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DateTimePicker
                label="Ngày kết thúc *"
                value={formData.endDate}
                onChange={(value) => handleDateChange('endDate', value)}
                disabled={mode === 'view' || loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={!!errors.endDate}
                    helperText={errors.endDate}
                  />
                )}
              />
            </Grid>

            {/* Additional Settings */}
            <Grid item xs={12}>
              <Typography variant="h6" className="font-semibold mb-3">
                Cài đặt bổ sung
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={mode === 'view' || loading}>
                <InputLabel>Phạm vi áp dụng</InputLabel>
                <Select
                  name="applicableType"
                  value={formData.applicableType}
                  onChange={handleChange}
                  label="Phạm vi áp dụng"
                >
                  <MenuItem value="ALL">Tất cả sản phẩm</MenuItem>
                  <MenuItem value="CATEGORY">Theo danh mục</MenuItem>
                  <MenuItem value="PRODUCT">Theo sản phẩm cụ thể</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    name="forNewCustomersOnly"
                    checked={formData.forNewCustomersOnly}
                    onChange={handleChange}
                    disabled={mode === 'view' || loading}
                  />
                }
                label="Chỉ dành cho khách hàng mới"
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
                <Box className="space-y-2">
                  <Typography variant="body2" className="text-gray-600">
                    <strong>Trạng thái:</strong> {formData.status ? 'Hoạt động' : 'Không hoạt động'}
                  </Typography>
                  {promotion && (
                    <Typography variant="body2" className="text-gray-600">
                      <strong>Đã sử dụng:</strong> {promotion.usedCount || 0} lần
                    </Typography>
                  )}
                </Box>
              </Grid>
            )}

            {/* Preview */}
            {(formData.promotionName || formData.couponCode) && (
              <Grid item xs={12}>
                <Box className="p-4 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg border border-orange-200">
                  <Typography variant="caption" className="text-gray-600 block mb-2">
                    Xem trước mã giảm giá:
                  </Typography>
                  <Box className="flex items-center space-x-3">
                    <Chip 
                      label={formData.couponCode} 
                      color="primary" 
                      variant="filled"
                      className="font-bold"
                    />
                    <Typography variant="body1" className="font-medium">
                      {formData.promotionName}
                    </Typography>
                    <Typography variant="h6" className="font-bold text-orange-600">
                      {formData.discountType === 'PERCENTAGE' 
                        ? `${formData.discountValue}%` 
                        : `${Number(formData.discountValue).toLocaleString('vi-VN')}đ`
                      }
                    </Typography>
                  </Box>
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
              {mode === 'create' ? 'Tạo khuyến mãi' : 'Cập nhật'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default PromotionForm;