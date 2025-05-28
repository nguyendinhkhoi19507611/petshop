import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  Snackbar,
  Divider,
  CircularProgress,
} from '@mui/material';
import { ShoppingCart, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { CartItem, CartSummary } from '../components/cart';
import { cartService } from '../services/cartService';
import { useAuth } from '../contexts/AuthContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  // State management
  const [cart, setCart] = useState(null);
  const [cartSummary, setCartSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    }
  }, [isAuthenticated]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const [cartResponse, summaryResponse] = await Promise.all([
        cartService.getCart(),
        cartService.getCartSummary()
      ]);

      if (cartResponse.data.success) {
        setCart(cartResponse.data.data);
      }

      if (summaryResponse.data.success) {
        setCartSummary(summaryResponse.data.data);
      }
    } catch (err) {
      setError('Lỗi khi tải giỏ hàng. Vui lòng thử lại.');
      console.error('Load cart error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, quantity) => {
    try {
      const response = await cartService.updateCartItem(itemId, { quantity });
      
      if (response.data.success) {
        setSuccess('Cập nhật số lượng thành công');
        loadCart(); // Reload cart data
      } else {
        setError(response.data.message || 'Không thể cập nhật số lượng');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi cập nhật số lượng');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const response = await cartService.removeFromCart(itemId);
      
      if (response.data.success) {
        setSuccess('Đã xóa sản phẩm khỏi giỏ hàng');
        loadCart(); // Reload cart data
      } else {
        setError(response.data.message || 'Không thể xóa sản phẩm');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi xóa sản phẩm');
    }
  };

  const handleApplyCoupon = async (couponCode) => {
    try {
      const response = await cartService.applyCoupon({ couponCode });
      
      if (response.data.success) {
        setSuccess('Áp dụng mã giảm giá thành công');
        loadCart(); // Reload cart data
      } else {
        throw new Error(response.data.message || 'Mã giảm giá không hợp lệ');
      }
    } catch (err) {
      throw err; // Re-throw to be handled by CartSummary component
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      const response = await cartService.applyCoupon({ couponCode: '' });
      
      if (response.data.success) {
        setSuccess('Đã bỏ mã giảm giá');
        loadCart(); // Reload cart data
      } else {
        setError(response.data.message || 'Không thể bỏ mã giảm giá');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi bỏ mã giảm giá');
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng?')) {
      try {
        const response = await cartService.clearCart();
        
        if (response.data.success) {
          setSuccess('Đã xóa tất cả sản phẩm trong giỏ hàng');
          loadCart(); // Reload cart data
        } else {
          setError(response.data.message || 'Không thể xóa giỏ hàng');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Lỗi khi xóa giỏ hàng');
      }
    }
  };

  const handleCheckout = () => {
    if (!cartSummary?.hasOutOfStockItems && cartSummary?.totalItems > 0) {
      navigate('/checkout');
    }
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  if (!isAuthenticated) {
    return (
      <Box className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="text-center p-8">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <Typography variant="h6" className="mb-4">
              Vui lòng đăng nhập để xem giỏ hàng
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              className="mb-2"
              fullWidth
            >
              Đăng nhập
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/products')}
              fullWidth
            >
              Tiếp tục mua sắm
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box className="min-h-screen flex items-center justify-center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="min-h-screen bg-gray-50 py-8">
      <Box className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <Box className="flex items-center justify-between mb-8">
          <Box>
            <Typography variant="h4" className="font-bold text-gray-800 mb-2">
              Giỏ hàng của bạn
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              {cart?.cartItems?.length || 0} sản phẩm trong giỏ hàng
            </Typography>
          </Box>

          <Button
            startIcon={<ArrowBack />}
            onClick={handleContinueShopping}
            variant="outlined"
          >
            Tiếp tục mua sắm
          </Button>
        </Box>

        {!cart || !cart.cartItems || cart.cartItems.length === 0 ? (
          /* Empty Cart */
          <Card>
            <CardContent className="text-center py-16">
              <ShoppingCart className="w-24 h-24 text-gray-400 mx-auto mb-6" />
              <Typography variant="h5" className="font-semibold text-gray-700 mb-4">
                Giỏ hàng của bạn đang trống
              </Typography>
              <Typography variant="body1" className="text-gray-600 mb-8">
                Hãy khám phá các sản phẩm tuyệt vời của chúng tôi và thêm vào giỏ hàng!
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={handleContinueShopping}
                className="px-8"
              >
                Khám phá sản phẩm
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Cart with Items */
          <Grid container spacing={4}>
            {/* Cart Items */}
            <Grid item xs={12} lg={8}>
              <Card>
                <CardContent>
                  <Box className="flex items-center justify-between mb-6">
                    <Typography variant="h6" className="font-semibold">
                      Sản phẩm trong giỏ hàng
                    </Typography>
                    <Button
                      onClick={handleClearCart}
                      color="error"
                      size="small"
                    >
                      Xóa tất cả
                    </Button>
                  </Box>

                  <Box className="space-y-4">
                    {cart.cartItems.map((item) => (
                      <Box key={item.id}>
                        <CartItem
                          item={item}
                          onUpdateQuantity={handleUpdateQuantity}
                          onRemove={handleRemoveItem}
                          loading={loading}
                        />
                        <Divider className="mt-4" />
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Cart Summary */}
            <Grid item xs={12} lg={4}>
              {cartSummary && (
                <CartSummary
                  summary={cartSummary}
                  onApplyCoupon={handleApplyCoupon}
                  onRemoveCoupon={handleRemoveCoupon}
                  onCheckout={handleCheckout}
                  loading={loading}
                />
              )}
            </Grid>
          </Grid>
        )}

        {/* Notifications */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError('')}
        >
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!success}
          autoHideDuration={4000}
          onClose={() => setSuccess('')}
        >
          <Alert severity="success" onClose={() => setSuccess('')}>
            {success}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default CartPage;