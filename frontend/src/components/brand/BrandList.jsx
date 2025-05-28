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
import { Tag } from 'lucide-react';
import BrandCard from './BrandCard';
import BrandForm from './BrandForm';
import { brandService } from '../../services/brandService';
import { useAuth } from '../../contexts/AuthContext';

const BrandList = () => {
  const { isAdmin } = useAuth();
  
  // State management
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedBrand, setSelectedBrand] = useState(null);

  useEffect(() => {
    loadBrands();
  }, [page, searchTerm, statusFilter]);

  const loadBrands = async () => {
    try {
      setLoading(true);
      const response = await brandService.getAll({
        page: page - 1, // API uses 0-based indexing
        size: 12, // Grid view shows more items
        search: searchTerm,
        status: statusFilter || null,
      });

      if (response.data.success) {
        setBrands(response.data.data);
        setTotalPages(response.data.metadata?.totalPages || 0);
      } else {
        setError(response.data.message || 'Không thể tải danh sách thương hiệu');
      }
    } catch (err) {
      setError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormMode('create');
    setSelectedBrand(null);
    setFormOpen(true);
  };

  const handleEdit = (brand) => {
    setFormMode('edit');
    setSelectedBrand(brand);
    setFormOpen(true);
  };

  const handleView = (brand) => {
    setFormMode('view');
    setSelectedBrand(brand);
    setFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setLoading(true);
      let response;

      if (formMode === 'create') {
        response = await brandService.create(formData);
      } else if (formMode === 'edit') {
        response = await brandService.update(selectedBrand.id, formData);
      }

      if (response.data.success) {
        setSuccess(response.data.message);
        setFormOpen(false);
        loadBrands();
      } else {
        setError(response.data.message || 'Có lỗi xảy ra');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (brand) => {
    try {
      const response = await brandService.toggleStatus(brand.id);
      if (response.data.success) {
        setSuccess(response.data.message);
        loadBrands();
      } else {
        setError(response.data.message || 'Không thể thay đổi trạng thái');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi kết nối');
    }
  };

  const handleDelete = async (brand) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa thương hiệu "${brand.brandName}"?`)) {
      try {
        const response = await brandService.delete(brand.id);
        if (response.data.success) {
          setSuccess(response.data.message);
          loadBrands();
        } else {
          setError(response.data.message || 'Không thể xóa thương hiệu');
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
            Thương hiệu sản phẩm
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            Quản lý thương hiệu sản phẩm trong hệ thống
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
            Thêm thương hiệu
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
                placeholder="Tìm kiếm thương hiệu..."
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
                onClick={loadBrands}
                disabled={loading}
              >
                Làm mới
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Brands Grid */}
      {loading ? (
        <Box className="text-center py-12">
          <Typography>Đang tải...</Typography>
        </Box>
      ) : brands.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <Typography variant="h6" className="text-gray-500 mb-2">
              {searchTerm ? 'Không tìm thấy thương hiệu nào' : 'Chưa có thương hiệu nào'}
            </Typography>
            {isAdmin() && !searchTerm && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreate}
                className="mt-4"
              >
                Thêm thương hiệu đầu tiên
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <Grid container spacing={3}>
            {brands.map((brand) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={brand.id}>
                <BrandCard
                  brand={brand}
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

      {/* Brand Form Dialog */}
      <BrandForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        brand={selectedBrand}
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

export default BrandList;