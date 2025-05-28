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
  Badge,
} from '@mui/material';
import { 
  MoreVert, 
  Edit, 
  Delete, 
  Visibility, 
  Package, 
  VisibilityOff,
  DragIndicator 
} from '@mui/icons-material';
import { Ruler } from 'lucide-react';

const SizeCard = ({ 
  size, 
  onEdit, 
  onDelete, 
  onView, 
  onToggleStatus,
  canEdit = false,
  isDragging = false 
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

  const getUnitLabel = (unit) => {
    const unitLabels = {
      weight: 'Trọng lượng',
      volume: 'Thể tích',
      size: 'Kích cỡ',
      length: 'Chiều dài',
      other: 'Khác'
    };
    return unitLabels[unit] || unit || 'Không xác định';
  };

  const formatSizeDisplay = () => {
    if (size.value && size.unit) {
      const unitSuffix = {
        weight: 'g',
        volume: 'ml',
        length: 'cm'
      };
      return `${size.value}${unitSuffix[size.unit] || ''}`;
    }
    return size.value || '-';
  };

  return (
    <Card 
      className={`h-full hover:shadow-lg transition-shadow ${isDragging ? 'opacity-50' : ''}`}
      sx={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <CardContent>
        <Box className="flex items-start justify-between mb-3">
          <Box className="flex items-center space-x-2">
            <Badge 
              badgeContent={size.displayOrder} 
              color="primary" 
              variant="standard"
              invisible={!size.displayOrder}
            >
              <Ruler className="w-8 h-8 text-primary-600" />
            </Badge>
            <Box>
              <Typography variant="h6" className="font-semibold">
                {size.sizeName}
              </Typography>
              <Typography variant="caption" className="text-gray-500">
                {getUnitLabel(size.unit)}
              </Typography>
            </Box>
          </Box>
          
          <Box className="flex items-center space-x-1">
            {canEdit && (
              <IconButton size="small" className="drag-handle">
                <DragIndicator className="text-gray-400" />
              </IconButton>
            )}
            <IconButton size="small" onClick={handleMenuClick}>
              <MoreVert />
            </IconButton>
          </Box>
        </Box>

        <Box className="mb-3">
          <Typography variant="body1" className="font-medium text-primary-700 mb-1">
            {formatSizeDisplay()}
          </Typography>
          <Typography 
            variant="body2" 
            className="text-gray-600 h-10 overflow-hidden"
            title={size.description}
          >
            {size.description || 'Không có mô tả'}
          </Typography>
        </Box>

        <Box className="flex items-center justify-between">
          {getStatusChip(size.status)}
          
          <Box className="flex items-center text-gray-500">
            <Package className="w-4 h-4 mr-1" />
            <Typography variant="caption">
              {size.productCount || 0} sản phẩm
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions className="pt-0">
        <Button size="small" onClick={() => onView(size)} fullWidth>
          Xem chi tiết
        </Button>
        
        {canEdit && (
          <Button size="small" onClick={() => onEdit(size)} color="primary">
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
        <MenuItem onClick={() => { onView(size); handleMenuClose(); }}>
          <Visibility className="mr-2" fontSize="small" />
          Xem chi tiết
        </MenuItem>
        
        {canEdit && (
          <>
            <MenuItem onClick={() => { onEdit(size); handleMenuClose(); }}>
              <Edit className="mr-2" fontSize="small" />
              Chỉnh sửa
            </MenuItem>
            
            <MenuItem onClick={() => { onToggleStatus(size); handleMenuClose(); }}>
              {size.status ? (
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
              onClick={() => { onDelete(size); handleMenuClose(); }}
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

export default SizeCard;