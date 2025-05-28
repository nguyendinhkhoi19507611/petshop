//frontend/src/components/product/ProductList.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Pagination,
  Alert,
  Snackbar,
  Fab,
  CircularProgress,
} from '@mui/material';
import { Add, FilterList } from '@mui/icons-material';
import { Package } from 'lucide-react';
import ProductCard from './ProductCard';
import ProductForm from './ProductForm';
import ProductFilter from './ProductFilter';
import { productService } from '../../services/productService';
import { useAuth } from '../../contexts/AuthContext';

const ProductList = () => {
  const { isAdmin, isEmployee } = useAuth();
  
  // State management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    categoryId: '',
    brandId: '',
    sizeId: '',
    minPrice: '',
    maxPrice: '',
    status: '',
    featured: false,
    inStock: false,
    onSale: false,
    tags: [],
    sortBy: 'createdDate',
    sortDir: 'desc',
  });
  const [showFilter, setShowFilter] = useState(false);
  
  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, [page, filters]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll({
        page: page - 1,
        size: 12,
        ...filters,
      });

      if (response.data.success) {
        setProducts(response.data.data);
        setTotalPages(response.data.metadata?.totalPages || 0);
      } else {
        setError(response.data.message || 'Không thể tải danh sách sản phẩm');
      }
    } catch (err) {
      setError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormMode('create');
    setSelectedProduct(null);
    setFormOpen(true);
  };

  const handleEdit = (product) => {
    setFormMode('edit');
    setSelectedProduct(product);
    setFormOpen(true);
  };

  const handleView = (product) => {
    setFormMode('view');
    setSelectedProduct(product);
    setFormOpen(true);
  };

  const handleAddToCart = async (product) => {
    // Implementation for adding to cart
    console.log('Add to cart:', product);
    setSuccess(`Đã thêm ${product.productName} vào giỏ hàng`);
  };

  const handleToggleFavorite = (product) => {
    // Implementation for toggling favorite
    console.log('Toggle favorite:', product);
  };

  const handleFormSubmit = async (formData, imageFile) => {
    try {
      setLoading(true);
      let response;

      if (formMode === 'create') {
        response = await productService.create(formData);
        
        // Upload image if provided
        if (response.data.success && imageFile) {
          await productService.uploadImage(response.data.data.id, imageFile);
        }
      } else if (formMode === 'edit') {
        response = await productService.update(selectedProduct.id, formData);
        
        // Upload image if provided
        if (response.data.success && imageFile) {
          await productService.uploadImage(selectedProduct.id, imageFile);
        }
      }

      if (response.data.success) {
        setSuccess(response.data.message);
        setFormOpen(false);
        loadProducts();
      } else {
        setError(response.data.message || 'Có lỗi xảy ra');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (product) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${product.productName}"?`)) {
      try {
        const response = await productService.delete(product.id);
        if (response.data.success) {
          setSuccess(response.data.message);
          loadProducts();
        } else {
          setError(response.data.message || 'Không thể xóa sản phẩm');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Lỗi kết nối');
      }
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filtering
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      categoryId: '',
      brandId: '',
      sizeId: '',
      minPrice: '',
      maxPrice: '',
      status: '',
      featured: false,
      inStock: false,
      onSale: false,
      tags: [],
      sortBy: 'createdDate',
      sortDir: 'desc',
    });
    setPage(1);
  };

  const canEdit = isAdmin() || isEmployee();

  return (
    <Box>
      {/* Header */}
      <Box className="flex items-center justify-between mb-6">
        <Box>
          <Typography variant="h4" className="font-bold text-gray-800 mb-2">
            Sản phẩm
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            Quản lý sản phẩm trong hệ thống
          </Typography>
        </Box>
        
        <Box className="flex space-x-2">
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setShowFilter(!showFilter)}
          >
            Bộ lọc
          </Button>
          
          {canEdit && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleCreate}
              size="large"
              className="rounded-lg"
            >
              Thêm sản phẩm
            </Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Filter Sidebar */}
        {showFilter && (
          <Grid item xs={12} md={3}>
            <ProductFilter
              onFilterChange={handleFilterChange}
              onClear={handleClearFilters}
              initialFilters={filters}
            />
          </Grid>
        )}

        {/* Products Grid */}
        <Grid item xs={12} md={showFilter ? 9 : 12}>
          {loading ? (
            <Box className="text-center py-12">
              <CircularProgress />
              <Typography className="mt-2">Đang tải...</Typography>
            </Box>
          ) : products.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <Typography variant="h6" className="text-gray-500 mb-2">
                  {filters.search ? 'Không tìm thấy sản phẩm nào' : 'Chưa có sản phẩm nào'}
                </Typography>
                {canEdit && !filters.search && (
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleCreate}
                    className="mt-4"
                  >
                    Thêm sản phẩm đầu tiên
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              <Grid container spacing={3}>
                {products.map((product) => (
                  <Grid item xs={12} sm={6} lg={4} key={product.id}>
                    <ProductCard
                      product={product}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onView={handleView}
                      onAddToCart={handleAddToCart}
                      onToggleFavorite={handleToggleFavorite}
                      canEdit={canEdit}
                      variant="detailed"
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box className="flex justify-center mt-6">
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(event, value) => setPage(value)}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>

      {/* Product Form Dialog */}
      <ProductForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        product={selectedProduct}
        mode={formMode}
        loading={loading}
      />

      {/* Floating Action Button for Mobile */}
      {canEdit && (
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleCreate}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            display: { xs: 'flex', md: 'none' },
          }}
        >
          <Add />
        </Fab>
      )}

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
  );
};

export default ProductList;