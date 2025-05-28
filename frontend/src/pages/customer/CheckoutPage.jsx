import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Alert,
  Snackbar,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from '@mui/material';
import {
  ShoppingCart,
  LocationOn,
  Payment,
  CheckCircle,
  ArrowBack,
  Add,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { cartService } from '../../services/cartService';
import { orderService } from '../../services/orderService';
import { addressService } from '../../services/addressService';
import { AddressList } from '../../components/address';

const steps = ['Giỏ hàng', 'Địa chỉ giao hàng', 'Thanh toán', 'Hoàn tất'];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  // State management
  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Cart data
  const [cart, setCart] = useState(null);
  const [cartSummary, setCartSummary] = useState(null);
  
  // Address data
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  // Payment data
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [notes, setNotes] = useState('');
  
  // Order data
  const [orderResult, setOrderResult] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    loadCheckoutData();
  }, [isAuthenticated]);

  const loadCheckoutData = async () => {
    try {
      setLoading(true);
      const [cartResponse, summaryResponse, addressResponse] = await Promise.all([
        cartService.getCart(),
        cartService.getCartSummary(),
        addressService.getUserAddresses(user.id)
      ]);

      if (cartResponse.data.success) {
        setCart(cartResponse.data.data);
      }

      if (summaryResponse.data.success) {
        setCartSummary(summaryResponse.data.data);
      }

      if (addressResponse.data.success) {
        const addressList = addressResponse.data.data;
        setAddresses(addressList);
        
        // Auto select default address
        const defaultAddress = addressList.find(addr => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        }
      }
    } catch (err) {
      setError('Lỗi khi tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (activeStep === 1) {
      // Validate address
      if (!selectedAddress) {
        setError('Vui lòng chọn địa chỉ giao hàng');
        return;
      }
    }
    
    if (activeStep === 2) {
      // Validate payment method
      if (!paymentMethod) {
        setError('Vui lòng chọn phương thức thanh toán');
        return;
      }
      
      // Process order
      handlePlaceOrder();
      return;
    }
    
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (activeStep === 1) {
      navigate('/cart');
      return;
    }
    
    setActiveStep(prev => prev - 1);
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      
      const orderData = {
        shippingAddressId: selectedAddress.id,
        paymentMethod: paymentMethod,
        notes: notes.trim() || null,
      };

      const response = await orderService.create(orderData);
      
      if (response.data.success) {
        setOrderResult(response.data.data);
        setActiveStep(3);
        setSuccess('Đặt hàng thành công!');
      } else {
        setError(response.data.message || 'Đặt hàng thất bại');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi đặt hàng');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price || 0);
  };

  const getPaymentMethodLabel = (method) => {
    const methods = {
      'COD': 'Thanh toán khi nhận hàng',
      'BANK_TRANSFER': 'Chuyển khoản ngân hàng',
      'CREDIT_CARD': 'Thẻ tín dụng',
      'E_WALLET': 'Ví điện tử',
    };
    return methods[method] || method;
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" className="font-semibold mb-4">
                    Chọn địa chỉ giao hàng
                  </Typography>
                  
                  {addresses.length === 0 ? (
                    <Box className="text-center py-8">
                      <LocationOn className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <Typography variant="h6" className="text-gray-500 mb-4">
                        Chưa có địa chỉ giao hàng
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setShowAddressForm(true)}
                      >
                        Thêm địa chỉ mới
                      </Button>
                    </Box>
                  ) : (
                    <>
                      <Box className="space-y-3 mb-4">
                        {addresses.map((address) => (
                          <Card
                            key={address.id}
                            className={`cursor-pointer transition-all ${
                              selectedAddress?.id === address.id
                                ? 'ring-2 ring-primary-500 bg-primary-50'
                                : 'hover:shadow-md'
                            }`}
                            onClick={() => setSelectedAddress(address)}
                          >
                            <CardContent className="py-3">
                              <Box className="flex items-start justify-between">
                                <Box className="flex-1">
                                  <Box className="flex items-center space-x-2 mb-2">
                                    <Typography variant="subtitle2" className="font-semibold">
                                      {address.receiverName}
                                    </Typography>
                                    <Typography variant="body2" className="text-gray-600">
                                      {address.receiverPhone}
                                    </Typography>
                                    {address.isDefault && (
                                      <Chip label="Mặc định" color="primary" size="small" />
                                    )}
                                  </Box>
                                  <Typography variant="body2" className="text-gray-700">
                                    {address.fullAddress}
                                  </Typography>
                                  {address.note && (
                                    <Typography variant="caption" className="text-gray-500">
                                      Ghi chú: {address.note}
                                    </Typography>
                                  )}
                                </Box>
                                
                                <FormControlLabel
                                  control={
                                    <Radio
                                      checked={selectedAddress?.id === address.id}
                                      onChange={() => setSelectedAddress(address)}
                                    />
                                  }
                                  label=""
                                />
                              </Box>
                            </CardContent>
                          </Card>
                        ))}
                      </Box>
                      
                      <Button
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={() => setShowAddressForm(true)}
                        fullWidth
                      >
                        Thêm địa chỉ mới
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              {cartSummary && (
                <Card>
                  <CardContent>
                    <Typography variant="h6" className="font-semibold mb-4">
                      Tóm tắt đơn hàng
                    </Typography>
                    
                    <Box className="space-y-2 mb-4">
                      <Box className="flex justify-between">
                        <Typography>Số sản phẩm:</Typography>
                        <Typography>{cartSummary.totalItems}</Typography>
                      </Box>
                      
                      <Box className="flex justify-between">
                        <Typography>Tạm tính:</Typography>
                        <Typography>{formatPrice(cartSummary.subtotal)}</Typography>
                      </Box>
                      
                      <Box className="flex justify-between">
                        <Typography>Phí vận chuyển:</Typography>
                        <Typography>
                          {cartSummary.shipping > 0 ? formatPrice(cartSummary.shipping) : 'Miễn phí'}
                        </Typography>
                      </Box>
                      
                      {cartSummary.discount > 0 && (
                        <Box className="flex justify-between text-green-600">
                          <Typography>Giảm giá:</Typography>
                          <Typography>-{formatPrice(cartSummary.discount)}</Typography>
                        </Box>
                      )}
                    </Box>
                    
                    <Divider className="my-3" />
                    
                    <Box className="flex justify-between mb-4">
                      <Typography variant="h6" className="font-bold">
                        Tổng cộng:
                      </Typography>
                      <Typography variant="h6" className="font-bold text-primary-600">
                        {formatPrice(cartSummary.total)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" className="font-semibold mb-4">
                    Phương thức thanh toán
                  </Typography>
                  
                  <FormControl component="fieldset" fullWidth>
                    <RadioGroup
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <FormControlLabel
                        value="COD"
                        control={<Radio />}
                        label={
                          <Box>
                            <Typography variant="body1" className="font-medium">
                              Thanh toán khi nhận hàng (COD)
                            </Typography>
                            <Typography variant="caption" className="text-gray-600">
                              Thanh toán bằng tiền mặt khi nhận được hàng
                            </Typography>
                          </Box>
                        }
                      />
                      
                      <FormControlLabel
                        value="BANK_TRANSFER"
                        control={<Radio />}
                        label={
                          <Box>
                            <Typography variant="body1" className="font-medium">
                              Chuyển khoản ngân hàng
                            </Typography>
                            <Typography variant="caption" className="text-gray-600">
                              Chuyển khoản qua ngân hàng trước khi giao hàng
                            </Typography>
                          </Box>
                        }
                      />
                      
                      <FormControlLabel
                        value="E_WALLET"
                        control={<Radio />}
                        label={
                          <Box>
                            <Typography variant="body1" className="font-medium">
                              Ví điện tử
                            </Typography>
                            <Typography variant="caption" className="text-gray-600">
                              Thanh toán qua MoMo, ZaloPay, VNPay
                            </Typography>
                          </Box>
                        }
                      />
                    </RadioGroup>
                  </FormControl>
                  
                  <Box className="mt-6">
                    <Typography variant="subtitle2" className="font-medium mb-2">
                      Ghi chú đơn hàng (tùy chọn)
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ghi chú cho người bán..."
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" className="font-semibold mb-4">
                    Xác nhận đơn hàng
                  </Typography>
                  
                  {selectedAddress && (
                    <Box className="mb-4 p-3 bg-gray-50 rounded">
                      <Typography variant="subtitle2" className="font-medium mb-1">
                        Địa chỉ giao hàng:
                      </Typography>
                      <Typography variant="body2">
                        {selectedAddress.receiverName} - {selectedAddress.receiverPhone}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        {selectedAddress.fullAddress}
                      </Typography>
                    </Box>
                  )}
                  
                  <Box className="mb-4 p-3 bg-gray-50 rounded">
                    <Typography variant="subtitle2" className="font-medium mb-1">
                      Phương thức thanh toán:
                    </Typography>
                    <Typography variant="body2">
                      {getPaymentMethodLabel(paymentMethod)}
                    </Typography>
                  </Box>
                  
                  {cartSummary && (
                    <Box className="space-y-2">
                      <Box className="flex justify-between">
                        <Typography>Tạm tính:</Typography>
                        <Typography>{formatPrice(cartSummary.subtotal)}</Typography>
                      </Box>
                      
                      <Box className="flex justify-between">
                        <Typography>Phí vận chuyển:</Typography>
                        <Typography>
                          {cartSummary.shipping > 0 ? formatPrice(cartSummary.shipping) : 'Miễn phí'}
                        </Typography>
                      </Box>
                      
                      {cartSummary.discount > 0 && (
                        <Box className="flex justify-between text-green-600">
                          <Typography>Giảm giá:</Typography>
                          <Typography>-{formatPrice(cartSummary.discount)}</Typography>
                        </Box>
                      )}
                      
                      <Divider className="my-2" />
                      
                      <Box className="flex justify-between">
                        <Typography variant="h6" className="font-bold">
                          Tổng cộng:
                        </Typography>
                        <Typography variant="h6" className="font-bold text-primary-600">
                          {formatPrice(cartSummary.total)}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Box className="text-center py-12">
            <CheckCircle className="w-24 h-24 text-green-600 mx-auto mb-6" />
            <Typography variant="h4" className="font-bold text-gray-800 mb-4">
              Đặt hàng thành công!
            </Typography>
            <Typography variant="body1" className="text-gray-600 mb-6">
              Đơn hàng <strong>#{orderResult?.orderCode}</strong> đã được tạo thành công.
            </Typography>
            
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" className="font-semibold mb-3">
                      Thông tin đơn hàng
                    </Typography>
                    <Box className="space-y-2 text-left">
                      <Box className="flex justify-between">
                        <Typography variant="body2">Mã đơn hàng:</Typography>
                        <Typography variant="body2" className="font-medium">
                          #{orderResult?.orderCode}
                        </Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2">Tổng tiền:</Typography>
                        <Typography variant="body2" className="font-medium text-primary-600">
                          {formatPrice(orderResult?.totalAmount)}
                        </Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2">Thanh toán:</Typography>
                        <Typography variant="body2" className="font-medium">
                          {getPaymentMethodLabel(orderResult?.paymentMethod)}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Box className="mt-8 space-y-3">
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/my-orders')}
                className="mr-3"
              >
                Xem đơn hàng
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/products')}
              >
                Tiếp tục mua sắm
              </Button>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box className="min-h-screen bg-gray-50 py-8">
      <Box className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <Box className="mb-8">
          <Typography variant="h4" className="font-bold text-gray-800 mb-4">
            Thanh toán
          </Typography>
          
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Content */}
        {renderStepContent()}

        {/* Actions */}
        {activeStep < 3 && (
          <Box className="flex justify-between mt-8">
            <Button
              onClick={handleBack}
              disabled={loading}
              startIcon={<ArrowBack />}
              size="large"
            >
              {activeStep === 1 ? 'Về giỏ hàng' : 'Quay lại'}
            </Button>

            <Button
              onClick={handleNext}
              disabled={loading || (activeStep === 1 && !selectedAddress)}
              variant="contained"
              size="large"
              endIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Đang xử lý...' : 
               activeStep === 2 ? 'Đặt hàng' : 'Tiếp tục'}
            </Button>
          </Box>
        )}

        {/* Address Form Dialog */}
        {showAddressForm && (
          <AddressList
            userId={user.id}
            showHeader={false}
            onClose={() => {
              setShowAddressForm(false);
              loadCheckoutData();
            }}
          />
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

export default CheckoutPage;