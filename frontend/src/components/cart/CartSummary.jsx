import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
  Divider,
  Chip,
  Alert,
} from '@mui/material';
import {
  LocalOffer,
  ShoppingCart,
  Payment,
  Remove,
} from '@mui/icons-material';

const CartSummary = ({ 
  summary,
  onApplyCoupon,
  onRemoveCoupon,
  onCheckout,
  loading = false 
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price || 0);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    setCouponError('');

    try {
      await onApplyCoupon(couponCode);
      setCouponCode('');
    } catch (error) {
      setCouponError(error.response?.data?.message || 'Mã giảm giá không hợp lệ');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      await onRemoveCoupon();
    } catch (error) {
      console.error('Error removing coupon:', error);
    }
  };

  return (
    <Card className="sticky top-4">
      <CardContent>
        <Typography variant="h6" className="font-semibold mb-4">
          Tóm tắt đơn hàng
        </Typography>

        {/* Items Count */}
        <Box className="flex justify-between items-center mb-3">
          <Typography variant="body2">Số sản phẩm:</Typography>
          <Typography variant="body2" className="font-medium">
            {summary.totalItems} sản phẩm
          </Typography>
        </Box>

        {/* Subtotal */}
        <Box className="flex justify-between items-center mb-3">
          <Typography variant="body2">Tạm tính:</Typography>
          <Typography variant="body2" className="font-medium">
            {formatPrice(summary.subtotal)}
          </Typography>
        </Box>

        {/* Shipping */}
        <Box className="flex justify-between items-center mb-3">
          <Typography variant="body2">Phí vận chuyển:</Typography>
          <Typography variant="body2" className="font-medium">
            {summary.shipping > 0 ? formatPrice(summary.shipping) : 'Miễn phí'}
          </Typography>
        </Box>

        {/* Discount */}
        {summary.discount > 0 && (
          <Box className="flex justify-between items-center mb-3">
            <Typography variant="body2" className="text-green-600">
              Giảm giá:
            </Typography>
            <Typography variant="body2" className="font-medium text-green-600">
              -{formatPrice(summary.discount)}
            </Typography>
          </Box>
        )}

        {/* Applied Coupon */}
        {summary.couponCode && (
          <Box className="mb-3">
            <Box className="flex items-center justify-between p-2 bg-green-50 rounded">
              <Box className="flex items-center space-x-2">
                <LocalOffer className="text-green-600" fontSize="small" />
                <Typography variant="body2" className="text-green-700 font-medium">
                  {summary.couponCode}
                </Typography>
              </Box>
              <Button
                size="small"
                onClick={handleRemoveCoupon}
                disabled={loading}
                startIcon={<Remove />}
              >
                Bỏ
              </Button>
            </Box>
          </Box>
        )}

        <Divider className="my-3" />

        {/* Total */}
        <Box className="flex justify-between items-center mb-4">
          <Typography variant="h6" className="font-bold">
            Tổng cộng:
          </Typography>
          <Typography variant="h6" className="font-bold text-primary-600">
            {formatPrice(summary.total)}
          </Typography>
        </Box>

        {/* Coupon Input */}
        {!summary.couponCode && (
          <Box className="mb-4">
            <Typography variant="subtitle2" className="mb-2">
              Mã giảm giá
            </Typography>
            <Box className="flex space-x-2">
              <TextField
                size="small"
                placeholder="Nhập mã giảm giá"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                disabled={couponLoading || loading}
                className="flex-1"
              />
              <Button
                variant="outlined"
                onClick={handleApplyCoupon}
                disabled={!couponCode.trim() || couponLoading || loading}
                loading={couponLoading}
              >
                Áp dụng
              </Button>
            </Box>
            {couponError && (
              <Alert severity="error" className="mt-2">
                {couponError}
              </Alert>
            )}
          </Box>
        )}

        {/* Out of Stock Warning */}
        {summary.hasOutOfStockItems && (
          <Alert severity="warning" className="mb-4">
            Một số sản phẩm trong giỏ hàng đã hết hàng. Vui lòng cập nhật trước khi thanh toán.
          </Alert>
        )}

        {/* Checkout Button */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={onCheckout}
          disabled={loading || summary.hasOutOfStockItems || summary.totalItems === 0}
          startIcon={<Payment />}
          className="h-12"
        >
          {loading ? 'Đang xử lý...' : 'Thanh toán'}
        </Button>

        {/* Continue Shopping */}
        <Button
          fullWidth
          variant="text"
          className="mt-2"
          startIcon={<ShoppingCart />}
          href="/products"
        >
          Tiếp tục mua sắm
        </Button>
      </CardContent>
    </Card>
  );
};

export default CartSummary;