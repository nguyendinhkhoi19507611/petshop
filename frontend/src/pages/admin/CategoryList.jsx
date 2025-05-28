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
} from '@mui/material';
import { Add, Search, Refresh } from '@mui/icons-material';
import { Folder } from 'lucide-react';
import CategoryCard from '../../components/category/CategoryCard';
import CategoryForm from '../../components/category/CategoryForm';
import { categoryService } from '../../services/categoryService';
import { useAuth } from '../../contexts/AuthContext';

const CategoryList = () => {
  const { isAdmin } = useAuth();
  
  // State management
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    loadCategories();
  }, [page, searchTerm]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAll({
        page: page - 1, // API uses 0-based indexing
        size: 12, // Grid view shows more items
        search: searchTerm,
      });

      if (response.data.success) {
        setCategories(response.data.data);
        setTotalPages(response.data.metadata?.totalPages || 0);
      } else {
        setError(response.data.message || 'Không thể tải danh sách danh mục');
      }
    } catch (err) {
      setError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormMode('create');
    setSelectedCategory(null);
    setFormOpen(true);
  };

  const handleEdit = (category) => {
    setFormMode('edit');
    setSelectedCategory(category);
    setFormOpen(true);
  };

  const handleView = (category) => {
    setFormMode('view');
    setSelectedCategory(category);
    setFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setLoading(true);
      let response;

      if (formMode === 'create') {
        response = await categoryService.create(formData);
      } else if (formMode === 'edit') {
        response = await categoryService.update(selectedCategory.id, formData);
      }

      if (response.data.success) {
        setSuccess(response.data.message);
        setFormOpen(false);
        loadCategories();
      } else {
        setError(response.data.message || 'Có lỗi xảy ra');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (category) => {
    try {
      const response = await categoryService.toggleStatus(category.id);
      if (response.data.success) {
        setSuccess(response.data.message);
        loadCategories();
      } else {
        setError(response.data.message || 'Không thể thay đổi trạng thái');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi kết nối');
    }
  };

  const handleDelete = async (category) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${category.categoryName}"?`)) {
      try {
        const response = await categoryService.delete(category.id);
        if (response.data.success) {
          setSuccess(response.data.message);
          loadCategories();
        } else {
          setError(response.data.message || 'Không thể xóa danh mục');
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
            Danh mục sản phẩm
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            Quản lý danh mục sản phẩm trong hệ thống
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
            Thêm danh mục
          </Button>
        )}
      </Box>

      {/* Search and Actions */}
      <Card className="mb-6">
        <CardContent>
          <Box className="flex items-center justify-between">
            <TextField
              placeholder="Tìm kiếm danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search className="text-gray-400" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 300 }}
            />
            
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={loadCategories}
              disabled={loading}
            >
              Làm mới
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      {loading ? (
        <Box className="text-center py-12">
          <Typography>Đang tải...</Typography>
        </Box>
      ) : categories.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <Typography variant="h6" className="text-gray-500 mb-2">
              {searchTerm ? 'Không tìm thấy danh mục nào' : 'Chưa có danh mục nào'}
            </Typography>
            {isAdmin() && !searchTerm && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreate}
                className="mt-4"
              >
                Thêm danh mục đầu tiên
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <Grid container spacing={3}>
            {categories.map((category) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
                <CategoryCard
                  category={category}
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

      {/* Category Form Dialog */}
      <CategoryForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        category={selectedCategory}
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

export default CategoryList;