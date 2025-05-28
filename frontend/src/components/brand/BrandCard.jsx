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
  Tooltip,
} from '@mui/material';
import { 
  MoreVert, 
  Edit, 
  Delete, 
  Visibility, 
  Inventory, 
  Link as LinkIcon,
  VisibilityOff 
} from '@mui/icons-material';

const BrandCard = ({ 
  brand, 
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

  const getBrandLogo = () => {
    if (brand.logoUrl) {
      return (
        <Avatar
          src={brand.logoUrl}
          alt={brand.brandName}
          sx={{ width: 48, height: 48 }}
        >
          {brand.brandName.charAt(0)}
        </Avatar>
      );
    } else {
      return (
        <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}>
          {brand.brandName.charAt(0)}
        </Avatar>
      );
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardContent>
        <Box className="flex items-start justify-between mb-3">
          <Box className="flex items-center space-x-3">
            {getBrandLogo()}
            <Box>
              <Typography variant="h6" className="font-semibold truncate">
                {brand.brandName}
              </Typography>
              {brand.website && (
                <Tooltip title="Mở website">
                  <IconButton
                    size="small"
                    onClick={() => window.open(brand.website, '_blank')}
                    className="text-blue-600 p-1"
                  >
                    <LinkIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
          
          <IconButton size="small" onClick={handleMenuClick}>
            <MoreVert />
          </IconButton>
        </Box>

        <Typography 
          variant="body2" 
          className="text-gray-600 mb-3 h-12 overflow-hidden"
          title={brand.description}
        >
          {brand.description || 'Không có mô tả'}
        </Typography>

        <Box className="flex items-center justify-between mb-3">
          {getStatusChip(brand.status)}
          
          <Box className="flex items-center text-gray-500">
            <Inventory className="w-4 h-4 mr-1" />
            <Typography variant="caption">
              {brand.productCount || 0} sản phẩm
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions className="pt-0">
        <Button size="small" onClick={() => onView(brand)} fullWidth>
          Xem chi tiết
        </Button>
        
        {canEdit && (
          <Button size="small" onClick={() => onEdit(brand)} color="primary">
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
        <MenuItem onClick={() => { onView(brand); handleMenuClose(); }}>
          <Visibility className="mr-2" fontSize="small" />
          Xem chi tiết
        </MenuItem>
        
        {canEdit && (
          <>
            <MenuItem onClick={() => { onEdit(brand); handleMenuClose(); }}>
              <Edit className="mr-2" fontSize="small" />
              Chỉnh sửa
            </MenuItem>
            
            <MenuItem onClick={() => { onToggleStatus(brand); handleMenuClose(); }}>
              {brand.status ? (
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
              onClick={() => { onDelete(brand); handleMenuClose(); }}
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

export default BrandCard;