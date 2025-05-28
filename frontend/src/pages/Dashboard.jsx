import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Users,
  Package,
  DollarSign,
  Eye,
  Edit,
  MapPin,
  Gift,
  BarChart3,
  MessageCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { dashboardAPI } from '../services/api';

// Dashboard Statistics Card Component
const StatCard = ({ title, value, growth, icon: Icon, color = 'primary', onClick }) => {
  const isPositive = growth > 0;
  
  const formatValue = (val) => {
    if (typeof val === 'number' && val >= 1000000) {
      return (val / 1000000).toFixed(1) + 'M';
    }
    if (typeof val === 'number' && val >= 1000) {
      return (val / 1000).toFixed(1) + 'K';
    }
    return val?.toLocaleString() || '0';
  };

  return (
    <Card 
      className={`h-full ${onClick ? 'cursor-pointer hover:shadow-lg' : ''} transition-shadow`}
      onClick={onClick}
    >
      <CardContent>
        <Box className="flex items-center justify-between mb-4">
          <Box className={`p-3 rounded-lg bg-${color}-50`}>
            <Icon className={`w-6 h-6 text-${color}-600`} />
          </Box>
          <Box className="text-right">
            <Typography variant="h4" className="font-bold text-gray-800">
              {formatValue(value)}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              {title}
            </Typography>
          </Box>
        </Box>
        <Box className="flex items-center">
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
          )}
          <Typography
            variant="body2"
            className={isPositive ? 'text-green-600' : 'text-red-600'}
          >
            {Math.abs(growth)}% so với tháng trước
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

// Order Status Chip Component
const OrderStatusChip = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'HOÀN_THÀNH': return 'success';
      case 'ĐANG_GIAO': return 'info';
      case 'ĐANG_CHUẨN_BỊ': return 'warning';
      case 'CHỜ_XỬ_LÝ': return 'default';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'CHỜ_XỬ_LÝ': 'Chờ xử lý',
      'ĐÃ_XÁC_NHẬN': 'Đã xác nhận',
      'ĐANG_CHUẨN_BỊ': 'Đang chuẩn bị',
      'ĐANG_GIAO': 'Đang giao',
      'HOÀN_THÀNH': 'Hoàn thành',
      'ĐÃ_HỦY': 'Đã hủy',
    };
    return labels[status] || status;
  };

  return (
    <Chip
      label={getStatusLabel(status)}
      size="small"
      color={getStatusColor(status)}
      variant="outlined"
    />
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isEmployee, isCustomer } = useAuth();
  
  // State for dashboard data
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      if (isAdmin()) {
        // Load admin dashboard data
        const [statsResponse, ordersResponse, productsResponse] = await Promise.all([
          dashboardAPI.getStats(),
          dashboardAPI.getRecentOrders({ size: 5 }),
          dashboardAPI.getTopProducts({ size: 4 })
        ]);

        if (statsResponse.data.success) {
          setStats(statsResponse.data.data);
        }

        if (ordersResponse.data.success) {
          setRecentOrders(ordersResponse.data.data);
        }

        if (productsResponse.data.success) {
          setTopProducts(productsResponse.data.data);
        }
      } else if (isCustomer()) {
        // Load customer dashboard data (recent orders only)
        const ordersResponse = await dashboardAPI.getRecentOrders({ size: 5 });
        if (ordersResponse.data.success) {
          setRecentOrders(ordersResponse.data.data);
        }
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getQuickActions = () => {
    if (isAdmin()) {
      return [
        { title: 'Thêm sản phẩm', icon: Package, path: '/admin/products', color: 'bg-blue-500' },
        { title: 'Quản lý người dùng', icon: Users, path: '/admin/users', color: 'bg-green-500' },
        { title: 'Xem đơn hàng', icon: ShoppingCart, path: '/admin/orders', color: 'bg-orange-500' },
        { title: 'Khuyến mãi', icon: Gift, path: '/admin/promotions', color: 'bg-purple-500' },
        { title: 'Báo cáo', icon: BarChart3, path: '/admin/reports', color: 'bg-red-500' },
        { title: 'Danh mục', icon: Package, path: '/admin/categories', color: 'bg-indigo-500' },
      ];
    } else if (isEmployee()) {
      return [
        { title: 'Xử lý đơn hàng', icon: ShoppingCart, path: '/employee/orders', color: 'bg-orange-500' },
        { title: 'Cập nhật sản phẩm', icon: Package, path: '/employee/products', color: 'bg-blue-500' },
        { title: 'Hỗ trợ khách hàng', icon: MessageCircle, path: '/employee/support', color: 'bg-green-500' },
        { title: 'Danh mục', icon: Package, path: '/employee/categories', color: 'bg-indigo-500' },
      ];
    } else if (isCustomer()) {
      return [
        { title: 'Xem sản phẩm', icon: Package, path: '/products', color: 'bg-blue-500' },
        { title: 'Giỏ hàng', icon: ShoppingCart, path: '/cart', color: 'bg-orange-500' },
        { title: 'Đơn hàng của tôi', icon: ShoppingCart, path: '/my-orders', color: 'bg-green-500' },
        { title: 'Địa chỉ', icon: MapPin, path: '/addresses', color: 'bg-purple-500' },
        { title: 'Hỗ trợ', icon: MessageCircle, path: '/support', color: 'bg-red-500' },
      ];
    }
    return [];
  };

  if (loading) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="space-y-6">
      {/* Welcome Section */}
      <Box>
        <Typography variant="h4" className="font-bold text-gray-800 mb-2">
          Dashboard
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          {isCustomer() 
            ? `Chào mừng trở lại, ${user?.fullName || user?.username}!`
            : 'Tổng quan hệ thống Pet Shop Management'
          }
        </Typography>
      </Box>

      {/* Stats Cards - Admin Only */}
      {isAdmin() && stats && (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Doanh thu"
              value={stats.totalRevenue}
              growth={stats.revenueGrowth}
              icon={DollarSign}
              color="green"
              onClick={() => navigate('/admin/reports')}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Đơn hàng"
              value={stats.totalOrders}
              growth={stats.ordersGrowth}
              icon={ShoppingCart}
              color="blue"
              onClick={() => navigate('/admin/orders')}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Sản phẩm"
              value={stats.totalProducts}
              growth={stats.productsGrowth}
              icon={Package}
              color="purple"
              onClick={() => navigate('/admin/products')}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Khách hàng"
              value={stats.totalCustomers}
              growth={stats.customersGrowth}
              icon={Users}
              color="orange"
              onClick={() => navigate('/admin/users')}
            />
          </Grid>
        </Grid>
      )}

      <Grid container spacing={3}>
        {/* Recent Orders */}
        <Grid item xs={12} lg={isAdmin() ? 8 : 12}>
          <Card>
            <CardContent>
              <Box className="flex items-center justify-between mb-4">
                <Typography variant="h6" className="font-semibold">
                  {isCustomer() ? 'Đơn hàng gần đây' : 'Đơn hàng mới nhất'}
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => navigate(isCustomer() ? '/my-orders' : isAdmin() ? '/admin/orders' : '/employee/orders')}
                >
                  Xem tất cả
                </Button>
              </Box>
              
              {recentOrders.length === 0 ? (
                <Box className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <Typography variant="body1" className="text-gray-500">
                    Chưa có đơn hàng nào
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Mã đơn hàng</TableCell>
                        {!isCustomer() && <TableCell>Khách hàng</TableCell>}
                        <TableCell>Tổng tiền</TableCell>
                        <TableCell>Trạng thái</TableCell>
                        <TableCell>Ngày</TableCell>
                        <TableCell align="right">Thao tác</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentOrders.map((order) => (
                        <TableRow key={order.id} hover>
                          <TableCell>
                            <Typography variant="body2" className="font-medium text-blue-600">
                              {order.orderCode}
                            </Typography>
                          </TableCell>
                          {!isCustomer() && (
                            <TableCell>{order.customerName || order.userName}</TableCell>
                          )}
                          <TableCell>
                            <Typography variant="body2" className="font-medium">
                              {formatCurrency(order.totalAmount)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <OrderStatusChip status={order.status} />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" className="text-gray-600">
                              {formatDate(order.orderDate)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Button 
                              size="small" 
                              variant="outlined" 
                              startIcon={<Eye className="w-4 h-4" />}
                              onClick={() => {
                                // Navigate to order detail
                                if (isCustomer()) {
                                  navigate(`/my-orders/${order.id}`);
                                } else {
                                  navigate(`/admin/orders/${order.id}`);
                                }
                              }}
                            >
                              Xem
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Top Products - Admin Only */}
        {isAdmin() && (
          <Grid item xs={12} lg={4}>
            <Card className="h-full">
              <CardContent>
                <Typography variant="h6" className="font-semibold mb-4">
                  Sản phẩm bán chạy
                </Typography>
                
                {topProducts.length === 0 ? (
                  <Box className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <Typography variant="body1" className="text-gray-500">
                      Chưa có dữ liệu
                    </Typography>
                  </Box>
                ) : (
                  <Box className="space-y-4">
                    {topProducts.map((product, index) => (
                      <Box key={index} className="flex items-center space-x-3">
                        <Avatar className="bg-gray-100 text-gray-600">
                          {index + 1}
                        </Avatar>
                        <Box className="flex-1 min-w-0">
                          <Typography variant="body2" className="font-medium truncate">
                            {product.productName}
                          </Typography>
                          <Typography variant="caption" className="text-gray-500">
                            Đã bán: {product.soldQuantity || product.sales} sản phẩm
                          </Typography>
                          <Typography variant="caption" className="text-green-600 block">
                            {formatCurrency(product.revenue)}
                          </Typography>
                        </Box>
                        <Box className="flex-shrink-0">
                          {product.trend === 'up' ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          )}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Quick Actions */}
      <Card>
        <CardContent>
          <Typography variant="h6" className="font-semibold mb-4">
            Thao tác nhanh
          </Typography>
          
          <Grid container spacing={2}>
            {getQuickActions().map((action, index) => (
              <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={() => navigate(action.path)}
                  className="h-16 flex-col"
                  startIcon={
                    <Box className={`p-2 rounded-lg ${action.color} text-white mb-1`}>
                      <action.icon className="w-4 h-4" />
                    </Box>
                  }
                >
                  <Typography variant="caption" className="mt-1">
                    {action.title}
                  </Typography>
                </Button>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* System Status - Admin Only */}
      {isAdmin() && (
        <Card>
          <CardContent>
            <Typography variant="h6" className="font-semibold mb-4">
              Trạng thái hệ thống
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box>
                  <Box className="flex items-center justify-between mb-2">
                    <Typography variant="body2" className="font-medium">
                      Server Status
                    </Typography>
                    <Typography variant="body2" className="text-green-600">
                      Online
                    </Typography>
                  </Box>
                  <LinearProgress value={98} variant="determinate" color="success" />
                  <Typography variant="caption" className="text-gray-500 mt-1 block">
                    Uptime: 99.8%
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box>
                  <Box className="flex items-center justify-between mb-2">
                    <Typography variant="body2" className="font-medium">
                      Database
                    </Typography>
                    <Typography variant="body2" className="text-green-600">
                      Connected
                    </Typography>
                  </Box>
                  <LinearProgress value={92} variant="determinate" color="success" />
                  <Typography variant="caption" className="text-gray-500 mt-1 block">
                    Performance: 92%
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box>
                  <Box className="flex items-center justify-between mb-2">
                    <Typography variant="body2" className="font-medium">
                      Storage
                    </Typography>
                    <Typography variant="body2" className="text-orange-600">
                      75% Used
                    </Typography>
                  </Box>
                  <LinearProgress value={75} variant="determinate" color="warning" />
                  <Typography variant="caption" className="text-gray-500 mt-1 block">
                    15.2 GB / 20 GB
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Welcome Guide for Customers */}
      {isCustomer() && (
        <Card>
          <CardContent>
            <Typography variant="h6" className="font-semibold mb-4">
              Khám phá cửa hàng
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box className="p-4 bg-blue-50 rounded-lg">
                  <Package className="w-8 h-8 text-blue-600 mb-2" />
                  <Typography variant="h6" className="font-semibold mb-2">
                    Sản phẩm chất lượng
                  </Typography>
                  <Typography variant="body2" className="text-gray-600 mb-3">
                    Khám phá hàng ngàn sản phẩm chất lượng cao dành cho thú cưng của bạn.
                  </Typography>
                  <Button 
                    variant="contained" 
                    size="small"
                    onClick={() => navigate('/products')}
                  >
                    Xem sản phẩm
                  </Button>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box className="p-4 bg-green-50 rounded-lg">
                  <Gift className="w-8 h-8 text-green-600 mb-2" />
                  <Typography variant="h6" className="font-semibold mb-2">
                    Ưu đãi đặc biệt
                  </Typography>
                  <Typography variant="body2" className="text-gray-600 mb-3">
                    Đừng bỏ lỡ các chương trình khuyến mãi và ưu đãi hấp dẫn.
                  </Typography>
                  <Button 
                    variant="contained" 
                    size="small" 
                    color="success"
                    onClick={() => navigate('/products?filter=on-sale')}
                  >
                    Xem ưu đãi
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card>
          <CardContent>
            <Typography variant="body1" className="text-red-600">
              {error}
            </Typography>
            <Button 
              variant="outlined" 
              onClick={loadDashboardData}
              className="mt-2"
            >
              Thử lại
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Dashboard;