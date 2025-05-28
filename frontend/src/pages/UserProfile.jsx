import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
  Divider,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  CreditCard,
  Cake,
  Edit,
  Save,
  Cancel,
  Visibility,
  VisibilityOff,
  PhotoCamera,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';

const UserProfile = () => {
  const { user, getCurrentUser } = useAuth();
  
  // State management
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    fullName: '',
    phoneNumber: '',
    citizenId: '',
    birthDate: '',
    gender: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Password change dialog
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || '',
        email: user.email || '',
        fullName: user.fullName || '',
        phoneNumber: user.phoneNumber || '',
        citizenId: user.citizenId || '',
        birthDate: user.birthDate ? user.birthDate.split('T')[0] : '',
        gender: user.gender !== null ? user.gender.toString() : '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
    }

    if (!passwordData.newPassword) {
      errors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự';
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      
      const updateData = {
        ...profileData,
        gender: profileData.gender !== '' ? profileData.gender === 'true' : null,
        birthDate: profileData.birthDate || null,
      };

      const response = await userService.update(user.id, updateData);

      if (response.data.success) {
        setSuccess('Cập nhật thông tin thành công!');
        setIsEditing(false);
        // Refresh user data
        await getCurrentUser();
      } else {
        setError(response.data.message || 'Không thể cập nhật thông tin');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const response = await userService.changePassword(user.id, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.data.success) {
        setSuccess('Đổi mật khẩu thành công!');
        setPasswordDialogOpen(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        setError(response.data.message || 'Không thể đổi mật khẩu');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi đổi mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data
    if (user) {
      setProfileData({
        username: user.username || '',
        email: user.email || '',
        fullName: user.fullName || '',
        phoneNumber: user.phoneNumber || '',
        citizenId: user.citizenId || '',
        birthDate: user.birthDate ? user.birthDate.split('T')[0] : '',
        gender: user.gender !== null ? user.gender.toString() : '',
      });
    }
  };

  const getRoleChip = (role) => {
    const roleConfig = {
      'ADMIN': { label: 'Quản trị viên', color: 'error' },
      'NHÂN VIÊN': { label: 'Nhân viên', color: 'warning' },
      'KHÁCH HÀNG': { label: 'Khách hàng', color: 'info' },
    };

    const config = roleConfig[role] || { label: role, color: 'default' };
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        variant="filled"
      />
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <Box className="max-w-4xl mx-auto">
      {/* Header */}
      <Box className="mb-6">
        <Typography variant="h4" className="font-bold text-gray-800 mb-2">
          Thông tin cá nhân
        </Typography>
        <Typography variant="body2" className="text-gray-600">
          Quản lý thông tin tài khoản và cài đặt bảo mật
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Info */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box className="flex items-center justify-between mb-6">
                <Typography variant="h6" className="font-semibold">
                  Thông tin tài khoản
                </Typography>
                
                {!isEditing ? (
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={() => setIsEditing(true)}
                  >
                    Chỉnh sửa
                  </Button>
                ) : (
                  <Box className="space-x-2">
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Hủy
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSaveProfile}
                      disabled={loading}
                    >
                      Lưu
                    </Button>
                  </Box>
                )}
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Tên đăng nhập"
                    name="username"
                    value={profileData.username}
                    disabled={true} // Username cannot be changed
                    InputProps={{
                      startAdornment: <Person className="text-gray-400 mr-2" />,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing || loading}
                    InputProps={{
                      startAdornment: <Email className="text-gray-400 mr-2" />,
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Họ và tên"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleInputChange}
                    disabled={!isEditing || loading}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    name="phoneNumber"
                    value={profileData.phoneNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing || loading}
                    InputProps={{
                      startAdornment: <Phone className="text-gray-400 mr-2" />,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="CCCD/CMND"
                    name="citizenId"
                    value={profileData.citizenId}
                    onChange={handleInputChange}
                    disabled={!isEditing || loading}
                    InputProps={{
                      startAdornment: <CreditCard className="text-gray-400 mr-2" />,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Ngày sinh"
                    name="birthDate"
                    type="date"
                    value={profileData.birthDate}
                    onChange={handleInputChange}
                    disabled={!isEditing || loading}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      startAdornment: <Cake className="text-gray-400 mr-2" />,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth disabled={!isEditing || loading}>
                    <InputLabel>Giới tính</InputLabel>
                    <Select
                      name="gender"
                      value={profileData.gender}
                      onChange={handleInputChange}
                      label="Giới tính"
                    >
                      <MenuItem value="">Không chọn</MenuItem>
                      <MenuItem value="true">Nam</MenuItem>
                      <MenuItem value="false">Nữ</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Summary */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent className="text-center">
              <Avatar 
                sx={{ width: 80, height: 80, bgcolor: 'primary.main', margin: '0 auto', mb: 2 }}
              >
                <Typography variant="h4">
                  {user?.fullName ? user.fullName.charAt(0) : user?.username?.charAt(0)}
                </Typography>
              </Avatar>
              
              <Typography variant="h6" className="font-semibold mb-1">
                {user?.fullName || user?.username}
              </Typography>
              
              <Typography variant="body2" className="text-gray-600 mb-3">
                {user?.email}
              </Typography>
              
              {getRoleChip(user?.role)}
              
              <Divider className="my-4" />
              
              <Box className="text-left space-y-2">
                <Box className="flex justify-between">
                  <Typography variant="body2" className="text-gray-600">
                    Ngày tham gia:
                  </Typography>
                  <Typography variant="body2" className="font-medium">
                    {formatDate(user?.createdDate)}
                  </Typography>
                </Box>
                
                <Box className="flex justify-between">
                  <Typography variant="body2" className="text-gray-600">
                    Trạng thái:
                  </Typography>
                  <Chip 
                    label={user?.status ? 'Hoạt động' : 'Bị khóa'}
                    color={user?.status ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
              </Box>
              
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setPasswordDialogOpen(true)}
                className="mt-4"
              >
                Đổi mật khẩu
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Password Change Dialog */}
      <Dialog 
        open={passwordDialogOpen} 
        onClose={() => setPasswordDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Đổi mật khẩu</DialogTitle>
        
        <DialogContent>
          <Box className="space-y-4 mt-4">
            <TextField
              fullWidth
              label="Mật khẩu hiện tại *"
              name="currentPassword"
              type={showPasswords.current ? 'text' : 'password'}
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              error={!!passwordErrors.currentPassword}
              helperText={passwordErrors.currentPassword}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                      edge="end"
                    >
                      {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Mật khẩu mới *"
              name="newPassword"
              type={showPasswords.new ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              error={!!passwordErrors.newPassword}
              helperText={passwordErrors.newPassword || 'Ít nhất 6 ký tự'}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      edge="end"
                    >
                      {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Xác nhận mật khẩu mới *"
              name="confirmPassword"
              type={showPasswords.confirm ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              error={!!passwordErrors.confirmPassword}
              helperText={passwordErrors.confirmPassword}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      edge="end"
                    >
                      {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button 
            onClick={() => setPasswordDialogOpen(false)} 
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            onClick={handleChangePassword}
            variant="contained"
            disabled={loading}
          >
            Đổi mật khẩu
          </Button>
        </DialogActions>
      </Dialog>

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
  );
};

export default UserProfile;