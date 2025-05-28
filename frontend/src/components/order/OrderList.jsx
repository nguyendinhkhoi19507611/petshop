//frontend/src/components/order/OrderList.jsx
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
} from '@mui/material';
import { Search, Refresh, FilterList } from '@mui/icons-material';
import { ShoppingCart } from 'lucide-react';
import OrderCard from './OrderCard';
import OrderDetail from './OrderDetail';
import OrderStatusForm from './OrderStatusForm';
import { orderService } from '../../services/orderService';
import { useAuth } from '../../contexts/AuthContext';

const OrderList = ({ variant = 'admin' }) => {
  const { isAdmin, isEmployee, user } = useAuth();
  
  // State management
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tabValue, setTabValue] = useState(0);
  
  // Dialog states
  const [detailOpen, setDetailOpen] = useState(false);
  const [statusFormOpen, setStatusFormOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statusTabs = [
    { label: 'Tất cả', value: '' },
    { label: 'Chờ xử lý', value: 'CHỜ_XỬ_LÝ' },
    { label: 'Đã xác nhận', value: 'ĐÃ_XÁC_NHẬN' },
    { label: 'Đang chuẩn bị', value: 'ĐANG_CHUẨN_BỊ' },
    { label: 'Đang giao', value: 'ĐANG_GIAO' },
    { label: 'Hoàn thành', value: 'HOÀN_THÀNH' },
    { label: 'Đã hủy', value: 'ĐÃ_HỦY' },
  ];

  useEffect(() => {
    loadOrders();
  }, [page, searchTerm, statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      let response;

      if (variant === 'customer') {
        response = await orderService.getMyOrders({
          page: page - 1,
          size: 12,
          status: statusFilter || null,
        });
      } else {
        response = await orderService.getAll({
          page: page - 1,
          size: 12,
          search: searchTerm,
          status: statusFilter || null,
        });
      }

      if (response.data.success) {
        setOrders(response.data.data);
        setTotalPages(response.data.metadata?.totalPages || 0);
      } else {
        setError(response.data.message || 'Không thể tải danh sách đơn hàng');
      }
    } catch (err) {
      setError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (order) => {
    setSelectedOrder(order);
    setDetailOpen(true);
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setStatusFormOpen(true);
  };

  const handleCancel = async (order) => {
    const reason = prompt('Vui lòng nhập lý do hủy đơn hàng:');
    if (!reason) return;

    try {
      setLoading(true);
      let response;

      if (variant === 'customer') {
        response = await orderService.cancelByCustomer(order.id, {
          cancellationReason: reason,
        });
      } else {
        response = await orderService.cancel(order.id, {
          cancellationReason: reason,
        });
      }

      if (response.data.success) {
        setSuccess(response.data.message);
        loadOrders();
      } else {
        setError(response.data.message || 'Không thể hủy đơn hàng');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (statusData) => {
    try {
      setLoading(true);
      const response = await orderService.updateStatus(selectedOrder.id, statusData);

      if (response.data.success) {
        setSuccess(response.data.message);
        setStatusFormOpen(false);
        loadOrders();
      } else {
        setError(response.data.message || 'Không thể cập nhật trạng thái');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setStatusFilter(statusTabs[newValue].value);
    setPage(1);
  };

  const canEdit = isAdmin() || isEmployee();

  return (
    <Box>
      {/* Header */}
      <Box className="flex items-center justify-between mb-6">
        <Box>
          <Typography variant="h4" className="font-bold text-gray-800 mb-2">
            {variant === 'customer' ? 'Đơn hàng của tôi' : 'Quản lý đơn hàng'}
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            {variant === 'customer' 
              ? 'Theo dõi và quản lý đơn hàng của bạn'
              : 'Quản lý đơn hàng trong hệ thống'
            }
          </Typography>
        </Box>
      </Box>

      {/* Status Tabs */}
      <Card className="mb-6">
        <CardContent className="pb-0">
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {statusTabs.map((tab, index) => (
              <Tab key={index} label={tab.label} />
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      {variant !== 'customer' && (
        <Card className="mb-6">
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Tìm kiếm đơn hàng..."
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
              
              <Grid item xs={12} md={6} className="flex justify-end">
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={loadOrders}
                  disabled={loading}
                >
                  Làm mới
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Orders Grid */}
      {loading ? (
        <Box className="text-center py-12">
          <Typography>Đang tải...</Typography>
        </Box>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <Typography variant="h6" className="text-gray-500 mb-2">
              {searchTerm ? 'Không tìm thấy đơn hàng nào' : 'Chưa có đơn hàng nào'}
            </Typography>
            {variant === 'customer' && (
              <Button
                variant="contained"
                href="/products"
                className="mt-4"
              >
                Mua sắm ngay
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <Grid container spacing={3}>
            {orders.map((order) => (
              <Grid item xs={12} sm={6} lg={4} key={order.id}>
                <OrderCard
                  order={order}
                  onView={handleView}
                  onEdit={handleEdit}
                  onCancel={handleCancel}
                  onUpdateStatus={handleEdit}
                  canEdit={canEdit}
                  variant={variant}
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

      {/* Order Detail Dialog */}
      <OrderDetail
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        order={selectedOrder}
        onUpdateStatus={handleEdit}
        canEdit={canEdit}
      />

      {/* Order Status Form Dialog */}
      <OrderStatusForm
        open={statusFormOpen}
        onClose={() => setStatusFormOpen(false)}
        onSubmit={handleUpdateStatus}
        order={selectedOrder}
        loading={loading}
      />

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

export default OrderList;