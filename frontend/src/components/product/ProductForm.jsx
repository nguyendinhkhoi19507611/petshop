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
  Avatar,
  InputAdornment,
} from '@mui/material';
import { Upload, Image as ImageIcon, AttachMoney } from '@mui/icons-material';
import CategorySelector from '../category/CategorySelector';
import BrandSelector from '../brand/BrandSelector';
import SizeSelector from '../size/SizeSelector';
import ProductTypeSelector from '../productType/ProductTypeSelector';

const ProductForm = ({ 
  open, 
  onClose, 
  onSubmit, 
  product = null, 
  mode = 'create', // 'create', 'edit', 'view'
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    image: '',
    price: '',
    salePrice: '',
    productTypeId: '',
    sizeId: '',
    brandId: '',
    stock: 0,
    sku: '',
    status: true,
    featured: false,
    weight: '',
    dimensions: '',
    metaTitle: '',
    metaDescription: '',
    tags: '',
    lowStockThreshold: 10,
  });
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Update form data when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.productName || '',
        description: product.description || '',
        image: product.image || '',
        price: product.price || '',
        salePrice: product.salePrice || '',
        productTypeId: product.productTypeId || '',
        sizeId: product.sizeId || '',
        brandId: product.brandId || '',
        stock: product.stock || 0,
        sku: product.sku || '',
        status: product.status !== undefined ? product.status : true,
        featured: product.featured || false,
        weight: product.weight || '',
        dimensions: product.dimensions || '',
        metaTitle: product.metaTitle || '',
        metaDescription: product.metaDescription || '',
        tags: product.tags || '',
        lowStockThreshold: product.lowStockThreshold || 10,
      });
      setImagePreview(product.image || '');
    } else {
      setFormData({
        productName: '',
        description: '',
        image: '',
        price: '',
        salePrice: '',
        productTypeId: '',
        sizeId: '',
        brandId: '',
        stock: 0,
        sku: '',
        status: true,
        featured: false,
        weight: '',
        dimensions: '',
        metaTitle: '',
        metaDescription: '',
        tags: '',
        lowStockThreshold: 10,
      });
      setImagePreview('');
    }
    setErrors({});
    setImageFile(null);
  }, [product, open]);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateSKU = () => {
    const prefix = formData.productName.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    const sku = `${prefix}${timestamp}`;
    setFormData(prev => ({
      ...prev,
      sku: sku,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.productName.trim()) {
      newErrors.productName = 'Tên sản phẩm không được để trống';
    } else if (formData.productName.length < 2) {
      newErrors.productName = 'Tên sản phẩm phải có ít nhất 2 ký tự';
    } else if (formData.productName.length > 500) {
      newErrors.productName = 'Tên sản phẩm không được vượt quá 500 ký tự';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Giá sản phẩm phải lớn hơn 0';
    }

    if (formData.salePrice && formData.salePrice >= formData.price) {
      newErrors.salePrice = 'Giá khuyến mãi phải nhỏ hơn giá gốc';
    }

    if (!formData.productTypeId) {
      newErrors.productTypeId = 'Vui lòng chọn loại sản phẩm';
    }

    if (!formData.brandId) {
      newErrors.brandId = 'Vui lòng chọn thương hiệu';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'Tồn kho phải lớn hơn hoặc bằng 0';
    }

    if (formData.description && formData.description.length > 5000) {
      newErrors.description = 'Mô tả không được vượt quá 5000 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (mode === 'view') return;
    
    if (validate()) {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        stock: parseInt(formData.stock),
        lowStockThreshold: parseInt(formData.lowStockThreshold),
      };

      onSubmit(submitData, imageFile);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'create': return 'Thêm sản phẩm mới';
      case 'edit': return 'Chỉnh sửa sản phẩm';
      case 'view': return 'Chi tiết sản phẩm';
      default: return 'Sản phẩm';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>{getTitle()}</DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3} className="mt-2">
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" className="font-semibold mb-3">
              Thông tin cơ bản
            </Typography>
          </Grid>

          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Tên sản phẩm *"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              error={!!errors.productName}
              helperText={errors.productName}
              disabled={mode === 'view' || loading}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Box className="flex space-x-2">
              <TextField
                fullWidth
                label="SKU"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                disabled={mode === 'view' || loading}
                placeholder="Mã sản phẩm"
              />
              {mode !== 'view' && (
                <Button
                  variant="outlined"
                  onClick={generateSKU}
                  disabled={loading || !formData.productName}
                  className="whitespace-nowrap"
                >
                  Tạo SKU
                </Button>
              )}
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mô tả sản phẩm"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
              multiline
              rows={4}
              disabled={mode === 'view' || loading}
              placeholder="Nhập mô tả chi tiết về sản phẩm..."
            />
          </Grid>

          {/* Image Upload */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" className="font-medium mb-2">
              Hình ảnh sản phẩm
            </Typography>
            <Box className="flex items-start space-x-4">
              {/* Image Preview */}
              <Box className="flex-shrink-0">
                <Avatar
                  src={imagePreview}
                  alt="Product preview"
                  sx={{ width: 120, height: 120 }}
                  variant="rounded"
                >
                  <ImageIcon sx={{ fontSize: 40 }} />
                </Avatar>
              </Box>
              
              {/* Upload Controls */}
              {mode !== 'view' && (
                <Box className="flex-1">
                  <TextField
                    fullWidth
                    label="URL hình ảnh"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    disabled={loading}
                    className="mb-3"
                  />
                  
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<Upload />}
                    disabled={loading}
                  >
                    Chọn file hình ảnh
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Button>
                  
                  <Typography variant="caption" className="text-gray-500 block mt-1">
                    Chấp nhận: JPG, PNG, GIF. Tối đa 5MB
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>

          {/* Category & Brand */}
          <Grid item xs={12}>
            <Typography variant="h6" className="font-semibold mb-3">
              Phân loại
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <BrandSelector
              value={formData.brandId}
              onChange={(e) => handleChange({ target: { name: 'brandId', value: e.target.value } })}
              error={!!errors.brandId}
              helperText={errors.brandId}
              required={true}
              disabled={mode === 'view' || loading}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <ProductTypeSelector
              value={formData.productTypeId}
              onChange={(e) => handleChange({ target: { name: 'productTypeId', value: e.target.value } })}
              error={!!errors.productTypeId}
              helperText={errors.productTypeId}
              required={true}
              disabled={mode === 'view' || loading}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <SizeSelector
              value={formData.sizeId}
              onChange={(e) => handleChange({ target: { name: 'sizeId', value: e.target.value } })}
              disabled={mode === 'view' || loading}
            />
          </Grid>

          {/* Pricing */}
          <Grid item xs={12}>
            <Typography variant="h6" className="font-semibold mb-3">
              Giá cả
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Giá bán *"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              error={!!errors.price}
              helperText={errors.price}
              disabled={mode === 'view' || loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoney />
                  </InputAdornment>
                ),
                endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Giá khuyến mãi"
              name="salePrice"
              type="number"
              value={formData.salePrice}
              onChange={handleChange}
              error={!!errors.salePrice}
              helperText={errors.salePrice || 'Để trống nếu không có khuyến mãi'}
              disabled={mode === 'view' || loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoney />
                  </InputAdornment>
                ),
                endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
              }}
            />
          </Grid>

          {/* Inventory */}
          <Grid item xs={12}>
            <Typography variant="h6" className="font-semibold mb-3">
              Kho hàng
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tồn kho"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              error={!!errors.stock}
              helperText={errors.stock}
              disabled={mode === 'view' || loading}
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Ngưỡng cảnh báo tồn kho"
              name="lowStockThreshold"
              type="number"
              value={formData.lowStockThreshold}
              onChange={handleChange}
              disabled={mode === 'view' || loading}
              helperText="Cảnh báo khi tồn kho dưới mức này"
              inputProps={{ min: 1 }}
            />
          </Grid>

          {/* Physical Properties */}
          <Grid item xs={12}>
            <Typography variant="h6" className="font-semibold mb-3">
              Thông số vật lý
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Trọng lượng"
              name="weight"
              type="number"
              value={formData.weight}
              onChange={handleChange}
              disabled={mode === 'view' || loading}
              InputProps={{
                endAdornment: <InputAdornment position="end">g</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Kích thước"
              name="dimensions"
              value={formData.dimensions}
              onChange={handleChange}
              disabled={mode === 'view' || loading}
              placeholder="DxRxC (cm)"
              helperText="Ví dụ: 30x20x15"
            />
          </Grid>

          {/* SEO */}
          <Grid item xs={12}>
            <Typography variant="h6" className="font-semibold mb-3">
              SEO & Metadata
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Meta Title"
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleChange}
              disabled={mode === 'view' || loading}
              helperText="Tiêu đề SEO (tối đa 255 ký tự)"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Meta Description"
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleChange}
              disabled={mode === 'view' || loading}
              multiline
              rows={2}
              helperText="Mô tả SEO (tối đa 500 ký tự)"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              disabled={mode === 'view' || loading}
              helperText="Nhập các từ khóa, cách nhau bằng dấu phẩy"
              placeholder="thức ăn chó, royal canin, hạt khô"
            />
          </Grid>

          {/* Settings */}
          <Grid item xs={12}>
            <Typography variant="h6" className="font-semibold mb-3">
              Cài đặt
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  name="status"
                  checked={formData.status}
                  onChange={handleChange}
                  disabled={mode === 'view' || loading}
                />
              }
              label="Trạng thái bán"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  disabled={mode === 'view' || loading}
                />
              }
              label="Sản phẩm nổi bật"
            />
          </Grid>

          {/* Preview */}
          {(formData.productName && formData.price) && (
            <Grid item xs={12}>
              <Box className="p-4 bg-gray-50 rounded-lg border">
                <Typography variant="caption" className="text-gray-600 block mb-2">
                  Xem trước sản phẩm:
                </Typography>
                <Box className="flex items-start space-x-4">
                  <Avatar
                    src={imagePreview}
                    alt="Preview"
                    sx={{ width: 60, height: 60 }}
                    variant="rounded"
                  >
                    <ImageIcon />
                  </Avatar>
                  <Box className="flex-1">
                    <Typography variant="h6" className="font-semibold mb-1">
                      {formData.productName}
                    </Typography>
                    <Box className="flex items-center space-x-2 mb-1">
                      {formData.salePrice && formData.salePrice < formData.price ? (
                        <>
                          <Typography variant="h6" className="font-bold text-red-600">
                            {formatCurrency(formData.salePrice)}
                          </Typography>
                          <Typography variant="body2" className="text-gray-500 line-through">
                            {formatCurrency(formData.price)}
                          </Typography>
                        </>
                      ) : (
                        <Typography variant="h6" className="font-bold text-gray-800">
                          {formatCurrency(formData.price)}
                        </Typography>
                      )}
                    </Box>
                    <Box className="flex items-center space-x-1">
                      <Chip 
                        label={formData.status ? 'Có sẵn' : 'Hết hàng'} 
                        color={formData.status ? 'success' : 'default'} 
                        size="small" 
                      />
                      {formData.featured && (
                        <Chip label="Nổi bật" color="primary" size="small" />
                      )}
                      <Typography variant="caption" className="text-gray-600">
                        Kho: {formData.stock}
                      </Typography>
                    </Box>
                  </Box>
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
            {mode === 'create' ? 'Tạo sản phẩm' : 'Cập nhật'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ProductForm;
