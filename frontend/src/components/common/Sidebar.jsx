import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Package,
  Folder,
  Users,
  ShoppingCart,
  Gift,
  BarChart3,
  MessageCircle,
  List as ListIcon,
  Tag,
  Ruler,
  Layers,
  MapPin,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Icon mapping
const iconMap = {
  Home,
  Package,
  Folder,
  Users,
  ShoppingCart,
  Gift,
  BarChart3,
  MessageCircle,
  List: ListIcon,
  Tag,
  Ruler,
  Layers,
  MapPin,
};

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, isEmployee, isCustomer } = useAuth();
  
  // Get navigation items based on user role
  const getNavigationItems = () => {
    if (isAdmin()) {
      return [
        { title: 'Dashboard', path: '/dashboard', icon: 'Home' },
        { 
          title: 'Quản lý sản phẩm', 
          icon: 'Package',
          children: [
            { title: 'Danh mục', path: '/admin/categories', icon: 'Folder' },
            { title: 'Thương hiệu', path: '/admin/brands', icon: 'Tag' },
            { title: 'Kích cỡ', path: '/admin/sizes', icon: 'Ruler' },
            { title: 'Loại sản phẩm', path: '/admin/product-types', icon: 'Layers' },
            { title: 'Sản phẩm', path: '/admin/products', icon: 'Package' },
          ]
        },
        { title: 'Quản lý người dùng', path: '/admin/users', icon: 'Users' },
        { title: 'Quản lý đơn hàng', path: '/admin/orders', icon: 'ShoppingCart' },
        { title: 'Khuyến mãi', path: '/admin/promotions', icon: 'Gift' },
        { title: 'Báo cáo', path: '/admin/reports', icon: 'BarChart3' },
      ];
    } else if (isEmployee()) {
      return [
        { title: 'Dashboard', path: '/dashboard', icon: 'Home' },
        { 
          title: 'Sản phẩm', 
          icon: 'Package',
          children: [
            { title: 'Danh mục', path: '/employee/categories', icon: 'Folder' },
            { title: 'Thương hiệu', path: '/employee/brands', icon: 'Tag' },
            { title: 'Kích cỡ', path: '/employee/sizes', icon: 'Ruler' },
            { title: 'Sản phẩm', path: '/employee/products', icon: 'Package' },
          ]
        },
        { title: 'Đơn hàng', path: '/employee/orders', icon: 'ShoppingCart' },
        { title: 'Hỗ trợ khách hàng', path: '/employee/support', icon: 'MessageCircle' },
      ];
    } else if (isCustomer()) {
      return [
        { title: 'Trang chủ', path: '/dashboard', icon: 'Home' },
        { title: 'Sản phẩm', path: '/products', icon: 'Package' },
        { title: 'Giỏ hàng', path: '/cart', icon: 'ShoppingCart' },
        { title: 'Đơn hàng của tôi', path: '/my-orders', icon: 'List' },
        { title: 'Địa chỉ', path: '/addresses', icon: 'MapPin' },
        { title: 'Hỗ trợ', path: '/support', icon: 'MessageCircle' },
      ];
    } else {
      return [
        { title: 'Dashboard', path: '/dashboard', icon: 'Home' },
      ];
    }
  };

  const navigationItems = getNavigationItems();

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) {
      onClose();
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isChildActive = (children) => {
    return children?.some(child => location.pathname === child.path);
  };

  const renderNavigationItem = (item, index) => {
    const IconComponent = iconMap[item.icon];
    const active = isActive(item.path);
    const hasActiveChild = isChildActive(item.children);
    
    if (item.children) {
      // Parent item with children
      return (
        <Box key={index}>
          <ListItem disablePadding className="mb-1">
            <ListItemButton
              className={`rounded-lg transition-all duration-200 ${
                hasActiveChild
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <ListItemIcon className="min-w-0 mr-3">
                {IconComponent && (
                  <IconComponent
                    className={`w-5 h-5 ${
                      hasActiveChild ? 'text-primary-600' : 'text-gray-400'
                    }`}
                  />
                )}
              </ListItemIcon>
              <ListItemText
                primary={item.title}
                primaryTypographyProps={{
                  variant: 'body2',
                  className: hasActiveChild ? 'font-semibold' : 'font-medium',
                }}
              />
            </ListItemButton>
          </ListItem>
          
          {/* Children items */}
          <Box className="ml-4 mb-2">
            {item.children.map((child, childIndex) => {
              const ChildIconComponent = iconMap[child.icon];
              const childActive = isActive(child.path);
              
              return (
                <ListItem key={childIndex} disablePadding className="mb-1">
                  <ListItemButton
                    onClick={() => handleNavigation(child.path)}
                    className={`rounded-lg transition-all duration-200 ${
                      childActive
                        ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    selected={childActive}
                  >
                    <ListItemIcon className="min-w-0 mr-3">
                      {ChildIconComponent && (
                        <ChildIconComponent
                          className={`w-4 h-4 ${
                            childActive ? 'text-primary-600' : 'text-gray-400'
                          }`}
                        />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={child.title}
                      primaryTypographyProps={{
                        variant: 'body2',
                        className: childActive ? 'font-semibold' : 'font-medium',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </Box>
        </Box>
      );
    } else {
      // Single item
      return (
        <ListItem key={index} disablePadding className="mb-1">
          <ListItemButton
            onClick={() => handleNavigation(item.path)}
            className={`rounded-lg transition-all duration-200 ${
              active
                ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
            selected={active}
          >
            <ListItemIcon className="min-w-0 mr-3">
              {IconComponent && (
                <IconComponent
                  className={`w-5 h-5 ${
                    active ? 'text-primary-600' : 'text-gray-400'
                  }`}
                />
              )}
            </ListItemIcon>
            <ListItemText
              primary={item.title}
              primaryTypographyProps={{
                variant: 'body2',
                className: active ? 'font-semibold' : 'font-medium',
              }}
            />
          </ListItemButton>
        </ListItem>
      );
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Box className="h-full bg-white">
      {/* Logo */}
      <Box className="p-6 border-b">
        <Box className="flex items-center space-x-3">
          <Box className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </Box>
          <Box>
            <Typography variant="h6" className="font-bold text-gray-800">
              Pet Shop
            </Typography>
            <Typography variant="caption" className="text-gray-500">
              Management System
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation */}
      <Box className="flex-1 overflow-y-auto">
        <List className="px-3 py-4">
          {navigationItems.map((item, index) => renderNavigationItem(item, index))}
        </List>

        <Divider className="mx-3" />

        {/* User Info */}
        <Box className="p-4 mt-4">
          <Box className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg p-4 text-white">
            <Typography variant="body2" className="font-semibold mb-1">
              {user.fullName || user.username}
            </Typography>
            <Typography variant="caption" className="opacity-90 mb-3 block">
              {user.role?.replace('ROLE_', '') || 'User'}
            </Typography>
            <Box 
              className="bg-white bg-opacity-20 rounded px-3 py-1 text-center cursor-pointer hover:bg-opacity-30 transition-all"
              onClick={() => handleNavigation('/profile')}
            >
              <Typography variant="caption" className="font-medium">
                Xem hồ sơ
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;