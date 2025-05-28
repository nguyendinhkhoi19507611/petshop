import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Breadcrumbs,
  Link,
  TextField,
  Alert,
  Snackbar,
  Avatar,
  Tab,
  Tabs,
  Divider,
  Rating,
  CircularProgress,
} from '@mui/material';
import {
  Add,
  Remove,
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Share,
  ArrowBack,
  Star,
  LocalOffer,
  Inventory,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { productService } from '../services/productService';
import { cartService } from '../services/cartService';
import { ProductCard } from '../components/product';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  // State management
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Product options
  const [quantity, setQuantity] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (id) {
      loadProductDetail();
    }
  }, [id]);

  const loadProductDetail = async () => {
    try {
      setLoading(true);
      const [productResponse, relatedResponse] = await Promise.all([
        productService.getById(id),
        productService.getRelated(id, { size: 4 })
      ]);

      if (productResponse.data.success) {
        setProduct(productResponse.data.data);
      } else {
        setError('Không tìm thấy sản phẩm');
      }

      if (relatedResponse.data.success) {
        setRelatedProducts(relatedResponse.data.data);
      }
    } catch (err) {
      setError('Lỗi khi tải thông tin sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!product || product.stock < quantity) {
      setError('Không đủ số lượng trong kho');
      return;
    }

    try {
      const response = await cartService.addToCart({
        productId: product.id,
        quantity: quantity
      });

      if (response.data.success) {
        setSuccess(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
      } else {
        setError(response.data.message || 'Không thể thêm vào giỏ hàng');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi thêm vào giỏ hàng');
    }
  };

  const handleQuantityChange = (type) => {
    if (type === 'increase' && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => {
      navigate('/cart');
    }, 1000);
  };

  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited);
    // TODO: Implement favorite API
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.productName,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setSuccess('Đã sao chép link sản phẩm');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getStockStatus = () => {
    if (!product) return null;
    
    if (product.stock === 0) {
      return { label: 'Hết hàng', color: 'error', icon: <Warning /> };
    } else if (product.stock <= product.lowStockThreshold) {
      return { label: 'Sắp hết', color: 'warning', icon: <Warning /> };
    } else {
      return { label: 'Còn hàng', color: 'success', icon: <CheckCircle /> };
    }
  };

  const renderTabContent = () => {
    switch (tabValue) {
      case 0:
        return (
          <Box className="py-4">
            <Typography variant="body1" className="whitespace-pre-line">
              {product?.description || 'Không có mô tả sản phẩm.'}
            </Typography>
            
            {product?.specifications && (
              <Box className="mt-6">
                <Typography variant="h6" className="font-semibold mb-3">
                  Thông số kỹ thuật
                </Typography>
                <Box className="space-y-2">
                  {product.weight && (
                    <Box className="flex justify-between">
                      <Typography>Trọng lượng:</Typography>
                      <Typography className="font-medium">{product.weight}g</Typography>
                    </Box>
                  )}
                  {product.dimensions && (
                    <Box className="flex justify-between">
                      <Typography>Kích thước:</Typography>
                      <Typography className="font-medium">{product.dimensions}</Typography>
                    </Box>
                  )}
                  {product.sizeName && (
                    <Box className="flex justify-between">
                      <Typography>Kích cỡ:</Typography>
                      <Typography className="font-medium">{product.sizeName}</Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        );
      
      case 1:
        return (
          <Box className="py-4">
            <Typography variant="h6" className="font-semibold mb-4">
              Đánh giá sản phẩm
            </Typography>
            
            <Box className="flex items-center space-x-4 mb-6">
              <Box className="text-center">
                <Typography variant="h3" className="font-bold text-primary-600">
                  4.5
                </Typography>
                <Rating value={4.5} readOnly />
                <Typography variant="body2" className="text-gray-600">
                  152 đánh giá
                </Typography>
              </Box>
              
              <Box className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <Box key={stars} className="flex items-center space-x-2">
                    <Typography variant="body2" className="w-8">
                      {stars}★
                    </Typography>
                    <Box className="flex-1 bg-gray-200 rounded h-2">
                      <Box 
                        className="bg-yellow-400 h-2 rounded"
                        style={{ width: `${Math.random() * 100}%` }}
                      />
                    </Box>
                    <Typography variant="body2" className="w-8 text-gray-600">
                      {Math.floor(Math.random() * 50)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            
            <Typography variant="body1" className="text-gray-600">
              Chức năng đánh giá sẽ được cập nhật trong thời gian tới.
            </Typography>
          </Box>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box className="min-h-screen flex items-center justify-center">
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="text-center p-8">
            <Warning className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <Typography variant="h6" className="mb-4">
              Không tìm thấy sản phẩm
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/products')}
            >
              Về trang sản phẩm
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const stockStatus = getStockStatus();

  return (
    <Box className="min-h-screen bg-gray-50 py-8">
      <Box className="max-w-7xl mx-auto px-4">
        {/* Breadcrumbs */}
        <Breadcrumbs className="mb-6">
          <Link 
            color="inherit" 
            href="/products"
            className="hover:underline"
          >
            Sản phẩm
          </Link>
          {product.categoryName && (
            <Link color="inherit" className="hover:underline">
              {product.categoryName}
            </Link>
          )}
          <Typography color="text.primary">{product.productName}</Typography>
        </Breadcrumbs>

        {/* Product Detail */}
        <Grid container spacing={4} className="mb-8">
          {/* Product Image */}
          <Grid item xs={12} md={6}>
            <Card>
              <Box className="relative">
                {product.isOnSale && (
                  <Chip
                    label="SALE"
                    color="error"
                    className="absolute top-4 left-4 z-10"
                  />
                )}
                {product.featured && (
                  <Chip
                    label="HOT"
                    color="primary"
                    className="absolute top-4 right-4 z-10"
                  />
                )}
                <img
                  src={product.image || '/placeholder-product.jpg'}
                  alt={product.productName}
                  className="w-full h-96 object-cover"
                />
              </Box>
            </Card>
          </Grid>

          {/* Product Info */}
          <Grid item xs={12} md={6}>
            <Box className="space-y-4">
              {/* Title & Brand */}
              <Box>
                <Typography variant="h4" className="font-bold text-gray-800 mb-2">
                  {product.productName}
                </Typography>
                {product.brandName && (
                  <Typography variant="body1" className="text-blue-600 font-medium">
                    Thương hiệu: {product.brandName}
                  </Typography>
                )}
                {product.sku && (
                  <Typography variant="body2" className="text-gray-500">
                    SKU: {product.sku}
                  </Typography>
                )}
              </Box>

              {/* Rating */}
              <Box className="flex items-center space-x-2">
                <Rating value={4.5} readOnly size="small" />
                <Typography variant="body2" className="text-gray-600">
                  4.5 (152 đánh giá)
                </Typography>
              </Box>

              {/* Price */}
              <Box>
                {product.salePrice && product.salePrice < product.price ? (
                  <Box className="flex items-center space-x-3">
                    <Typography variant="h4" className="font-bold text-red-600">
                      {formatPrice(product.salePrice)}
                    </Typography>
                    <Typography variant="h6" className="text-gray-500 line-through">
                      {formatPrice(product.price)}
                    </Typography>
                    <Chip
                      label={`-${Math.round((1 - product.salePrice / product.price) * 100)}%`}
                      color="error"
                      size="small"
                    />
                  </Box>
                ) : (
                  <Typography variant="h4" className="font-bold text-gray-800">
                    {formatPrice(product.price)}
                  </Typography>
                )}
              </Box>

              {/* Stock Status */}
              <Box className="flex items-center space-x-2">
                {stockStatus.icon}
                <Chip 
                  label={stockStatus.label}
                  color={stockStatus.color}
                  variant="outlined"
                />
                <Typography variant="body2" className="text-gray-600">
                  Còn {product.stock} sản phẩm
                </Typography>
              </Box>

              {/* Product Type & Size */}
              {(product.productTypeName || product.sizeName) && (
                <Box className="flex items-center space-x-2">
                  {product.productTypeName && (
                    <Chip label={product.productTypeName} variant="outlined" />
                  )}
                  {product.sizeName && (
                    <Chip label={product.sizeName} variant="outlined" />
                  )}
                </Box>
              )}

              {/* Quantity Selector */}
              <Box>
                <Typography variant="subtitle2" className="font-medium mb-2">
                  Số lượng:
                </Typography>
                <Box className="flex items-center space-x-3">
                  <Box className="flex items-center border rounded">
                    <IconButton
                      onClick={() => handleQuantityChange('decrease')}
                      disabled={quantity <= 1}
                      size="small"
                    >
                      <Remove />
                    </IconButton>
                    <TextField
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (val >= 1 && val <= product.stock) {
                          setQuantity(val);
                        }
                      }}
                      inputProps={{
                        style: { textAlign: 'center', width: '60px' },
                        min: 1,
                        max: product.stock,
                      }}
                      type="number"
                      variant="standard"
                      InputProps={{ disableUnderline: true }}
                    />
                    <IconButton
                      onClick={() => handleQuantityChange('increase')}
                      disabled={quantity >= product.stock}
                      size="small"
                    >
                      <Add />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" className="text-gray-600">
                    Có sẵn: {product.stock}
                  </Typography>
                </Box>
              </Box>

              {/* Action Buttons */}
              <Box className="space-y-3">
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCart />}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="h-12"
                >
                  {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
                </Button>
                
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="h-12"
                >
                  Mua ngay
                </Button>
                
                <Box className="flex space-x-2">
                  <IconButton
                    onClick={handleToggleFavorite}
                    className="border"
                    color={isFavorited ? 'error' : 'default'}
                  >
                    {isFavorited ? <Favorite /> : <FavoriteBorder />}
                  </IconButton>
                  
                  <IconButton onClick={handleShare} className="border">
                    <Share />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Product Details Tabs */}
        <Card className="mb-8">
          <Box className="border-b">
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab label="Mô tả sản phẩm" />
              <Tab label="Đánh giá" />
            </Tabs>
          </Box>
          <CardContent>
            {renderTabContent()}
          </CardContent>
        </Card>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <Box>
            <Typography variant="h5" className="font-bold text-gray-800 mb-6">
              Sản phẩm liên quan
            </Typography>
            <Grid container spacing={3}>
              {relatedProducts.map((relatedProduct) => (
                <Grid item xs={12} sm={6} md={3} key={relatedProduct.id}>
                  <ProductCard
                    product={relatedProduct}
                    onView={(product) => navigate(`/products/${product.id}`)}
                    onAddToCart={handleAddToCart}
                    showActions={true}
                    variant="compact"
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/products')}
          className="mt-8"
        >
          Về trang sản phẩm
        </Button>

        {/* Notifications */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError('')}
        >
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!success}
          autoHideDuration={4000}
          onClose={() => setSuccess('')}
        >
          <Alert severity="success" onClose={() => setSuccess('')}>
            {success}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default ProductDetailPage;