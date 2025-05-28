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
  Menu,
  MenuItem,
  Fab,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Tooltip,
} from '@mui/material';
import { DragIndicator } from '@mui/icons-material';
import {
  Add,
  Edit,
  Delete,
  Search,
  MoreVert,
  Visibility,
  VisibilityOff,
  Refresh,
  SwapVert,
  DragHandle,
} from '@mui/icons-material';
import { Ruler, Package } from 'lucide-react';
import { sizeService } from '../../services/sizeService';
import { useAuth } from '../../contexts/AuthContext';

const SizeManagement = () => {
  const { isAdmin } = useAuth();
  
  // State management
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  
  // Search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [unitFilter, setUnitFilter] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedSize, setSelectedSize] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    sizeName: '',
    description: '',
    value: '',
    unit: '',
    displayOrder: '',
    status: true,
  });
  const [formErrors, setFormErrors] = useState({});
  
  // Menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuSize, setMenuSize] = useState(null);

  // Unit options
  const unitOptions = [
    { value: 'weight', label: 'Trọng lượng (g, kg)' },
    { value: 'volume', label: 'Thể tích (ml, l)' },
    { value: 'size', label: 'Kích cỡ (S, M, L, XL)' },
    { value: 'length', label: 'Chiều dài (cm, m)' },
    { value: 'other', label: 'Khác' },
  ];

  // Load sizes on component mount and when dependencies change
  useEffect(() => {
    loadSizes();
  }, [page, rowsPerPage, searchTerm, statusFilter, unitFilter]);

  // Debounced search
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    setSearchTimeout(setTimeout(() => {
      if (page !== 0) {
        setPage(0); // Reset to first page when searching
      } else {
        loadSizes();
      }
    }, 500));

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTerm]);

  // Load sizes from API
  const loadSizes = async () => {
    try {
      setLoading(true);
      const response = await sizeService.getAll({
        page,
        size: rowsPerPage,
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
        setTotalElements(response.data.metadata?.totalElements || 0);
      } else {
        setError(response.data.message || 'Không thể tải danh sách kích cỡ');
      }
    } catch (err) {
      setError('Lỗi kết nối. Vui lòng thử lại.');
      console.error('Load sizes error:', err);
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

    if (!formData.sizeName.trim()) {
      errors.sizeName = 'Tên kích cỡ không được để trống';
    } else if (formData.sizeName.length > 50) {
      errors.sizeName = 'Tên kích cỡ không được vượt quá 50 ký tự';
    }

    if (formData.description && formData.description.length > 500) {
      errors.description = 'Mô tả không được vượt quá 500 ký tự';
    }

    if (formData.value && formData.value.length > 20) {
      errors.value = 'Giá trị không được vượt quá 20 ký tự';
    }

    if (formData.unit && formData.unit.length > 10) {
      errors.unit = 'Đơn vị không được vượt quá 10 ký tự';
    }

    if (formData.displayOrder && (isNaN(formData.displayOrder) || formData.displayOrder < 0 || formData.displayOrder > 999)) {
      errors.displayOrder = 'Thứ tự hiển thị phải là số từ 0-999';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle create size
  const handleCreate = () => {
    setDialogMode('create');
    setFormData({
      sizeName: '',
      description: '',
      value: '',
      unit: '',
      displayOrder: '',
      status: true,
    });
    setFormErrors({});
    setOpenDialog(true);
  };

  // Handle edit size
  const handleEdit = (size) => {
    setDialogMode('edit');
    setSelectedSize(size);
    setFormData({
      sizeName: size.sizeName,
      description: size.description || '',
      value: size.value || '',
      unit: size.unit || '',
      displayOrder: size.displayOrder || '',
      status: size.status,
    });
    setFormErrors({});
    setOpenDialog(true);
    setAnchorEl(null);
  };

  // Handle view size
  const handleView = (size) => {
    setDialogMode('view');
    setSelectedSize(size);
    setFormData({
      sizeName: size.sizeName,
      description: size.description || '',
      value: size.value || '',
      unit: size.unit || '',
      displayOrder: size.displayOrder || '',
      status: size.status,
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

      const submitData = {
        ...formData,
        displayOrder: formData.displayOrder ? parseInt(formData.displayOrder) : null,
      };

      if (dialogMode === 'create') {
        response = await sizeService.create(submitData);
      } else if (dialogMode === 'edit') {
        response = await sizeService.update(selectedSize.id, submitData);
      }

      if (response.data.success) {
        setSuccess(response.data.message);
        setOpenDialog(false);
        loadSizes();
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

  // Handle delete size
  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      const response = await sizeService.delete(selectedSize.id);

      if (response.data.success) {
        setSuccess(response.data.message);
        setDeleteDialogOpen(false);
        loadSizes();
      } else {
        setError(response.data.message || 'Không thể xóa kích cỡ');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Lỗi kết nối';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (size) => {
    try {
      setLoading(true);
      const response = await sizeService.toggleStatus(size.id);

      if (response.data.success) {
        setSuccess(response.data.message);
        loadSizes();
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
  const handleMenuClick = (event, size) => {
    setAnchorEl(event.currentTarget);
    setMenuSize(size);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuSize(null);
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

  // Get unit label
  const getUnitLabel = (unit) => {
    const unitOption = unitOptions.find(opt => opt.value === unit);
    return unitOption ? unitOption.label : unit || '-';
  };

  // Format size display
  const formatSizeDisplay = (size) => {
    if (size.value && size.unit) {
      return `${size.sizeName} (${size.value}${size.unit === 'weight' ? 'g' : size.unit === 'volume' ? 'ml' : ''})`;
    }
    return size.sizeName;
  };

  return (
    <Box>
      {/* Header */}
      <Box className="flex items-center justify-between mb-6">
        <Box>
          <Typography variant="h4" className="font-bold text-gray-800 mb-2">
            Quản lý kích cỡ
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

      {/* Sizes Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Thứ tự</TableCell>
                <TableCell>Tên kích cỡ</TableCell>
                <TableCell>Giá trị</TableCell>
                <TableCell>Đơn vị</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Sản phẩm</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" className="py-8">
                    <Typography>Đang tải...</Typography>
                  </TableCell>
                </TableRow>
              ) : sizes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" className="py-8">
                    <Box className="text-center">
                      <Ruler className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <Typography variant="body1" className="text-gray-500">
                        {searchTerm ? 'Không tìm thấy kích cỡ nào' : 'Chưa có kích cỡ nào'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                sizes.map((size) => (
                  <TableRow key={size.id} hover>
                    <TableCell>
                      <Box className="flex items-center">
                        <DragIndicator className="text-gray-400 mr-2" />
                        <Typography variant="body2" className="font-medium">
                          #{size.displayOrder || '-'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" className="font-medium">
                        {size.sizeName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {size.value || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" className="text-gray-600">
                        {getUnitLabel(size.unit)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        className="text-gray-600 max-w-xs truncate"
                        title={size.description}
                      >
                        {size.description || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {getStatusChip(size.status)}
                    </TableCell>
                    <TableCell>
                      <Box className="flex items-center">
                        <Package className="w-4 h-4 text-gray-400 mr-1" />
                        <Typography variant="body2">
                          {size.productCount || 0}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={(e) => handleMenuClick(e, size)}
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
        <MenuItem onClick={() => handleView(menuSize)}>
          <Visibility className="mr-2" fontSize="small" />
          Xem chi tiết
        </MenuItem>
        
        {isAdmin() && (
          <>
            <MenuItem onClick={() => handleEdit(menuSize)}>
              <Edit className="mr-2" fontSize="small" />
              Chỉnh sửa
            </MenuItem>
            
            <MenuItem onClick={() => handleToggleStatus(menuSize)}>
              {menuSize?.status ? (
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
                setSelectedSize(menuSize);
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

      {/* Size Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === 'create' && 'Thêm kích cỡ mới'}
          {dialogMode === 'edit' && 'Chỉnh sửa kích cỡ'}
          {dialogMode === 'view' && 'Chi tiết kích cỡ'}
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={3} className="mt-2">
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tên kích cỡ *"
                name="sizeName"
                value={formData.sizeName}
                onChange={handleInputChange}
                error={!!formErrors.sizeName}
                helperText={formErrors.sizeName}
                disabled={dialogMode === 'view' || loading}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={dialogMode === 'view' || loading}>
                <InputLabel>Đơn vị</InputLabel>
                <Select
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  label="Đơn vị"
                >
                  {unitOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Thứ tự hiển thị"
                name="displayOrder"
                type="number"
                value={formData.displayOrder}
                onChange={handleInputChange}
                error={!!formErrors.displayOrder}
                helperText={formErrors.displayOrder || 'Số từ 0-999, để trống sẽ tự động gán'}
                disabled={dialogMode === 'view' || loading}
                inputProps={{ min: 0, max: 999 }}
              />
            </Grid>
            
            <Grid item xs={12}>
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
                placeholder="Nhập mô tả cho kích cỡ..."
              />
            </Grid>

            {dialogMode === 'view' && (
              <Grid item xs={12}>
                <Box className="flex items-center space-x-2">
                  <Typography variant="body2">Trạng thái:</Typography>
                  {getStatusChip(formData.status)}
                </Box>
              </Grid>
            )}
          </Grid>
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
              {dialogMode === 'create' ? 'Tạo kích cỡ' : 'Cập nhật'}
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
            Bạn có chắc chắn muốn xóa kích cỡ "{selectedSize?.sizeName}"?
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

export default SizeManagement;