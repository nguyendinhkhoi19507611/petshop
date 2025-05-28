import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Alert,
  Snackbar,
  InputAdornment,
  Tooltip,
  Menu,
  MenuItem,
  Fab,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  MoreVert,
  Visibility,
  VisibilityOff,
  Refresh,
} from '@mui/icons-material';
import { Package, Folder } from 'lucide-react';
import { categoryService } from '../../services/categoryService';
import { useAuth } from '../../contexts/AuthContext';

const CategoryManagement = () => {
  const { isAdmin } = useAuth();
  
  // State management
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  
  // Search
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    categoryName: '',
    description: '',
    status: true,
  });
  const [formErrors, setFormErrors] = useState({});
  
  // Menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuCategory, setMenuCategory] = useState(null);

  // Load categories on component mount and when dependencies change
  useEffect(() => {
    loadCategories();
  }, [page, rowsPerPage, searchTerm]);

  // Debounced search
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    setSearchTimeout(setTimeout(() => {
      if (page !== 0) {
        setPage(0); // Reset to first page when searching
      } else {
        loadCategories();
      }
    }, 500));

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTerm]);

  // Load categories from API
  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAll({
        page,
        size: rowsPerPage,
        search: searchTerm,
      });

      if (response.data.success) {
        setCategories(response.data.data);
        setTotalElements(response.data.metadata?.totalElements || 0);
      } else {
        setError(response.data.message || 'Không thể tải danh sách danh mục');
      }
    } catch (err) {
      setError('Lỗi kết nối. Vui lòng thử lại.');
      console.error('Load categories error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.categoryName.trim()) {
      errors.categoryName = 'Tên danh mục không được để trống';
    } else if (formData.categoryName.length < 2) {
      errors.categoryName = 'Tên danh mục phải có ít nhất 2 ký tự';
    } else if (formData.categoryName.length > 100) {
      errors.categoryName = 'Tên danh mục không được vượt quá 100 ký tự';
    }

    if (formData.description && formData.description.length > 500) {
      errors.description = 'Mô tả không được vượt quá 500 ký tự';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle create category
  const handleCreate = () => {
    setDialogMode('create');
    setFormData({
      categoryName: '',
      description: '',
      status: true,
    });
    setFormErrors({});
    setOpenDialog(true);
  };

  // Handle edit category
  const handleEdit = (category) => {
    setDialogMode('edit');
    setSelectedCategory(category);
    setFormData({
      categoryName: category.categoryName,
      description: category.description || '',
      status: category.status,
    });
    setFormErrors({});
    setOpenDialog(true);
    setAnchorEl(null);
  };

  // Handle view category
  const handleView = (category) => {
    setDialogMode('view');
    setSelectedCategory(category);
    setFormData({
      categoryName: category.categoryName,
      description: category.description || '',
      status: category.status,
    });
    setOpenDialog(true);
    setAnchorEl(null);
  };

  // Handle form submit
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      let response;

      if (dialogMode === 'create') {
        response = await categoryService.create(formData);
      } else if (dialogMode === 'edit') {
        response = await categoryService.update(selectedCategory.id, formData);
      }

      if (response.data.success) {
        setSuccess(response.data.message);
        setOpenDialog(false);
        loadCategories();
      } else {
        setError(response.data.message || 'Có lỗi xảy ra');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Lỗi kết nối';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete category
  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      const response = await categoryService.delete(selectedCategory.id);

      if (response.data.success) {
        setSuccess(response.data.message);
        setDeleteDialogOpen(false);
        loadCategories();
      } else {
        setError(response.data.message || 'Không thể xóa danh mục');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Lỗi kết nối';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (category) => {
    try {
      setLoading(true);
      const response = await categoryService.toggleStatus(category.id);

      if (response.data.success) {
        setSuccess(response.data.message);
        loadCategories();
      } else {
        setError(response.data.message || 'Không thể thay đổi trạng thái');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Lỗi kết nối';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle menu
  const handleMenuClick = (event, category) => {
    setAnchorEl(event.currentTarget);
    setMenuCategory(category);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuCategory(null);
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Get status chip
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
    <Box>
      {/* Header */}
      <Box className="flex items-center justify-between mb-6">
        <Box>
          <Typography variant="h4" className="font-bold text-gray-800 mb-2">
            Quản lý danh mục
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

      {/* Categories Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tên danh mục</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Số sản phẩm</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" className="py-8">
                    <Typography>Đang tải...</Typography>
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" className="py-8">
                    <Box className="text-center">
                      <Folder className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <Typography variant="body1" className="text-gray-500">
                        {searchTerm ? 'Không tìm thấy danh mục nào' : 'Chưa có danh mục nào'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id} hover>
                    <TableCell>#{category.id}</TableCell>
                    <TableCell>
                      <Typography variant="body2" className="font-medium">
                        {category.categoryName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        className="text-gray-600 max-w-xs truncate"
                        title={category.description}
                      >
                        {category.description || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {getStatusChip(category.status)}
                    </TableCell>
                    <TableCell>
                      <Box className="flex items-center">
                        <Package className="w-4 h-4 text-gray-400 mr-1" />
                        <Typography variant="body2">
                          {category.productCount || 0}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={(e) => handleMenuClick(e, category)}
                        size="small"
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={totalElements}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
          }
        />
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleView(menuCategory)}>
          <Visibility className="mr-2" fontSize="small" />
          Xem chi tiết
        </MenuItem>
        
        {isAdmin() && (
          <>
            <MenuItem onClick={() => handleEdit(menuCategory)}>
              <Edit className="mr-2" fontSize="small" />
              Chỉnh sửa
            </MenuItem>
            
            <MenuItem onClick={() => handleToggleStatus(menuCategory)}>
              {menuCategory?.status ? (
                <>
                  <VisibilityOff className="mr-2" fontSize="small" />
                  Vô hiệu hóa
                </>
              ) : (
                <>
                  <Visibility className="mr-2" fontSize="small" />
                  Kích hoạt
                </>
              )}
            </MenuItem>
            
            <MenuItem 
              onClick={() => {
                setSelectedCategory(menuCategory);
                setDeleteDialogOpen(true);
                setAnchorEl(null);
              }}
              className="text-red-600"
            >
              <Delete className="mr-2" fontSize="small" />
              Xóa
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Category Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === 'create' && 'Thêm danh mục mới'}
          {dialogMode === 'edit' && 'Chỉnh sửa danh mục'}
          {dialogMode === 'view' && 'Chi tiết danh mục'}
        </DialogTitle>
        
        <DialogContent>
          <Box className="space-y-4 mt-4">
            <TextField
              fullWidth
              label="Tên danh mục *"
              name="categoryName"
              value={formData.categoryName}
              onChange={handleInputChange}
              error={!!formErrors.categoryName}
              helperText={formErrors.categoryName}
              disabled={dialogMode === 'view' || loading}
            />
            
            <TextField
              fullWidth
              label="Mô tả"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              error={!!formErrors.description}
              helperText={formErrors.description}
              multiline
              rows={3}
              disabled={dialogMode === 'view' || loading}
            />

            {dialogMode !== 'create' && (
              <Box className="flex items-center space-x-2">
                <Typography variant="body2">Trạng thái:</Typography>
                {getStatusChip(formData.status)}
              </Box>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={loading}>
            {dialogMode === 'view' ? 'Đóng' : 'Hủy'}
          </Button>
          
          {dialogMode !== 'view' && (
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={loading}
            >
              {dialogMode === 'create' ? 'Tạo danh mục' : 'Cập nhật'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa danh mục "{selectedCategory?.categoryName}"?
          </Typography>
          <Typography variant="body2" className="text-red-600 mt-2">
            Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={loading}>
            Hủy
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={loading}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

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

      {/* Snackbar Notifications */}
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

export default CategoryManagement;