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
import { Home, Person, Phone } from '@mui/icons-material';
import { addressService } from '../../services/addressService';

const AddressForm = ({ 
  open, 
  onClose, 
  onSubmit, 
  address = null, 
  mode = 'create', // 'create', 'edit', 'view'
  loading = false,
  userId 
}) => {
  const [formData, setFormData] = useState({
    streetAddress: '',
    receiverName: '',
    receiverPhone: '',
    note: '',
    provinceId: '',
    districtId: '',
    wardId: '',
    isDefault: false,
  });
  const [errors, setErrors] = useState({});
  
  // Address data
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [provinceName, setProvinceName] = useState('');
  const [districtName, setDistrictName] = useState('');
  const [wardName, setWardName] = useState('');

  // Load provinces on component mount
  useEffect(() => {
    loadProvinces();
  }, []);

  // Update form data when address changes
  useEffect(() => {
    if (address) {
      setFormData({
        streetAddress: address.streetAddress || '',
        receiverName: address.receiverName || '',
        receiverPhone: address.receiverPhone || '',
        note: address.note || '',
        provinceId: address.provinceId || '',
        districtId: address.districtId || '',
        wardId: address.wardId || '',
        isDefault: address.isDefault || false,
      });
      
      // Load districts and wards if editing
      if (address.provinceId) {
        loadDistricts(address.provinceId);
        setProvinceName(address.provinceName || '');
      }
      if (address.districtId) {
        loadWards(address.districtId);
        setDistrictName(address.districtName || '');
      }
      if (address.wardId) {
        setWardName(address.wardName || '');
      }
    } else {
      resetForm();
    }
    setErrors({});
  }, [address, open]);

  const resetForm = () => {
    setFormData({
      streetAddress: '',
      receiverName: '',
      receiverPhone: '',
      note: '',
      provinceId: '',
      districtId: '',
      wardId: '',
      isDefault: false,
    });
    setDistricts([]);
    setWards([]);
    setProvinceName('');
    setDistrictName('');
    setWardName('');
  };

  const loadProvinces = async () => {
    try {
      const response = await addressService.getProvinces();
      if (response.data.success) {
        setProvinces(response.data.data || []);
      }
    } catch (error) {
      console.error('Error loading provinces:', error);
    }
  };

  const loadDistricts = async (provinceId) => {
    try {
      const response = await addressService.getDistricts(provinceId);
      if (response.data.success) {
        setDistricts(response.data.data || []);
      }
    } catch (error) {
      console.error('Error loading districts:', error);
    }
  };

  const loadWards = async (districtId) => {
    try {
      const response = await addressService.getWards(districtId);
      if (response.data.success) {
        setWards(response.data.data || []);
      }
    } catch (error) {
      console.error('Error loading wards:', error);
    }
  };

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

    // Handle province change
    if (name === 'provinceId') {
      const selectedProvince = provinces.find(p => p.id === value);
      setProvinceName(selectedProvince?.provinceName || '');
      setFormData(prev => ({
        ...prev,
        districtId: '',
        wardId: '',
      }));
      setDistricts([]);
      setWards([]);
      setDistrictName('');
      setWardName('');
      if (value) {
        loadDistricts(value);
      }
    }

    // Handle district change
    if (name === 'districtId') {
      const selectedDistrict = districts.find(d => d.id === value);
      setDistrictName(selectedDistrict?.districtName || '');
      setFormData(prev => ({
        ...prev,
        wardId: '',
      }));
      setWards([]);
      setWardName('');
      if (value) {
        loadWards(value);
      }
    }

    // Handle ward change
    if (name === 'wardId') {
      const selectedWard = wards.find(w => w.id === value);
      setWardName(selectedWard?.wardName || '');
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.receiverName.trim()) {
      newErrors.receiverName = 'Tên người nhận không được để trống';
    } else if (formData.receiverName.length > 50) {
      newErrors.receiverName = 'Tên người nhận không được vượt quá 50 ký tự';
    }

    if (!formData.receiverPhone.trim()) {
      newErrors.receiverPhone = 'Số điện thoại không được để trống';
    } else if (!/^[0-9]{10,11}$/.test(formData.receiverPhone)) {
      newErrors.receiverPhone = 'Số điện thoại không hợp lệ';
    }

    if (!formData.streetAddress.trim()) {
      newErrors.streetAddress = 'Địa chỉ không được để trống';
    } else if (formData.streetAddress.length > 100) {
      newErrors.streetAddress = 'Địa chỉ không được vượt quá 100 ký tự';
    }

    if (!formData.provinceId) {
      newErrors.provinceId = 'Vui lòng chọn tỉnh/thành phố';
    }

    if (!formData.districtId) {
      newErrors.districtId = 'Vui lòng chọn quận/huyện';
    }

    if (!formData.wardId) {
      newErrors.wardId = 'Vui lòng chọn phường/xã';
    }

    if (formData.note && formData.note.length > 500) {
      newErrors.note = 'Ghi chú không được vượt quá 500 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (mode === 'view') return;
    
    if (validate()) {
      const submitData = {
        ...formData,
        provinceName,
        districtName,
        wardName,
        fullAddress: `${formData.streetAddress}, ${wardName}, ${districtName}, ${provinceName}`,
      };
      onSubmit(submitData);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'create': return 'Thêm địa chỉ mới';
      case 'edit': return 'Chỉnh sửa địa chỉ';
      case 'view': return 'Chi tiết địa chỉ';
      default: return 'Địa chỉ';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{getTitle()}</DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3} className="mt-2">
          {/* Receiver Info */}
          <Grid item xs={12}>
            <Typography variant="h6" className="font-semibold mb-3">
              Thông tin người nhận
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tên người nhận *"
              name="receiverName"
              value={formData.receiverName}
              onChange={handleChange}
              error={!!errors.receiverName}
              helperText={errors.receiverName}
              disabled={mode === 'view' || loading}
              InputProps={{
                startAdornment: <Person className="text-gray-400 mr-2" />,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Số điện thoại *"
              name="receiverPhone"
              value={formData.receiverPhone}
              onChange={handleChange}
              error={!!errors.receiverPhone}
              helperText={errors.receiverPhone}
              disabled={mode === 'view' || loading}
              InputProps={{
                startAdornment: <Phone className="text-gray-400 mr-2" />,
              }}
            />
          </Grid>

          {/* Address Info */}
          <Grid item xs={12}>
            <Typography variant="h6" className="font-semibold mb-3">
              Thông tin địa chỉ
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth error={!!errors.provinceId}>
              <InputLabel>Tỉnh/Thành phố *</InputLabel>
              <Select
                name="provinceId"
                value={formData.provinceId}
                onChange={handleChange}
                label="Tỉnh/Thành phố *"
                disabled={mode === 'view' || loading}
              >
                {provinces.map((province) => (
                  <MenuItem key={province.id} value={province.id}>
                    {province.provinceName}
                  </MenuItem>
                ))}
              </Select>
              {errors.provinceId && (
                <FormHelperText>{errors.provinceId}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth error={!!errors.districtId}>
              <InputLabel>Quận/Huyện *</InputLabel>
              <Select
                name="districtId"
                value={formData.districtId}
                onChange={handleChange}
                label="Quận/Huyện *"
                disabled={mode === 'view' || loading || !formData.provinceId}
              >
                {districts.map((district) => (
                  <MenuItem key={district.id} value={district.id}>
                    {district.districtName}
                  </MenuItem>
                ))}
              </Select>
              {errors.districtId && (
                <FormHelperText>{errors.districtId}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth error={!!errors.wardId}>
              <InputLabel>Phường/Xã *</InputLabel>
              <Select
                name="wardId"
                value={formData.wardId}
                onChange={handleChange}
                label="Phường/Xã *"
                disabled={mode === 'view' || loading || !formData.districtId}
              >
                {wards.map((ward) => (
                  <MenuItem key={ward.id} value={ward.id}>
                    {ward.wardName}
                  </MenuItem>
                ))}
              </Select>
              {errors.wardId && (
                <FormHelperText>{errors.wardId}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Địa chỉ cụ thể *"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleChange}
              error={!!errors.streetAddress}
              helperText={errors.streetAddress}
              disabled={mode === 'view' || loading}
              placeholder="Số nhà, tên đường..."
              InputProps={{
                startAdornment: <Home className="text-gray-400 mr-2" />,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Ghi chú"
              name="note"
              value={formData.note}
              onChange={handleChange}
              error={!!errors.note}
              helperText={errors.note}
              multiline
              rows={3}
              disabled={mode === 'view' || loading}
              placeholder="Ghi chú thêm (tùy chọn)..."
            />
          </Grid>

          {mode !== 'view' && (
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleChange}
                    disabled={loading}
                  />
                }
                label="Đặt làm địa chỉ mặc định"
              />
            </Grid>
          )}

          {mode === 'view' && (
            <Grid item xs={12}>
              <Typography variant="body2" className="text-gray-600">
                <strong>Trạng thái:</strong> {formData.isDefault ? 'Địa chỉ mặc định' : 'Địa chỉ phụ'}
              </Typography>
            </Grid>
          )}

          {/* Preview */}
          {(provinceName || districtName || wardName || formData.streetAddress) && (
            <Grid item xs={12}>
              <Box className="p-3 bg-gray-50 rounded-lg">
                <Typography variant="caption" className="text-gray-600 block mb-1">
                  Địa chỉ đầy đủ:
                </Typography>
                <Typography variant="body2" className="font-medium">
                  {[formData.streetAddress, wardName, districtName, provinceName]
                    .filter(Boolean)
                    .join(', ')}
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
            {mode === 'create' ? 'Thêm địa chỉ' : 'Cập nhật'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AddressForm;