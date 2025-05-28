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
  Avatar,
  FormControl,
  InputLabel,
  Select,
  Grid,
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
  Link as LinkIcon,
  Image,
} from '@mui/icons-material';
import { Package, Tag } from 'lucide-react';
import { brandService } from '../../services/brandService';
import { useAuth } from '../../contexts/AuthContext';

const BrandManagement = () => {
  const { isAdmin } = useAuth();
  
  // State management
  const [brands, setBrands] = useState([]);
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
  const [searchTimeout, setSearchTimeout] = useState(null);
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    brandName: '',
    description: '',
    logoUrl: '',
    website: '',
    status: true,
  });
  const [formErrors, setFormErrors] = useState({});
  
  // Menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuBrand, setMenuBrand] = useState(null);

  // Load brands on component mount and when dependencies change
  useEffect(() => {
    loadBrands();
  }, [page, rowsPerPage, searchTerm, statusFilter]);

  // Debounced search
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    setSearchTimeout(setTimeout(() => {
      if (page !== 0) {
        setPage(0); // Reset to first page when searching
      } else {
        loadBrands();
      }
    }, 500));

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTerm]);

  // Load brands from API
  const loadBrands = async () => {
    try {
      setLoading(true);
      const response = await brandService.getAll({
        page,
        size: rowsPerPage,
        search: searchTerm,
        status: statusFilter || null,
      });

      if (response.data.success) {
        setBrands(response.data.data);
        setTotalElements(response.data.metadata?.totalElements || 0);
      } else {
        setError(response.data.message || 'Không thể tải danh sách thương hiệu');
      }
    } catch (err) {
      setError('Lỗi kết nối. Vui lòng thử lại.');
      console.error('Load brands error:', err);
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

    if (!formData.brandName.trim()) {
      errors.brandName = 'Tên thương hiệu không được để trống';
    } else if (formData.brandName.length < 2) {
      errors.brandName = 'Tên thương hiệu phải có ít nhất 2 ký tự';
    } else if (formData.brandName.length > 50) {
      errors.brandName = 'Tên thương hiệu không được vượt quá 50 ký tự';
    }

    if (formData.description && formData.description.length > 500) {
      errors.description = 'Mô tả không được vượt quá 500 ký tự';
    }

    if (formData.website && !formData.website.match(/^https?:\/\/.+/)) {
      errors.website = 'Website phải bắt đầu bằng http:// hoặc https://';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle create brand
  const handleCreate = () => {
    setDialogMode('create');
    setFormData({
      brandName: '',
      description: '',
      logoUrl: '',
      website: '',
      status: true,
    });
    setFormErrors({});
    setOpenDialog(true);
  };

  // Handle edit brand
  const handleEdit = (brand) => {
    setDialogMode('edit');
    setSelectedBrand(brand);
    setFormData({
      brandName: brand.brandName,
      description: brand.description || '',
      logoUrl: brand.logoUrl || '',
      website: brand.website || '',
      status: brand.status,
    });
    setFormErrors({});
    setOpenDialog(true);
    setAnchorEl(null);
  };

  // Handle view brand
  const handleView = (brand) => {
    setDialogMode('view');
    setSelectedBrand(brand);
    setFormData({
      brandName: brand.brandName,
      description: brand.description || '',
      logoUrl: brand.logoUrl || '',
      website: brand.website || '',
      status: brand.status,
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
        response = await brandService.create(formData);
      } else if (dialogMode === 'edit') {
        response = await brandService.update(selectedBrand.id, formData);
      }

      if (response.data.success) {
        setSuccess(response.data.message);
        setOpenDialog(false);
        loadBrands();
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

  // Handle delete brand
  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      const response = await brandService.delete(selectedBrand.id);

      if (response.data.success) {
        setSuccess(response.data.message);
        setDeleteDialogOpen(false);
        loadBrands();
      } else {
        setError(response.data.message || 'Không thể xóa thương hiệu');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Lỗi kết nối';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (brand) => {
    try {
      setLoading(true);
      const response = await brandService.toggleStatus(brand.id);

      if (response.data.success) {
        setSuccess(response.data.message);
        loadBrands();
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
  const handleMenuClick = (event, brand) => {
    setAnchorEl(event.currentTarget);
    setMenuBrand(brand);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuBrand(null);
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

  // Get brand logo
  const getBrandLogo = (brand) => {
    if (brand.logoUrl) {
      return (
        <Avatar
          src={brand.logoUrl}
          alt={brand.brandName}
          sx={{ width: 32, height: 32 }}
        >
          {brand.brandName.charAt(0)}
        </Avatar>
      );
    } else {
      return (
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
          {brand.brandName.charAt(0)}
        </Avatar>
      );
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box className="flex items-center justify-between mb-6">
        <Box>
          <Typography variant="h4" className="font-bold text-gray-800 mb-2">
            Quản lý thương hiệu
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

      {/* Brands Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Logo</TableCell>
                <TableCell>Tên thương hiệu</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Website</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Sản phẩm</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" className="py-8">
                    <Typography>Đang tải...</Typography>
                  </TableCell>
                </TableRow>
              ) : brands.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" className="py-8">
                    <Box className="text-center">
                      <Tag className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <Typography variant="body1" className="text-gray-500">
                        {searchTerm ? 'Không tìm thấy thương hiệu nào' : 'Chưa có thương hiệu nào'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                brands.map((brand) => (
                  <TableRow key={brand.id} hover>
                    <TableCell>
                      {getBrandLogo(brand)}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" className="font-medium">
                        {brand.brandName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        className="text-gray-600 max-w-xs truncate"
                        title={brand.description}
                      >
                        {brand.description || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {brand.website ? (
                        <Tooltip title="Mở website">
                          <IconButton
                            size="small"
                            onClick={() => window.open(brand.website, '_blank')}
                            className="text-blue-600"
                          >
                            <LinkIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Typography variant="body2" className="text-gray-400">
                          -
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {getStatusChip(brand.status)}
                    </TableCell>
                    <TableCell>
                      <Box className="flex items-center">
                        <Package className="w-4 h-4 text-gray-400 mr-1" />
                        <Typography variant="body2">
                          {brand.productCount || 0}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={(e) => handleMenuClick(e, brand)}
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
        <MenuItem onClick={() => handleView(menuBrand)}>
          <Visibility className="mr-2" fontSize="small" />
          Xem chi tiết
        </MenuItem>
        
        {isAdmin() && (
          <>
            <MenuItem onClick={() => handleEdit(menuBrand)}>
              <Edit className="mr-2" fontSize="small" />
              Chỉnh sửa
            </MenuItem>
            
            <MenuItem onClick={() => handleToggleStatus(menuBrand)}>
              {menuBrand?.status ? (
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
                setSelectedBrand(menuBrand);
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

      {/* Brand Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === 'create' && 'Thêm thương hiệu mới'}
          {dialogMode === 'edit' && 'Chỉnh sửa thương hiệu'}
          {dialogMode === 'view' && 'Chi tiết thương hiệu'}
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={3} className="mt-2">
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên thương hiệu *"
                name="brandName"
                value={formData.brandName}
                onChange={handleInputChange}
                error={!!formErrors.brandName}
                helperText={formErrors.brandName}
                disabled={dialogMode === 'view' || loading}
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
                placeholder="Nhập mô tả cho thương hiệu..."
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Logo URL"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleInputChange}
                disabled={dialogMode === 'view' || loading}
                placeholder="https://example.com/logo.png"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Image className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                error={!!formErrors.website}
                helperText={formErrors.website}
                disabled={dialogMode === 'view' || loading}
                placeholder="https://example.com"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LinkIcon className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
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

            {formData.logoUrl && (
              <Grid item xs={12}>
                <Typography variant="body2" className="mb-2">Preview logo:</Typography>
                <Avatar
                  src={formData.logoUrl}
                  alt="Logo preview"
                  sx={{ width: 64, height: 64 }}
                >
                  {formData.brandName.charAt(0)}
                </Avatar>
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
              {dialogMode === 'create' ? 'Tạo thương hiệu' : 'Cập nhật'}
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
            Bạn có chắc chắn muốn xóa thương hiệu "{selectedBrand?.brandName}"?
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

export default BrandManagement;