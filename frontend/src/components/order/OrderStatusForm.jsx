import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Box,
  Alert,
} from '@mui/material';

const OrderStatusForm = ({ 
  open, 
  onClose, 
  onSubmit, 
  order,
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    status: order?.status || '',
    notes: '',
    trackingNumber: order?.trackingNumber || '',
  });

  const statusOptions = [
    { value: 'CHỜ_XỬ_LÝ', label: 'Chờ xử lý' },
    { value: 'ĐÃ_XÁC_NHẬN', label: 'Đã xác nhận' },
    { value: 'ĐANG_CHUẨN_BỊ', label: 'Đang chuẩn bị' },
    { value: 'ĐANG_GIAO', label: 'Đang giao' },
    { value: 'HOÀN_THÀNH', label: 'Hoàn thành' },
    { value: 'ĐÃ_HỦY', label: 'Đã hủy' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const getAvailableStatuses = () => {
    const currentStatus = order?.status;
    const statusFlow = {
      'CHỜ_XỬ_LÝ': ['ĐÃ_XÁC_NHẬN', 'ĐÃ_HỦY'],
      'ĐÃ_XÁC_NHẬN': ['ĐANG_CHUẨN_BỊ', 'ĐÃ_HỦY'],
      'ĐANG_CHUẨN_BỊ': ['ĐANG_GIAO', 'ĐÃ_HỦY'],
      'ĐANG_GIAO': ['HOÀN_THÀNH'],
      'HOÀN_THÀNH': [],
      'ĐÃ_HỦY': [],
    };

    const availableNext = statusFlow[currentStatus] || [];
    return statusOptions.filter(option => 
      option.value === currentStatus || availableNext.includes(option.value)
    );
  };

  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Cập nhật trạng thái đơn hàng {order.orderCode}
      </DialogTitle>

      <DialogContent>
        <Box className="space-y-4 mt-4">
          <Alert severity="info">
            Trạng thái hiện tại: <strong>{statusOptions.find(s => s.value === order.status)?.label}</strong>
          </Alert>

          <FormControl fullWidth>
            <InputLabel>Trạng thái mới</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              label="Trạng thái mới"
              disabled={loading}
            >
              {getAvailableStatuses().map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {formData.status === 'ĐANG_GIAO' && (
            <TextField
              fullWidth
              label="Mã vận đơn"
              name="trackingNumber"
              value={formData.trackingNumber}
              onChange={handleChange}
              disabled={loading}
              placeholder="Nhập mã vận đơn (tùy chọn)"
            />
          )}

          <TextField
            fullWidth
            label="Ghi chú"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            disabled={loading}
            multiline
            rows={3}
            placeholder="Ghi chú về việc cập nhật trạng thái..."
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || formData.status === order.status}
        >
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderStatusForm;