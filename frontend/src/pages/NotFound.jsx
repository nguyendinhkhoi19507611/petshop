import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
} from '@mui/material';
import { Search, ArrowBack, Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NotFound = () => {
  const navigate = useNavigate();
  const { isAdmin, isEmployee, isCustomer } = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    if (isAdmin()) {
      navigate('/admin/dashboard');
    } else if (isEmployee()) {
      navigate('/employee/dashboard');
    } else if (isCustomer()) {
      navigate('/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const getSuggestions = () => {
    if (isAdmin()) {
      return [
        { title: 'Quản lý sản phẩm', path: '/admin/products' },
        { title: 'Quản lý đơn hàng', path: '/admin/orders' },
        { title: 'Quản lý người dùng', path: '/admin/users' },
        { title: 'Dashboard', path: '/dashboard' },
      ];
    } else if (isEmployee()) {
      return [
        { title: 'Quản lý sản phẩm', path: '/employee/products' },
        { title: 'Quản lý đơn hàng', path: '/employee/orders' },
        { title: 'Dashboard', path: '/dashboard' },
      ];
    } else if (isCustomer()) {
      return [
        { title: 'Sản phẩm', path: '/products' },
        { title: 'Giỏ hàng', path: '/cart' },
        { title: 'Đơn hàng của tôi', path: '/my-orders' },
        { title: 'Trang chủ', path: '/dashboard' },
      ];
    }
    return [
      { title: 'Trang chủ', path: '/dashboard' },
    ];
  };

  return (
    <Container maxWidth="md" className="min-h-screen flex items-center justify-center">
      <Card className="w-full shadow-xl">
        <CardContent className="p-8 text-center">
          {/* 404 Animation */}
          <Box className="mb-8">
            <Typography 
              variant="h1" 
              className="font-bold text-gray-300 mb-4"
              sx={{ fontSize: { xs: '6rem', md: '8rem' } }}
            >
              404
            </Typography>
            
            <Box className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </Box>
          </Box>

          {/* Error Message */}
          <Typography variant="h4" className="font-bold text-gray-800 mb-4">
            Trang không tìm thấy
          </Typography>

          <Typography variant="body1" className="text-gray-600 mb-8 max-w-md mx-auto">
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển. 
            Hãy kiểm tra lại địa chỉ URL hoặc quay về trang chủ.
          </Typography>

          {/* Action Buttons */}
          <Box className="space-y-3 mb-8">
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleGoHome}
              startIcon={<Home />}
              className="rounded-xl"
            >
              Về trang chủ
            </Button>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={handleGoBack}
              startIcon={<ArrowBack />}
              className="rounded-xl"
            >
              Quay lại trang trước
            </Button>
          </Box>

          {/* Suggestions */}
          <Box>
            <Typography variant="h6" className="font-semibold text-gray-700 mb-4">
              Có thể bạn đang tìm:
            </Typography>
            
            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {getSuggestions().map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  onClick={() => navigate(suggestion.path)}
                  className="rounded-lg"
                >
                  {suggestion.title}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Help Text */}
          <Box className="mt-8 p-4 bg-gray-50 rounded-lg">
            <Typography variant="body2" className="text-gray-600">
              Nếu bạn cho rằng đây là lỗi, vui lòng liên hệ với đội ngũ hỗ trợ.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default NotFound;