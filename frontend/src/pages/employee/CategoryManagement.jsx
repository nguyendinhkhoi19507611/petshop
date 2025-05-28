import React from 'react';
import { CategoryCard, CategoryForm } from '../../components/category';
import { useState, useEffect } from 'react';
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
} from '@mui/material';
import { Search, Refresh } from '@mui/icons-material';
import { Folder } from 'lucide-react';
import { categoryService } from '../../services/categoryService';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('view');
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    loadCategories();
  }, [page, searchTerm]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAll({
        page: page - 1,
        size: 12,
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

  const handleView = (category) => {
    setFormMode('view');
    setSelectedCategory(category);
    setFormOpen(true);
  };

  return (
    <Box>
      <Box className="flex items-center justify-between mb-6">
        <Box>
          <Typography variant="h4" className="font-bold text-gray-800 mb-2">
            Danh mục sản phẩm
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            Xem danh sách danh mục sản phẩm
          </Typography>
        </Box>
      </Box>

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
          </CardContent>
        </Card>
      ) : (
        <>
          <Grid container spacing={3}>
            {categories.map((category) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
                <CategoryCard
                  category={category}
                  onView={handleView}
                  canEdit={false}
                />
              </Grid>
            ))}
          </Grid>

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

      <CategoryForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        category={selectedCategory}
        mode={formMode}
        loading={loading}
      />

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar open={!!success} autoHideDuration={4000} onClose={() => setSuccess('')}>
        <Alert severity="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CategoryManagement;
