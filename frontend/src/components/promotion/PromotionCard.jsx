import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Box,
  LinearProgress,
} from '@mui/material';
import { 
  MoreVert, 
  Edit, 
  Delete, 
  Visibility, 
  VisibilityOff,
  LocalOffer,
  CalendarToday,
  People,
  AttachMoney,
} from '@mui/icons-material';

const PromotionCard = ({ 
  promotion, 
  onEdit, 
  onDelete, 
  onView, 
  onToggleStatus,
  canEdit = false 
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getStatusChip = (status) => {
    return (
      <Chip
        label={status ? 'Hoạt động' : 'Không hoạt động'}
        color={status ? 'success' : 'default'}
        size="small"
        variant="outlined"
      />
    );
  };

  const getDiscountDisplay = () => {
    if (promotion.discountType === 'PERCENTAGE') {
      return `${promotion.discountValue}%`;
    } else {
      return `${promotion.discountValue.toLocaleString('vi-VN')}đ`;
    }
  };

  const getUsageProgress = () => {
    if (!promotion.maxUsageCount) return 100;
    return (promotion.usedCount / promotion.maxUsageCount) * 100;
  };

  const isActive = () => {
    const now = new Date();
    const startDate = new Date(promotion.startDate);
    const endDate = new Date(promotion.endDate);
    return promotion.status && now >= startDate && now <= endDate;
  };

  const isExpired = () => {
    const now = new Date();
    const endDate = new Date(promotion.endDate);
    return now > endDate;
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardContent>
        <Box className="flex items-start justify-between mb-3">
          <Box className="flex items-center space-x-2">
            <LocalOffer className="text-orange-500" />
            <Box>
              <Typography variant="h6" className="font-semibold truncate">
                {promotion.promotionName}
              </Typography>
              <Typography variant="body2" className="text-primary-600 font-medium">
                {promotion.couponCode}
              </Typography>
            </Box>
          </Box>
          
          <IconButton size="small" onClick={handleMenuClick}>
            <MoreVert />
          </IconButton>
        </Box>

        <Typography 
          variant="body2" 
          className="text-gray-600 mb-3 h-12 overflow-hidden"
          title={promotion.description}
        >
          {promotion.description || 'Không có mô tả'}
        </Typography>

        {/* Discount Info */}
        <Box className="mb-3 p-2 bg-orange-50 rounded-lg">
          <Box className="flex items-center justify-between mb-1">
            <Typography variant="body2" className="font-medium text-orange-700">
              Giảm giá
            </Typography>
            <Typography variant="h6" className="font-bold text-orange-600">
              {getDiscountDisplay()}
            </Typography>
          </Box>
          {promotion.minOrderAmount > 0 && (
            <Typography variant="caption" className="text-orange-600">
              Đơn tối thiểu: {promotion.minOrderAmount.toLocaleString('vi-VN')}đ
            </Typography>
          )}
        </Box>

        {/* Usage Stats */}
        {promotion.maxUsageCount && (
          <Box className="mb-3">
            <Box className="flex justify-between items-center mb-1">
              <Typography variant="caption" className="text-gray-600">
                Đã sử dụng
              </Typography>
              <Typography variant="caption" className="text-gray-600">
                {promotion.usedCount}/{promotion.maxUsageCount}
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={getUsageProgress()} 
              className="h-2 rounded"
              color={getUsageProgress() > 80 ? 'warning' : 'primary'}
            />
          </Box>
        )}

        {/* Dates */}
        <Box className="mb-3">
          <Box className="flex items-center text-gray-500 mb-1">
            <CalendarToday className="w-4 h-4 mr-1" />
            <Typography variant="caption">
              {new Date(promotion.startDate).toLocaleDateString('vi-VN')} - {new Date(promotion.endDate).toLocaleDateString('vi-VN')}
            </Typography>
          </Box>
        </Box>

        {/* Status */}
        <Box className="flex items-center justify-between">
          <Box className="flex space-x-1">
            {getStatusChip(promotion.status)}
            {isActive() && (
              <Chip
                label="Đang áp dụng"
                color="success"
                size="small"
                variant="filled"
              />
            )}
            {isExpired() && (
              <Chip
                label="Hết hạn"
                color="error"
                size="small"
                variant="outlined"
              />
            )}
          </Box>
        </Box>
      </CardContent>

      <CardActions className="pt-0">
        <Button size="small" onClick={() => onView(promotion)} fullWidth>
          Xem chi tiết
        </Button>
        
        {canEdit && (
          <Button size="small" onClick={() => onEdit(promotion)} color="primary">
            Chỉnh sửa
          </Button>
        )}
      </CardActions>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { onView(promotion); handleMenuClose(); }}>
          <Visibility className="mr-2" fontSize="small" />
          Xem chi tiết
        </MenuItem>
        
        {canEdit && (
          <>
            <MenuItem onClick={() => { onEdit(promotion); handleMenuClose(); }}>
              <Edit className="mr-2" fontSize="small" />
              Chỉnh sửa
            </MenuItem>
            
            <MenuItem onClick={() => { onToggleStatus(promotion); handleMenuClose(); }}>
              {promotion.status ? (
                <>
                  <VisibilityOff className="mr-2" fontSize="small" />
                  Vô hiệu hóa
                </>
              ) : (
                <>
                  <Visibility className="mr-2" fontSize="small" />
                  Kích hoạt
                </>
              )}
            </MenuItem>
            
            <MenuItem 
              onClick={() => { onDelete(promotion); handleMenuClose(); }}
              className="text-red-600"
            >
              <Delete className="mr-2" fontSize="small" />
              Xóa
            </MenuItem>
          </>
        )}
      </Menu>
    </Card>
  );
};

export default PromotionCard;