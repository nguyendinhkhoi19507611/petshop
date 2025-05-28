import React from 'react';
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
} from '@mui/material';
import { MoreVert, Edit, Delete, Visibility, Inventory } from '@mui/icons-material';

const CategoryCard = ({ 
  category, 
  onEdit, 
  onDelete, 
  onView, 
  onToggleStatus,
  canEdit = false 
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

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

  return (
    <Card className="h-full">
      <CardContent>
        <Box className="flex items-start justify-between mb-3">
          <Typography variant="h6" className="font-semibold truncate">
            {category.categoryName}
          </Typography>
          
          <IconButton size="small" onClick={handleMenuClick}>
            <MoreVert />
          </IconButton>
        </Box>

        <Typography 
          variant="body2" 
          className="text-gray-600 mb-3 h-12 overflow-hidden"
          title={category.description}
        >
          {category.description || 'Không có mô tả'}
        </Typography>

        <Box className="flex items-center justify-between mb-3">
          {getStatusChip(category.status)}
          
          <Box className="flex items-center text-gray-500">
            <Inventory className="w-4 h-4 mr-1" />
            <Typography variant="caption">
              {category.productCount || 0} sản phẩm
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions>
        <Button size="small" onClick={() => onView(category)}>
          Xem chi tiết
        </Button>
        
        {canEdit && (
          <Button size="small" onClick={() => onEdit(category)}>
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
        <MenuItem onClick={() => { onView(category); handleMenuClose(); }}>
          <Visibility className="mr-2" fontSize="small" />
          Xem chi tiết
        </MenuItem>
        
        {canEdit && (
          <>
            <MenuItem onClick={() => { onEdit(category); handleMenuClose(); }}>
              <Edit className="mr-2" fontSize="small" />
              Chỉnh sửa
            </MenuItem>
            
            <MenuItem onClick={() => { onToggleStatus(category); handleMenuClose(); }}>
              <Visibility className="mr-2" fontSize="small" />
              {category.status ? 'Vô hiệu hóa' : 'Kích hoạt'}
            </MenuItem>
            
            <MenuItem 
              onClick={() => { onDelete(category); handleMenuClose(); }}
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

export default CategoryCard;