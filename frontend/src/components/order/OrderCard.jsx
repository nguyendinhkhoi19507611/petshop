import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  MoreVert,
  Visibility,
  Edit,
  Cancel,
  LocalShipping,
  CheckCircle,
  Schedule,
  Receipt,
} from '@mui/icons-material';

const OrderCard = ({ 
  order, 
  onView, 
  onEdit, 
  onCancel,
  onUpdateStatus,
  canEdit = false,
  variant = 'default' // 'default', 'customer', 'admin'
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      'CHỜ_XỬ_LÝ': { label: 'Chờ xử lý', color: 'default' },
      'ĐÃ_XÁC_NHẬN': { label: 'Đã xác nhận', color: 'info' },
      'ĐANG_CHUẨN_BỊ': { label: 'Đang chuẩn bị', color: 'warning' },
      'ĐANG_GIAO': { label: 'Đang giao', color: 'primary' },
      'HOÀN_THÀNH': { label: 'Hoàn thành', color: 'success' },
      'ĐÃ_HỦY': { label: 'Đã hủy', color: 'error' },
    };

    const config = statusConfig[status] || { label: status, color: 'default' };
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        variant="outlined"
      />
    );
  };

  const getPaymentStatusChip = (status) => {
    const statusConfig = {
      'CHỜ_THANH_TOÁN': { label: 'Chờ thanh toán', color: 'warning' },
      'ĐÃ_THANH_TOÁN': { label: 'Đã thanh toán', color: 'success' },
      'THẤT_BẠI': { label: 'Thất bại', color: 'error' },
      'HOÀN_TIỀN': { label: 'Hoàn tiền', color: 'info' },
    };

    const config = statusConfig[status] || { label: status, color: 'default' };
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        variant="filled"
      />
    );
  };

  const getProgressValue = () => {
    const statusProgress = {
      'CHỜ_XỬ_LÝ': 20,
      'ĐÃ_XÁC_NHẬN': 40,
      'ĐANG_CHUẨN_BỊ': 60,
      'ĐANG_GIAO': 80,
      'HOÀN_THÀNH': 100,
      'ĐÃ_HỦY': 0,
    };
    return statusProgress[order.status] || 0;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const canCancelOrder = () => {
    return ['CHỜ_XỬ_LÝ', 'ĐÃ_XÁC_NHẬN'].includes(order.status);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent>
        <Box className="flex items-start justify-between mb-3">
          <Box>
            <Typography variant="h6" className="font-semibold text-primary-600">
              {order.orderCode}
            </Typography>
            <Typography variant="caption" className="text-gray-500">
              {formatDate(order.orderDate)}
            </Typography>
          </Box>
          
          <IconButton size="small" onClick={handleMenuClick}>
            <MoreVert />
          </IconButton>
        </Box>

        {/* Customer Info (Admin view) */}
        {variant === 'admin' && (
          <Box className="mb-3">
            <Typography variant="body2" className="text-gray-600">
              <strong>Khách hàng:</strong> {order.userName}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              <strong>Email:</strong> {order.userEmail}
            </Typography>
          </Box>
        )}

        {/* Order Items Preview */}
        <Box className="mb-3">
          <Typography variant="body2" className="font-medium mb-2">
            Sản phẩm ({order.orderItems?.length || 0} mặt hàng):
          </Typography>
          <Box className="flex space-x-2 overflow-x-auto">
            {order.orderItems?.slice(0, 3).map((item, index) => (
              <Avatar
                key={index}
                src={item.productImage}
                alt={item.productName}
                variant="rounded"
                sx={{ width: 40, height: 40 }}
              />
            ))}
            {order.orderItems?.length > 3 && (
              <Avatar
                variant="rounded"
                sx={{ width: 40, height: 40, bgcolor: 'grey.200' }}
              >
                <Typography variant="caption">
                  +{order.orderItems.length - 3}
                </Typography>
              </Avatar>
            )}
          </Box>
        </Box>

        {/* Progress Bar */}
        {order.status !== 'ĐÃ_HỦY' && (
          <Box className="mb-3">
            <Box className="flex justify-between items-center mb-1">
              <Typography variant="caption" className="text-gray-600">
                Tiến độ đơn hàng
              </Typography>
              <Typography variant="caption" className="text-gray-600">
                {getProgressValue()}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={getProgressValue()}
              className="h-2 rounded"
              color="primary"
            />
          </Box>
        )}

        {/* Status & Payment */}
        <Box className="flex items-center justify-between mb-3">
          <Box className="flex space-x-2">
            {getStatusChip(order.status)}
            {getPaymentStatusChip(order.paymentStatus)}
          </Box>
          
          {order.trackingNumber && (
            <Chip
              icon={<LocalShipping />}
              label={order.trackingNumber}
              size="small"
              variant="outlined"
              color="info"
            />
          )}
        </Box>

        {/* Shipping Address */}
        <Box className="mb-3">
          <Typography variant="body2" className="text-gray-600">
            <strong>Giao đến:</strong> {order.receiverName}
          </Typography>
          <Typography variant="caption" className="text-gray-500">
            {order.shippingAddress}
          </Typography>
        </Box>

        <Divider className="my-3" />

        {/* Total Amount */}
        <Box className="flex justify-between items-center mb-3">
          <Typography variant="body2" className="font-medium">
            Tổng thanh toán:
          </Typography>
          <Typography variant="h6" className="font-bold text-primary-600">
            {formatPrice(order.totalAmount)}
          </Typography>
        </Box>

        {/* Actions */}
        <Box className="flex space-x-2">
          <Button
            size="small"
            variant="outlined"
            onClick={() => onView(order)}
            startIcon={<Visibility />}
            className="flex-1"
          >
            Chi tiết
          </Button>
          
          {variant === 'customer' && canCancelOrder() && (
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => onCancel(order)}
              startIcon={<Cancel />}
            >
              Hủy
            </Button>
          )}
        </Box>
      </CardContent>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { onView(order); handleMenuClose(); }}>
          <Visibility className="mr-2" fontSize="small" />
          Xem chi tiết
        </MenuItem>
        
        {canEdit && (
          <>
            <MenuItem onClick={() => { onEdit(order); handleMenuClose(); }}>
              <Edit className="mr-2" fontSize="small" />
              Cập nhật trạng thái
            </MenuItem>
            
            {canCancelOrder() && (
              <MenuItem 
                onClick={() => { onCancel(order); handleMenuClose(); }}
                className="text-red-600"
              >
                <Cancel className="mr-2" fontSize="small" />
                Hủy đơn hàng
              </MenuItem>
            )}
          </>
        )}
      </Menu>
    </Card>
  );
};

export default OrderCard;
