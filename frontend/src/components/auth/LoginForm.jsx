import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Link,
  Divider,
} from '@mui/material';
import { Visibility, VisibilityOff, Lock, Person } from '@mui/icons-material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Clear error when component unmounts or form changes
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }

    // Clear global error
    if (error) clearError();
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.username.trim()) {
      errors.username = 'Vui lòng nhập tên đăng nhập';
    }

    if (!formData.password.trim()) {
      errors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = await login(formData);
    
    if (result.success) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleDemoLogin = async (demoType) => {
    const demoCredentials = {
      admin: { username: 'admin', password: '123456' },
      employee: { username: 'employee1', password: '123456' },
      customer: { username: 'customer1', password: '123456' },
    };

    const credentials = demoCredentials[demoType];
    if (credentials) {
      setFormData(credentials);
      const result = await login(credentials);
      if (result.success) {
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      }
    }
  };

  return (
    <Box className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="p-8">
          {/* Logo & Title */}
          <Box className="text-center mb-8">
            <Box className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Typography variant="h4" className="text-white font-bold">
                P
              </Typography>
            </Box>
            <Typography variant="h4" className="font-bold text-gray-800 mb-2">
              Pet Shop
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Đăng nhập vào hệ thống quản lý
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" className="mb-6" onClose={clearError}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <Box className="space-y-4">
              <TextField
                fullWidth
                name="username"
                label="Tên đăng nhập"
                value={formData.username}
                onChange={handleChange}
                error={!!validationErrors.username}
                helperText={validationErrors.username}
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  },
                }}
              />

              <TextField
                fullWidth
                name="password"
                label="Mật khẩu"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                error={!!validationErrors.password}
                helperText={validationErrors.password}
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock className="text-gray-400" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePassword}
                        edge="end"
                        disabled={isLoading}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                className="h-12 rounded-xl font-semibold"
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontSize: '16px',
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Đăng nhập'
                )}
              </Button>
            </Box>
          </form>

          {/* Register Link */}
          <Box className="mt-6 text-center">
            <Typography variant="body2" className="text-gray-600">
              Chưa có tài khoản?{' '}
              <Link
                component={RouterLink}
                to="/register"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Đăng ký ngay
              </Link>
            </Typography>
          </Box>

          <Divider className="my-6">
            <Typography variant="caption" className="text-gray-500">
              Hoặc đăng nhập nhanh
            </Typography>
          </Divider>

          {/* Demo Accounts */}
          <Box className="space-y-2">
            <Button
              fullWidth
              variant="outlined"
              size="small"
              onClick={() => handleDemoLogin('admin')}
              disabled={isLoading}
              className="text-sm"
            >
              Demo Admin
            </Button>
            <Box className="flex space-x-2">
              <Button
                fullWidth
                variant="outlined"
                size="small"
                onClick={() => handleDemoLogin('employee')}
                disabled={isLoading}
                className="text-sm"
              >
                Demo Nhân viên
              </Button>
              <Button
                fullWidth
                variant="outlined"
                size="small"
                onClick={() => handleDemoLogin('customer')}
                disabled={isLoading}
                className="text-sm"
              >
                Demo Khách hàng
              </Button>
            </Box>
          </Box>

          {/* Footer */}
          <Box className="mt-6 text-center">
            <Typography variant="caption" className="text-gray-500">
              © 2025 Pet Shop Management System
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginForm;