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
import { Ruler } from 'lucide-react';
import SizeCard from './SizeCard';
import SizeForm from './SizeForm';
import { sizeService } from '../../services/sizeService';
import { useAuth } from '../../contexts/AuthContext';

const SizeList = () => {
  const { isAdmin } = useAuth();
  
  // State management
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [unitFilter, setUnitFilter] = useState('');
  
  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedSize, setSelectedSize] = useState(null);

  const unitOptions = [
    { value: 'weight', label: 'Trọng lượng' },
    { value: 'volume', label: 'Thể tích' },
    { value: 'size', label: 'Kích cỡ' },
    { value: 'length', label: 'Chiều dài' },
    { value: 'other', label: 'Khác' },
  ];

  useEffect(() => {
    loadSizes();
  }, [page, searchTerm, statusFilter, unitFilter]);

  const loadSizes = async () => {
    try {
      setLoading(true);
      const response = await sizeService.getAll({
        page: page - 1, // API uses 0-based indexing
        size: 12, // Grid view shows more items
        search: searchTerm,
        status: statusFilter || null,
      });

      if (response.data.success) {
        let sizesData = response.data.data;
        
        // Filter by unit if selected
        if (unitFilter) {
          sizesData = sizesData.filter(size => size.unit === unitFilter);
        }
        
        setSizes(sizesData);
        setTotalPages(response.data.metadata?.totalPages || 0);
      } else {
        setError(response.data.message || 'Không thể tải danh sách kích cỡ');
      }
    } catch (err) {
      setError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormMode('create');
    setSelectedSize(null);
    setFormOpen(true);
  };

  const handleEdit = (size) => {
    setFormMode('edit');
    setSelectedSize(size);
    setFormOpen(true);
  };

  const handleView = (size) => {
    setFormMode('view');
    setSelectedSize(size);
    setFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setLoading(true);
      let response;

      if (formMode === 'create') {
        response = await sizeService.create(formData);
      } else if (formMode === 'edit') {
        response = await sizeService.update(selectedSize.id, formData);
      }

      if (response.data.success) {
        setSuccess(response.data.message);
        setFormOpen(false);
        loadSizes();
      } else {
        setError(response.data.message || 'Có lỗi xảy ra');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (size) => {
    try {
      const response = await sizeService.toggleStatus(size.id);
      if (response.data.success) {
        setSuccess(response.data.message);
        loadSizes();
      } else {
        setError(response.data.message || 'Không thể thay đổi trạng thái');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi kết nối');
    }
  };

  const handleDelete = async (size) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa kích cỡ "${size.sizeName}"?`)) {
      try {
        const response = await sizeService.delete(size.id);
        if (response.data.success) {
          setSuccess(response.data.message);
          loadSizes();
        } else {
          setError(response.data.message || 'Không thể xóa kích cỡ');
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
            Kích cỡ sản phẩm
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            Quản lý kích cỡ sản phẩm trong hệ thống
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
            Thêm kích cỡ
          </Button>
        )}
      </Box>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Tìm kiếm kích cỡ..."
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
            
            <Grid item xs={12} md={2}>
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

            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Đơn vị</InputLabel>
                <Select
                  value={unitFilter}
                  onChange={(e) => setUnitFilter(e.target.value)}
                  label="Đơn vị"
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  {unitOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4} className="flex justify-end">
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={loadSizes}
                disabled={loading}
              >
                Làm mới
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Sizes Grid */}
      {loading ? (
        <Box className="text-center py-12">
          <Typography>Đang tải...</Typography>
        </Box>
      ) : sizes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Ruler className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <Typography variant="h6" className="text-gray-500 mb-2">
              {searchTerm ? 'Không tìm thấy kích cỡ nào' : 'Chưa có kích cỡ nào'}
            </Typography>
            {isAdmin() && !searchTerm && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreate}
                className="mt-4"
              >
                Thêm kích cỡ đầu tiên
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <Grid container spacing={3}>
            {sizes.map((size) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={size.id}>
                <SizeCard
                  size={size}
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

      {/* Size Form Dialog */}
      <SizeForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        size={selectedSize}
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

export default SizeList;