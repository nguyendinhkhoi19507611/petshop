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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Paper,
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Lock, 
  Person, 
  Email, 
  Phone,
  CreditCard,
  Cake,
  ArrowBack,
  ArrowForward,
  CheckCircle,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const steps = ['Thông tin cơ bản', 'Thông tin bổ sung', 'Xác nhận'];

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError, isAuthenticated } = useAuth();

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    citizenId: '',
    birthDate: '',
    gender: '',
    role: 'customer',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear error when component unmounts
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

  const validateStep = (step) => {
    const errors = {};

    if (step === 0) {
      // Step 1: Basic Information
      if (!formData.username.trim()) {
        errors.username = 'Vui lòng nhập tên đăng nhập';
      } else if (formData.username.length < 3) {
        errors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
      } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        errors.username = 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới';
      }

      if (!formData.email.trim()) {
        errors.email = 'Vui lòng nhập email';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Email không hợp lệ';
      }

      if (!formData.fullName.trim()) {
        errors.fullName = 'Vui lòng nhập họ và tên';
      } else if (formData.fullName.length < 2) {
        errors.fullName = 'Họ và tên phải có ít nhất 2 ký tự';
      }

      if (!formData.password.trim()) {
        errors.password = 'Vui lòng nhập mật khẩu';
      } else if (formData.password.length < 6) {
        errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
      }

      if (!formData.confirmPassword.trim()) {
        errors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
      }
    } else if (step === 1) {
      // Step 2: Additional Information (optional fields)
      if (formData.phoneNumber && !/^[0-9]{10}$/.test(formData.phoneNumber)) {
        errors.phoneNumber = 'Số điện thoại không hợp lệ (10 chữ số)';
      }

      if (formData.citizenId && !/^[0-9]{12}$/.test(formData.citizenId)) {
        errors.citizenId = 'CCCD không hợp lệ (12 chữ số)';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(0) || !validateStep(1)) {
      return;
    }

    const registerData = {
      username: formData.username,
      email: formData.email,
      fullName: formData.fullName,
      password: formData.password,
      phoneNumber: formData.phoneNumber || null,
      citizenId: formData.citizenId || null,
      birthDate: formData.birthDate || null,
      gender: formData.gender !== '' ? formData.gender === 'true' : null,
      role: formData.role,
    };

    const result = await register(registerData);
    
    if (result.success) {
      setRegisterSuccess(true);
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Đăng ký thành công! Vui lòng đăng nhập.',
            username: formData.username
          }
        });
      }, 3000);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" className="font-semibold text-gray-700 mb-4">
                Thông tin đăng nhập
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="username"
                label="Tên đăng nhập *"
                value={formData.username}
                onChange={handleChange}
                error={!!validationErrors.username}
                helperText={validationErrors.username || 'Chỉ được sử dụng chữ cái, số và dấu gạch dưới'}
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="email"
                label="Email *"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!validationErrors.email}
                helperText={validationErrors.email}
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="fullName"
                label="Họ và tên *"
                value={formData.fullName}
                onChange={handleChange}
                error={!!validationErrors.fullName}
                helperText={validationErrors.fullName}
                disabled={isLoading}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="password"
                label="Mật khẩu *"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                error={!!validationErrors.password}
                helperText={validationErrors.password || 'Ít nhất 6 ký tự'}
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
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="confirmPassword"
                label="Xác nhận mật khẩu *"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!validationErrors.confirmPassword}
                helperText={validationErrors.confirmPassword}
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
                        onClick={handleToggleConfirmPassword}
                        edge="end"
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" className="font-semibold text-gray-700 mb-4">
                Thông tin bổ sung
              </Typography>
              <Typography variant="body2" className="text-gray-500 mb-4">
                Các thông tin này là tùy chọn, bạn có thể bỏ qua
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="phoneNumber"
                label="Số điện thoại"
                value={formData.phoneNumber}
                onChange={handleChange}
                error={!!validationErrors.phoneNumber}
                helperText={validationErrors.phoneNumber || '10 chữ số (ví dụ: 0987654321)'}
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="citizenId"
                label="CCCD/CMND"
                value={formData.citizenId}
                onChange={handleChange}
                error={!!validationErrors.citizenId}
                helperText={validationErrors.citizenId || '12 chữ số'}
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CreditCard className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="birthDate"
                label="Ngày sinh"
                type="date"
                value={formData.birthDate}
                onChange={handleChange}
                disabled={isLoading}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Cake className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={isLoading}>
                <InputLabel>Giới tính</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  label="Giới tính"
                >
                  <MenuItem value="">Không chọn</MenuItem>
                  <MenuItem value="true">Nam</MenuItem>
                  <MenuItem value="false">Nữ</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth disabled={isLoading}>
                <InputLabel>Loại tài khoản</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  label="Loại tài khoản"
                >
                  <MenuItem value="customer">Khách hàng</MenuItem>
                  <MenuItem value="employee">Nhân viên</MenuItem>
                  <MenuItem value="admin">Quản trị viên</MenuItem>
                </Select>
                <FormHelperText>
                  Chọn loại tài khoản phù hợp với vai trò của bạn
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" className="font-semibold text-gray-700 mb-4">
                Xác nhận thông tin
              </Typography>
              <Typography variant="body2" className="text-gray-500 mb-4">
                Vui lòng kiểm tra lại thông tin trước khi đăng ký
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Paper className="p-4 bg-gray-50">
                <Typography variant="subtitle2" className="font-semibold mb-3">
                  Thông tin đăng nhập:
                </Typography>
                <Box className="space-y-2">
                  <Typography variant="body2">
                    <strong>Tên đăng nhập:</strong> {formData.username}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Email:</strong> {formData.email}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Họ và tên:</strong> {formData.fullName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Loại tài khoản:</strong> {
                      formData.role === 'customer' ? 'Khách hàng' :
                      formData.role === 'employee' ? 'Nhân viên' : 'Quản trị viên'
                    }
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {(formData.phoneNumber || formData.citizenId || formData.birthDate || formData.gender !== '') && (
              <Grid item xs={12}>
                <Paper className="p-4 bg-gray-50">
                  <Typography variant="subtitle2" className="font-semibold mb-3">
                    Thông tin bổ sung:
                  </Typography>
                  <Box className="space-y-2">
                    {formData.phoneNumber && (
                      <Typography variant="body2">
                        <strong>Số điện thoại:</strong> {formData.phoneNumber}
                      </Typography>
                    )}
                    {formData.citizenId && (
                      <Typography variant="body2">
                        <strong>CCCD/CMND:</strong> {formData.citizenId}
                      </Typography>
                    )}
                    {formData.birthDate && (
                      <Typography variant="body2">
                        <strong>Ngày sinh:</strong> {new Date(formData.birthDate).toLocaleDateString('vi-VN')}
                      </Typography>
                    )}
                    {formData.gender !== '' && (
                      <Typography variant="body2">
                        <strong>Giới tính:</strong> {formData.gender === 'true' ? 'Nam' : 'Nữ'}
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </Grid>
            )}
          </Grid>
        );

      default:
        return null;
    }
  };

  if (registerSuccess) {
    return (
      <Box className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardContent className="p-8 text-center">
            <Box className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </Box>
            <Typography variant="h5" className="font-bold text-gray-800 mb-4">
              Đăng ký thành công!
            </Typography>
            <Typography variant="body1" className="text-gray-600 mb-6">
              Tài khoản <strong>{formData.username}</strong> đã được tạo thành công.
            </Typography>
            <Typography variant="body2" className="text-gray-500 mb-4">
              Đang chuyển hướng đến trang đăng nhập...
            </Typography>
            <CircularProgress className="mt-4" />
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-xl">
        <CardContent className="p-8">
          {/* Logo & Title */}
          <Box className="text-center mb-8">
            <Box className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Typography variant="h4" className="text-white font-bold">
                P
              </Typography>
            </Box>
            <Typography variant="h4" className="font-bold text-gray-800 mb-2">
              Đăng ký tài khoản
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Tạo tài khoản mới để sử dụng hệ thống Pet Shop
            </Typography>
          </Box>

          {/* Stepper */}
          <Box className="mb-8">
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" className="mb-6" onClose={clearError}>
              {error}
            </Alert>
          )}

          {/* Step Content */}
          <Box className="mb-8">
            {renderStepContent(activeStep)}
          </Box>

          {/* Navigation Buttons */}
          <Box className="flex justify-between">
            <Button
              disabled={activeStep === 0 || isLoading}
              onClick={handleBack}
              startIcon={<ArrowBack />}
              variant="outlined"
              size="large"
            >
              Quay lại
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                variant="contained"
                size="large"
                endIcon={isLoading ? <CircularProgress size={20} /> : <CheckCircle />}
              >
                {isLoading ? 'Đang đăng ký...' : 'Hoàn thành đăng ký'}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={isLoading}
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
              >
                Tiếp tục
              </Button>
            )}
          </Box>

          {/* Login Link */}
          <Box className="mt-8 text-center">
            <Typography variant="body2" className="text-gray-600">
              Đã có tài khoản?{' '}
              <Link
                component={RouterLink}
                to="/login"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Đăng nhập ngay
              </Link>
            </Typography>
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

export default RegisterForm;