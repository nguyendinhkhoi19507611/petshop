import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  Divider,
} from '@mui/material';
import {
  Logout,
  Settings,
  Person,
} from '@mui/icons-material';
import { Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const { user, logout } = useAuth();

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    handleProfileMenuClose();
  };

  if (!user) {
    return null;
  }

  return (
    <Box className="flex items-center justify-between w-full">
      {/* Left side - Title */}
      <Box>
        <Typography variant="h6" className="font-semibold text-gray-800">
          Pet Shop Management
        </Typography>
        <Typography variant="caption" className="text-gray-500">
          Chào mừng trở lại, {user.fullName || user.username}
        </Typography>
      </Box>

      {/* Right side - Actions */}
      <Box className="flex items-center space-x-2">
        {/* Notifications */}
        <IconButton
          onClick={handleNotificationOpen}
          className="text-gray-600 hover:text-primary-600"
        >
          <Badge badgeContent={3} color="error">
            <Bell className="w-5 h-5" />
          </Badge>
        </IconButton>

        {/* Profile Menu */}
        <Box className="flex items-center">
          <IconButton
            onClick={handleProfileMenuOpen}
            className="p-1"
          >
            <Avatar
              sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
            >
              {user.fullName ? user.fullName.charAt(0) : user.username.charAt(0)}
            </Avatar>
          </IconButton>
          
          <Box className="ml-2 hidden sm:block">
            <Typography variant="body2" className="font-medium text-gray-800">
              {user.fullName || user.username}
            </Typography>
            <Typography variant="caption" className="text-gray-500">
              {user.role?.replace('ROLE_', '') || 'User'}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { width: 250, mt: 1 }
        }}
      >
        <Box className="px-4 py-3">
          <Typography variant="body2" className="font-medium">
            {user.fullName || user.username}
          </Typography>
          <Typography variant="caption" className="text-gray-500">
            {user.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleProfileMenuClose}>
          <Person className="w-4 h-4 mr-3" />
          Thông tin cá nhân
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose}>
          <Settings className="w-4 h-4 mr-3" />
          Cài đặt
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} className="text-red-600">
          <Logout className="w-4 h-4 mr-3" />
          Đăng xuất
        </MenuItem>
      </Menu>

      {/* Notification Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { width: 320, mt: 1, maxHeight: 400 }
        }}
      >
        <Box className="px-4 py-3 border-b">
          <Typography variant="h6" className="font-semibold">
            Thông báo
          </Typography>
        </Box>
        <Box className="max-h-80 overflow-y-auto">
          {/* Mock notifications */}
          <MenuItem className="px-4 py-3 border-b">
            <Box>
              <Typography variant="body2" className="font-medium">
                Đơn hàng mới #12345
              </Typography>
              <Typography variant="caption" className="text-gray-500">
                Khách hàng vừa đặt đơn hàng mới
              </Typography>
              <Typography variant="caption" className="text-blue-600 block">
                2 phút trước
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem className="px-4 py-3 border-b">
            <Box>
              <Typography variant="body2" className="font-medium">
                Sản phẩm sắp hết hàng
              </Typography>
              <Typography variant="caption" className="text-gray-500">
                Thức ăn cho chó Royal Canin còn 5 sản phẩm
              </Typography>
              <Typography variant="caption" className="text-blue-600 block">
                1 giờ trước
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem className="px-4 py-3">
            <Box>
              <Typography variant="body2" className="font-medium">
                Tin nhắn mới từ khách hàng
              </Typography>
              <Typography variant="caption" className="text-gray-500">
                Nguyễn Văn An đã gửi tin nhắn hỗ trợ
              </Typography>
              <Typography variant="caption" className="text-blue-600 block">
                3 giờ trước
              </Typography>
            </Box>
          </MenuItem>
        </Box>
      </Menu>
    </Box>
  );
};

export default Header;