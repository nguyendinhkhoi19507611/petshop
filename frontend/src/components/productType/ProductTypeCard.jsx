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
  Avatar,
} from '@mui/material';
import { 
  MoreVert, 
  Edit, 
  Delete, 
  Visibility, 
  Inventory, 
  VisibilityOff,
  Category as CategoryIcon 
} from '@mui/icons-material';

const ProductTypeCard = ({ 
  productType, 
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

  const getTypeIcon = () => {
    return (
      <Avatar sx={{ width: 48, height: 48, bgcolor: 'secondary.main' }}>
        <CategoryIcon />
      </Avatar>
    );
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardContent>
        <Box className="flex items-start justify-between mb-3">
          <Box className="flex items-center space-x-3">
            {getTypeIcon()}
            <Box>
              <Typography variant="h6" className="font-semibold truncate">
                {productType.productTypeName}
              </Typography>
              <Typography variant="caption" className="text-gray-500">
                {productType.categoryName}
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
          title={productType.description}
        >
          {productType.description || 'Không có mô tả'}
        </Typography>

        <Box className="flex items-center justify-between mb-3">
          {getStatusChip(productType.status)}
          
          <Box className="flex items-center text-gray-500">
            <Inventory className="w-4 h-4 mr-1" />
            <Typography variant="caption">
              {productType.productCount || 0} sản phẩm
            </Typography>
          </Box>
        </Box>

        {productType.type && (
          <Box className="mt-2">
            <Chip 
              label={`Type: ${productType.type}`} 
              size="small" 
              variant="outlined"
              color="primary"
            />
          </Box>
        )}
      </CardContent>

      <CardActions className="pt-0">
        <Button size="small" onClick={() => onView(productType)} fullWidth>
          Xem chi tiết
        </Button>
        
        {canEdit && (
          <Button size="small" onClick={() => onEdit(productType)} color="primary">
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
        <MenuItem onClick={() => { onView(productType); handleMenuClose(); }}>
          <Visibility className="mr-2" fontSize="small" />
          Xem chi tiết
        </MenuItem>
        
        {canEdit && (
          <>
            <MenuItem onClick={() => { onEdit(productType); handleMenuClose(); }}>
              <Edit className="mr-2" fontSize="small" />
              Chỉnh sửa
            </MenuItem>
            
            <MenuItem onClick={() => { onToggleStatus(productType); handleMenuClose(); }}>
              {productType.status ? (
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
              onClick={() => { onDelete(productType); handleMenuClose(); }}
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

export default ProductTypeCard;