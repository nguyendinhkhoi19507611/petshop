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
  Divider,
} from '@mui/material';
import { 
  MoreVert, 
  Edit, 
  Delete, 
  Visibility, 
  Person,
  Phone,
  Home,
  Star,
  StarBorder,
} from '@mui/icons-material';

const AddressCard = ({ 
  address, 
  onEdit, 
  onDelete, 
  onView, 
  onSetDefault,
  canEdit = true 
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card className={`h-full hover:shadow-lg transition-shadow ${address.isDefault ? 'ring-2 ring-primary-500' : ''}`}>
      <CardContent>
        <Box className="flex items-start justify-between mb-3">
          <Box className="flex items-center space-x-2">
            {address.isDefault ? (
              <Star className="text-yellow-500" fontSize="small" />
            ) : (
              <StarBorder className="text-gray-400" fontSize="small" />
            )}
            <Typography variant="h6" className="font-semibold">
              {address.isDefault ? 'Địa chỉ mặc định' : 'Địa chỉ phụ'}
            </Typography>
          </Box>
          
          <IconButton size="small" onClick={handleMenuClick}>
            <MoreVert />
          </IconButton>
        </Box>

        {/* Receiver Info */}
        <Box className="mb-3">
          <Box className="flex items-center space-x-2 mb-2">
            <Person className="w-4 h-4 text-gray-400" />
            <Typography variant="body2" className="font-medium">
              {address.receiverName}
            </Typography>
          </Box>
          <Box className="flex items-center space-x-2 mb-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <Typography variant="body2" className="text-gray-600">
              {address.receiverPhone}
            </Typography>
          </Box>
        </Box>

        <Divider className="my-2" />

        {/* Address Info */}
        <Box className="mb-3">
          <Box className="flex items-start space-x-2">
            <Home className="w-4 h-4 text-gray-400 mt-1" />
            <Box className="flex-1">
              <Typography variant="body2" className="text-gray-800 leading-relaxed">
                {address.fullAddress || 
                 `${address.streetAddress}, ${address.wardName}, ${address.districtName}, ${address.provinceName}`}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Note */}
        {address.note && (
          <Box className="mb-2">
            <Typography variant="caption" className="text-gray-500 block">
              Ghi chú: {address.note}
            </Typography>
          </Box>
        )}

        {/* Status */}
        <Box className="flex items-center justify-between">
          {address.isDefault && (
            <Chip
              label="Mặc định"
              color="primary"
              size="small"
              variant="filled"
            />
          )}
        </Box>
      </CardContent>

      <CardActions className="pt-0">
        <Button size="small" onClick={() => onView(address)} fullWidth>
          Xem chi tiết
        </Button>
        
        {canEdit && (
          <Button size="small" onClick={() => onEdit(address)} color="primary">
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
        <MenuItem onClick={() => { onView(address); handleMenuClose(); }}>
          <Visibility className="mr-2" fontSize="small" />
          Xem chi tiết
        </MenuItem>
        
        {canEdit && (
          <>
            <MenuItem onClick={() => { onEdit(address); handleMenuClose(); }}>
              <Edit className="mr-2" fontSize="small" />
              Chỉnh sửa
            </MenuItem>
            
            {!address.isDefault && (
              <MenuItem onClick={() => { onSetDefault(address); handleMenuClose(); }}>
                <Star className="mr-2" fontSize="small" />
                Đặt làm mặc định
              </MenuItem>
            )}
            
            <MenuItem 
              onClick={() => { onDelete(address); handleMenuClose(); }}
              className="text-red-600"
            >
              <Delete className="mr-2" fontSize="small" />
              Xóa địa chỉ
            </MenuItem>
          </>
        )}
      </Menu>
    </Card>
  );
};

export default AddressCard;