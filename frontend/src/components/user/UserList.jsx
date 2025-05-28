//frontend/src/components/user/UserList.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
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
  TextField,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Edit,
  Delete,
  Search,
  MoreVert,
  Visibility,
  VisibilityOff,
  Refresh,
  PersonAdd,
  VpnKey,
} from '@mui/icons-material';
import { Users } from 'lucide-react';
import { userService } from '../../services/userService';
import { useAuth } from '../../contexts/AuthContext';

const UserList = () => {
  const { isAdmin } = useAuth();
  
  // State management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  
  // Search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  
  // Dialog states
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  
  // Menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuUser, setMenuUser] = useState(null);

  const roles = [
    { value: 'ADMIN', label: 'Quản trị viên' },
    { value: 'NHÂN VIÊN', label: 'Nhân viên' },
    { value: 'KHÁCH HÀNG', label: 'Khách hàng' },
  ];

  // Load users on component mount and when dependencies change
  useEffect(() => {
    loadUsers();
  }, [page, rowsPerPage, searchTerm, roleFilter, statusFilter]);

  // Debounced search
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    setSearchTimeout(setTimeout(() => {
      if (page !== 0) {
        setPage(0);
      } else {
        loadUsers();
      }
    }, 500));

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTerm]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAll({
        page,
        size: rowsPerPage,
        search: searchTerm,
        role: roleFilter || null,
        status: statusFilter || null,
      });

      if (response.data.success) {
        setUsers(response.data.data);
        setTotalElements(response.data.metadata?.totalElements || 0);
      } else {
        setError(response.data.message || 'Không thể tải danh sách người dùng');
      }
    } catch (err) {
      setError('Lỗi kết nối. Vui lòng thử lại.');
      console.error('Load users error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      setLoading(true);
      const response = await userService.toggleStatus(user.id);

      if (response.data.success) {
        setSuccess(response.data.message);
        loadUsers();
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

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      const response = await userService.delete(selectedUser.id);

      if (response.data.success) {
        setSuccess(response.data.message);
        setDeleteDialogOpen(false);
        loadUsers();
      } else {
        setError(response.data.message || 'Không thể xóa người dùng');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Lỗi kết nối';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    try {
      setLoading(true);
      const response = await userService.resetPassword(selectedUser.id, newPassword);

      if (response.data.success) {
        setSuccess(response.data.message);
        setResetPasswordDialogOpen(false);
        setNewPassword('');
      } else {
        setError(response.data.message || 'Không thể đặt lại mật khẩu');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Lỗi kết nối';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (event, user) => {
    setAnchorEl(event.currentTarget);
    setMenuUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuUser(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusChip = (status) => {
    return (
      <Chip
        label={status ? 'Hoạt động' : 'Bị khóa'}
        color={status ? 'success' : 'error'}
        size="small"
        variant="outlined"
      />
    );
  };

  const getRoleChip = (role) => {
    const roleConfig = {
      'ADMIN': { label: 'Quản trị viên', color: 'error' },
      'NHÂN VIÊN': { label: 'Nhân viên', color: 'warning' },
      'KHÁCH HÀNG': { label: 'Khách hàng', color: 'info' },
    };

    const config = roleConfig[role] || { label: role, color: 'default' };
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        variant="filled"
      />
    );
  };

  const getUserAvatar = (user) => {
    return (
      <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
        {user.fullName ? user.fullName.charAt(0) : user.username.charAt(0)}
      </Avatar>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (!isAdmin()) {
    return (
      <Box className="text-center py-12">
        <Typography variant="h6" className="text-gray-500">
          Bạn không có quyền truy cập trang này
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box className="flex items-center justify-between mb-6">
        <Box>
          <Typography variant="h4" className="font-bold text-gray-800 mb-2">
            Quản lý người dùng
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            Quản lý tài khoản người dùng trong hệ thống
          </Typography>
        </Box>
      </Box>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Tìm kiếm người dùng..."
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
                <InputLabel>Vai trò</InputLabel>
                <Select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  label="Vai trò"
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  {roles.map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      {role.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                  <MenuItem value="false">Bị khóa</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3} className="flex justify-end">
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={loadUsers}
                disabled={loading}
              >
                Làm mới
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Người dùng</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Vai trò</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Trạng thái</TableCell>
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
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" className="py-8">
                    <Box className="text-center">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <Typography variant="body1" className="text-gray-500">
                        {searchTerm ? 'Không tìm thấy người dùng nào' : 'Chưa có người dùng nào'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box className="flex items-center space-x-3">
                        {getUserAvatar(user)}
                        <Box>
                          <Typography variant="body2" className="font-medium">
                            {user.fullName || user.username}
                          </Typography>
                          <Typography variant="caption" className="text-gray-500">
                            @{user.username}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {getRoleChip(user.roleName)}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" className="text-gray-600">
                        {formatDate(user.createdDate)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {getStatusChip(user.status)}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={(e) => handleMenuClick(e, user)}
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
        <MenuItem onClick={() => handleToggleStatus(menuUser)}>
          {menuUser?.status ? (
            <>
              <VisibilityOff className="mr-2" fontSize="small" />
              Khóa tài khoản
            </>
          ) : (
            <>
              <Visibility className="mr-2" fontSize="small" />
              Mở khóa tài khoản
            </>
          )}
        </MenuItem>
        
        <MenuItem 
          onClick={() => {
            setSelectedUser(menuUser);
            setResetPasswordDialogOpen(true);
            setAnchorEl(null);
          }}
        >
          <VpnKey className="mr-2" fontSize="small" />
          Đặt lại mật khẩu
        </MenuItem>
        
        <MenuItem 
          onClick={() => {
            setSelectedUser(menuUser);
            setDeleteDialogOpen(true);
            setAnchorEl(null);
          }}
          className="text-red-600"
        >
          <Delete className="mr-2" fontSize="small" />
          Xóa người dùng
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa người dùng "{selectedUser?.fullName || selectedUser?.username}"?
          </Typography>
          <Typography variant="body2" className="text-red-600 mt-2">
            Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu liên quan.
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

      {/* Reset Password Dialog */}
      <Dialog
        open={resetPasswordDialogOpen}
        onClose={() => setResetPasswordDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Đặt lại mật khẩu</DialogTitle>
        <DialogContent>
          <Typography className="mb-4">
            Đặt lại mật khẩu cho người dùng "{selectedUser?.fullName || selectedUser?.username}"
          </Typography>
          <TextField
            fullWidth
            label="Mật khẩu mới"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            helperText="Mật khẩu phải có ít nhất 6 ký tự"
            disabled={loading}
            className="mt-4"
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setResetPasswordDialogOpen(false);
              setNewPassword('');
            }} 
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            onClick={handleResetPassword}
            variant="contained"
            disabled={loading || !newPassword}
          >
            Đặt lại mật khẩu
          </Button>
        </DialogActions>
      </Dialog>

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

export default UserList;