import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  TextField,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingCart,
  Warning,
} from '@mui/icons-material';

const CartItem = ({ 
  item, 
  onUpdateQuantity, 
  onRemove,
  loading = false 
}) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [updating, setUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1 || newQuantity > item.availableStock) return;
    
    setUpdating(true);
    setQuantity(newQuantity);
    
    try {
      await onUpdateQuantity(item.id, newQuantity);
    } catch (error) {
      setQuantity(item.quantity); // Revert on error
    } finally {
      setUpdating(false);
    }
  };

  const handleDirectQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity) && newQuantity >= 1 && newQuantity <= item.availableStock) {
      handleQuantityChange(newQuantity);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getEffectivePrice = () => {
    return item.salePriceAtTime && item.salePriceAtTime > 0 
      ? item.salePriceAtTime 
      : item.priceAtTime;
  };

  const isOutOfStock = !item.isInStock();

  return (
    <Card className={`mb-4 ${isOutOfStock ? 'opacity-60' : ''}`}>
      <CardContent>
        <Box className="flex items-start space-x-4">
          {/* Product Image */}
          <Avatar
            src={item.productImage}
            alt={item.productName}
            variant="rounded"
            sx={{ width: 80, height: 80 }}
          >
            <ShoppingCart />
          </Avatar>

          {/* Product Info */}
          <Box className="flex-1">
            <Typography variant="h6" className="font-semibold mb-1">
              {item.productName}
            </Typography>
            
            {item.sku && (
              <Typography variant="caption" className="text-gray-500 block mb-1">
                SKU: {item.sku}
              </Typography>
            )}

            {/* Price */}
            <Box className="flex items-center space-x-2 mb-2">
              {item.salePriceAtTime && item.salePriceAtTime < item.priceAtTime ? (
                <>
                  <Typography variant="body1" className="font-bold text-red-600">
                    {formatPrice(item.salePriceAtTime)}
                  </Typography>
                  <Typography variant="body2" className="text-gray-500 line-through">
                    {formatPrice(item.priceAtTime)}
                  </Typography>
                </>
              ) : (
                <Typography variant="body1" className="font-bold">
                  {formatPrice(item.priceAtTime)}
                </Typography>
              )}
            </Box>

            {/* Stock Status */}
            {isOutOfStock && (
              <Box className="flex items-center space-x-1 mb-2">
                <Warning className="w-4 h-4 text-orange-500" />
                <Typography variant="caption" className="text-orange-600">
                  Sản phẩm tạm hết hàng
                </Typography>
              </Box>
            )}

            {/* Quantity Controls */}
            <Box className="flex items-center space-x-2 mb-2">
              <IconButton
                size="small"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1 || updating || loading || isOutOfStock}
                className="border"
              >
                <Remove />
              </IconButton>

              <TextField
                size="small"
                value={quantity}
                onChange={handleDirectQuantityChange}
                disabled={updating || loading || isOutOfStock}
                inputProps={{
                  style: { textAlign: 'center', width: '60px' },
                  min: 1,
                  max: item.availableStock,
                }}
                type="number"
              />

              <IconButton
                size="small"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= item.availableStock || updating || loading || isOutOfStock}
                className="border"
              >
                <Add />
              </IconButton>

              <Typography variant="caption" className="text-gray-500">
                / {item.availableStock} có sẵn
              </Typography>
            </Box>

            {/* Subtotal */}
            <Typography variant="h6" className="font-bold text-primary-600">
              Tổng: {formatPrice(item.subtotal)}
            </Typography>
          </Box>

          {/* Actions */}
          <Box className="flex flex-col items-end space-y-2">
            <IconButton
              color="error"
              onClick={() => onRemove(item.id)}
              disabled={loading}
              title="Xóa khỏi giỏ hàng"
            >
              <Delete />
            </IconButton>

            <Typography variant="caption" className="text-gray-500 text-right">
              Thêm lúc: {new Date(item.addedAt).toLocaleDateString('vi-VN')}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CartItem;