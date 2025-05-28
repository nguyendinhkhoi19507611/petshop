import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Badge,
  Tooltip,
} from '@mui/material';
import { 
  MoreVert, 
  Edit, 
  Delete, 
  Visibility, 
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Star,
  Inventory,
  LocalOffer,
} from '@mui/icons-material';

const ProductCard = ({ 
  product, 
  onEdit, 
  onDelete, 
  onView, 
  onAddToCart,
  onToggleFavorite,
  canEdit = false,
  showActions = true,
  variant = 'default' // 'default', 'compact', 'detailed'
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited);
    if (onToggleFavorite) {
      onToggleFavorite(product);
    }
  };

  const getStatusChip = (status) => {
    return (
      <Chip
        label={status ? 'Có sẵn' : 'Hết hàng'}
        color={status ? 'success' : 'error'}
        size="small"
        variant="outlined"
      />
    );
  };

  const getStockStatus = () => {
    if (product.isOutOfStock) {
      return { label: 'Hết hàng', color: 'error' };
    } else if (product.isLowStock) {
      return { label: 'Sắp hết', color: 'warning' };
    } else {
      return { label: 'Còn hàng', color: 'success' };
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getPriceDisplay = () => {
    if (product.salePrice && product.salePrice < product.price) {
      return (
        <Box>
          <Typography variant="h6" className="font-bold text-red-600">
            {formatPrice(product.salePrice)}
          </Typography>
          <Typography variant="body2" className="text-gray-500 line-through">
            {formatPrice(product.price)}
          </Typography>
          {product.discountPercentage && (
            <Chip 
              label={`-${product.discountPercentage}%`} 
              color="error" 
              size="small"
              className="mt-1"
            />
          )}
        </Box>
      );
    } else {
      return (
        <Typography variant="h6" className="font-bold text-gray-800">
          {formatPrice(product.price)}
        </Typography>
      );
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 relative group">
      {/* Sale Badge */}
      {product.isOnSale && (
        <Badge
          badgeContent={<LocalOffer className="w-4 h-4" />}
          color="error"
          className="absolute top-2 left-2 z-10"
        />
      )}

      {/* Featured Badge */}
      {product.featured && (
        <Chip
          label="Nổi bật"
          color="primary"
          size="small"
          className="absolute top-2 right-2 z-10"
        />
      )}

      {/* Product Image */}
      <CardMedia
        component="img"
        height="200"
        image={product.image || '/placeholder-product.jpg'}
        alt={product.productName}
        className="cursor-pointer"
        onClick={() => onView(product)}
        sx={{ height: variant === 'compact' ? 150 : 200 }}
      />

      {/* Favorite Button */}
      {showActions && (
        <IconButton
          className="absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-opacity-100 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleToggleFavorite}
          size="small"
        >
          {isFavorited ? (
            <Favorite className="text-red-500" />
          ) : (
            <FavoriteBorder />
          )}
        </IconButton>
      )}

      <CardContent className="pb-2">
        {/* Brand & Category */}
        <Box className="flex items-center justify-between mb-2">
          {product.brandName && (
            <Typography variant="caption" className="text-blue-600 font-medium">
              {product.brandName}
            </Typography>
          )}
          {product.categoryName && (
            <Typography variant="caption" className="text-gray-500">
              {product.categoryName}
            </Typography>
          )}
        </Box>

        {/* Product Name */}
        <Typography 
          variant="h6" 
          className="font-semibold mb-2 cursor-pointer hover:text-primary-600 line-clamp-2"
          onClick={() => onView(product)}
          title={product.productName}
        >
          {product.productName}
        </Typography>

        {/* Product Type & Size */}
        <Box className="flex items-center space-x-2 mb-2">
          {product.productTypeName && (
            <Chip 
              label={product.productTypeName} 
              size="small" 
              variant="outlined"
              color="secondary"
            />
          )}
          {product.sizeName && (
            <Chip 
              label={product.sizeName} 
              size="small" 
              variant="outlined"
            />
          )}
        </Box>

        {/* Price */}
        <Box className="mb-2">
          {getPriceDisplay()}
        </Box>

        {/* Stock Info */}
        <Box className="flex items-center justify-between mb-2">
          <Box className="flex items-center space-x-1">
            <Inventory className="w-4 h-4 text-gray-400" />
            <Typography variant="caption" className="text-gray-600">
              Kho: {product.stock || 0}
            </Typography>
          </Box>
          <Chip 
            label={getStockStatus().label}
            color={getStockStatus().color}
            size="small"
            variant="outlined"
          />
        </Box>

        {/* Rating & Sold */}
        {variant === 'detailed' && (
          <Box className="flex items-center justify-between mb-2">
            <Box className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <Typography variant="caption">4.5</Typography>
            </Box>
            <Typography variant="caption" className="text-gray-600">
              Đã bán: {product.soldQuantity || 0}
            </Typography>
          </Box>
        )}

        {/* SKU */}
        {variant === 'detailed' && product.sku && (
          <Typography variant="caption" className="text-gray-500 block mb-2">
            SKU: {product.sku}
          </Typography>
        )}
      </CardContent>

      {/* Actions */}
      {showActions && (
        <CardActions className="pt-0 px-3 pb-3">
          <Box className="w-full space-y-2">
            <Button
              fullWidth
              variant="contained"
              startIcon={<ShoppingCart />}
              onClick={() => onAddToCart(product)}
              disabled={product.isOutOfStock}
            >
              {product.isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ'}
            </Button>
            
            <Box className="flex space-x-1">
              <Button
                size="small"
                variant="outlined"
                onClick={() => onView(product)}
                className="flex-1"
              >
                Xem chi tiết
              </Button>
              
              {canEdit && (
                <IconButton
                  size="small"
                  onClick={handleMenuClick}
                  className="border border-gray-300"
                >
                  <MoreVert />
                </IconButton>
              )}
            </Box>
          </Box>
        </CardActions>
      )}

      {/* Admin Menu */}
      {canEdit && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => { onView(product); handleMenuClose(); }}>
            <Visibility className="mr-2" fontSize="small" />
            Xem chi tiết
          </MenuItem>
          
          <MenuItem onClick={() => { onEdit(product); handleMenuClose(); }}>
            <Edit className="mr-2" fontSize="small" />
            Chỉnh sửa
          </MenuItem>
          
          <MenuItem 
            onClick={() => { onDelete(product); handleMenuClose(); }}
            className="text-red-600"
          >
            <Delete className="mr-2" fontSize="small" />
            Xóa
          </MenuItem>
        </Menu>
      )}
    </Card>
  );
};

export default ProductCard;
