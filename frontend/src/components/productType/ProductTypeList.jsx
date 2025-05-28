import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Pagination,
  Alert,
  Snackbar,
  Fab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add, Search, Refresh } from '@mui/icons-material';
import { Category as CategoryIcon } from 'lucide-react';
import ProductTypeCard from './ProductTypeCard';
import ProductTypeForm from './ProductTypeForm';
import { productTypeService } from '../../services/productTypeService';
import { useAuth } from '../../contexts/AuthContext';

const ProductTypeList = () => {
  const { isAdmin } = useAuth();
  
  // State management
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedProductType, setSelectedProductType] = useState(null);

  useEffect(() => {
    loadProductTypes();
  }, [page, searchTerm, statusFilter, categoryFilter]);

  const loadProductTypes = async () => {
    try {
      setLoading(true);
      const response = await productTypeService.getAll({
        page: page - 1,
        size: 12,
        search: searchTerm,
        status: statusFilter || null,
        categoryId: categoryFilter || null,
      });

      if (response.data.success) {
        setProductTypes(response.data.data);
        setTotalPages(response.data.metadata?.totalPages || 0);
      } else {
        setError(response.data.message || 'Không thể tải danh sách loại sản phẩm');
      }
    } catch (err) {
      setError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormMode('create');
    setSelectedProductType(null);
    setFormOpen(true);
  };

  const handleEdit = (productType) => {
    setFormMode('edit');
    setSelectedProductType(productType);
    setFormOpen(true);
  };

  const handleView = (productType) => {
    setFormMode('view');
    setSelectedProductType(productType);
    setFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setLoading(true);
      let response;

      if (formMode === 'create') {
        response = await productTypeService.create(formData);
      } else if (formMode === 'edit') {
        response = await productTypeService.update(selectedProductType.id, formData);
      }

      if (response.data.success) {
        setSuccess(response.data.message);
        setFormOpen(false);
        loadProductTypes();
      } else {
        setError(response.data.message || 'Có lỗi xảy ra');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (productType) => {
    try {
      const response = await productTypeService.toggleStatus(productType.id);
      if (response.data.success) {
        setSuccess(response.data.message);
        loadProductTypes();
      } else {
        setError(response.data.message || 'Không thể thay đổi trạng thái');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi kết nối');
    }
  };

  const handleDelete = async (productType) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa loại sản phẩm "${productType.productTypeName}"?`)) {
      try {
        const response = await productTypeService.delete(productType.id);
        if (response.data.success) {
          setSuccess(response.data.message);
          loadProductTypes();
        } else {
          setError(response.data.message || 'Không thể xóa loại sản phẩm');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Lỗi kết nối');
      }
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box className="flex items-center justify-between mb-6">
        <Box>
          <Typography variant="h4" className="font-bold text-gray-800 mb-2">
            Loại sản phẩm
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            Quản lý loại sản phẩm trong hệ thống
          </Typography>
        </Box>
        
        {isAdmin() && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreate}
            size="large"
            className="rounded-lg"
          >
            Thêm loại sản phẩm
          </Button>
        )}
      </Box>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Tìm kiếm loại sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Trạng thái"
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="true">Hoạt động</MenuItem>
                  <MenuItem value="false">Không hoạt động</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={5} className="flex justify-end">
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={loadProductTypes}
                disabled={loading}
              >
                Làm mới
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Product Types Grid */}
      {loading ? (
        <Box className="text-center py-12">
          <Typography>Đang tải...</Typography>
        </Box>
      ) : productTypes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <CategoryIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <Typography variant="h6" className="text-gray-500 mb-2">
              {searchTerm ? 'Không tìm thấy loại sản phẩm nào' : 'Chưa có loại sản phẩm nào'}
            </Typography>
            {isAdmin() && !searchTerm && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreate}
                className="mt-4"
              >
                Thêm loại sản phẩm đầu tiên
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <Grid container spacing={3}>
            {productTypes.map((productType) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={productType.id}>
                <ProductTypeCard
                  productType={productType}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={handleView}
                  onToggleStatus={handleToggleStatus}
                  canEdit={isAdmin()}
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

      {/* Product Type Form Dialog */}
      <ProductTypeForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        productType={selectedProductType}
        mode={formMode}
        loading={loading}
      />

      {/* Floating Action Button for Mobile */}
      {isAdmin() && (
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

export default ProductTypeList;