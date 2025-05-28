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
  Trash2,
} from 'lucide-react';
import { USER_ROLES, STORAGE_KEYS } from '../utils/constants';

// Mock data for dashboard
const mockStats = {
  totalRevenue: 125000000,
  totalOrders: 1245,
  totalProducts: 156,
  totalCustomers: 892,
  revenueGrowth: 12.5,
  ordersGrowth: 8.3,
  productsGrowth: -2.1,
  customersGrowth: 15.7,
};

const mockRecentOrders = [
  { id: '#12345', customer: 'Nguyễn Văn An', total: 450000, status: 'Đang giao', date: '2025-01-15' },
  { id: '#12346', customer: 'Trần Thị Hoa', total: 280000, status: 'Hoàn thành', date: '2025-01-15' },
  { id: '#12347', customer: 'Lê Văn Nam', total: 120000, status: 'Chờ xử lý', date: '2025-01-14' },
  { id: '#12348', customer: 'Phạm Thị Mai', total: 380000, status: 'Đang chuẩn bị', date: '2025-01-14' },
  { id: '#12349', customer: 'Hoàng Văn Đức', total: 650000, status: 'Hoàn thành', date: '2025-01-13' },
];

const mockTopProducts = [
  { name: 'Thức ăn khô Royal Canin', sales: 156, revenue: 39000000, trend: 'up' },
  { name: 'Pate Whiskas vị cá ngừ', sales: 234, revenue: 8190000, trend: 'up' },
  { name: 'Vòng cổ chó cao cấp', sales: 89, revenue: 4450000, trend: 'down' },
  { name: 'Đồ chơi cho mèo', sales: 67, revenue: 2010000, trend: 'up' },
];

const StatCard = ({ title, value, growth, icon: Icon, color = 'primary' }) => {
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
    <Card className="h-full">
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

const OrderStatusChip = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Hoàn thành': return 'success';
      case 'Đang giao': return 'info';
      case 'Đang chuẩn bị': return 'warning';
      case 'Chờ xử lý': return 'default';
      default: return 'default';
    }
  };

  return (
    <Chip
      label={status}
      size="small"
      color={getStatusColor(status)}
      variant="outlined"
    />
  );
};

const Dashboard = () => {
  const [userRole, setUserRole] = useState(USER_ROLES.ADMIN);

  useEffect(() => {
    // Get user role from localStorage
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    if (userData) {
      const user = JSON.parse(userData);
      setUserRole(user.role);
    }
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <Box className="space-y-6">
      {/* Welcome Section */}
      <Box>
        <Typography variant="h4" className="font-bold text-gray-800 mb-2">
          Dashboard
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          Tổng quan hệ thống Pet Shop Management
        </Typography>
      </Box>

      {/* Stats Cards */}
      {userRole === USER_ROLES.ADMIN && (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Doanh thu"
              value={mockStats.totalRevenue}
              growth={mockStats.revenueGrowth}
              icon={DollarSign}
              color="green"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Đơn hàng"
              value={mockStats.totalOrders}
              growth={mockStats.ordersGrowth}
              icon={ShoppingCart}
              color="blue"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Sản phẩm"
              value={mockStats.totalProducts}
              growth={mockStats.productsGrowth}
              icon={Package}
              color="purple"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Khách hàng"
              value={mockStats.totalCustomers}
              growth={mockStats.customersGrowth}
              icon={Users}
              color="orange"
            />
          </Grid>
        </Grid>
      )}

      <Grid container spacing={3}>
        {/* Recent Orders */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Box className="flex items-center justify-between mb-4">
                <Typography variant="h6" className="font-semibold">
                  Đơn hàng gần đây
                </Typography>
                <Button variant="outlined" size="small">
                  Xem tất cả
                </Button>
              </Box>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Mã đơn hàng</TableCell>
                      <TableCell>Khách hàng</TableCell>
                      <TableCell>Tổng tiền</TableCell>
                      <TableCell>Trạng thái</TableCell>
                      <TableCell>Ngày</TableCell>
                      <TableCell align="right">Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockRecentOrders.map((order) => (
                      <TableRow key={order.id} hover>
                        <TableCell>
                          <Typography variant="body2" className="font-medium text-blue-600">
                            {order.id}
                          </Typography>
                        </TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>
                          <Typography variant="body2" className="font-medium">
                            {formatCurrency(order.total)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <OrderStatusChip status={order.status} />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" className="text-gray-600">
                            {order.date}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Box className="flex space-x-1">
                            <Button size="small" variant="outlined" startIcon={<Eye className="w-4 h-4" />}>
                              Xem
                            </Button>
                            <Button size="small" variant="outlined" startIcon={<Edit className="w-4 h-4" />}>
                              Sửa
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Products */}
        <Grid item xs={12} lg={4}>
          <Card className="h-full">
            <CardContent>
              <Typography variant="h6" className="font-semibold mb-4">
                Sản phẩm bán chạy
              </Typography>
              
              <Box className="space-y-4">
                {mockTopProducts.map((product, index) => (
                  <Box key={index} className="flex items-center space-x-3">
                    <Avatar className="bg-gray-100 text-gray-600">
                      {index + 1}
                    </Avatar>
                    <Box className="flex-1 min-w-0">
                      <Typography variant="body2" className="font-medium truncate">
                        {product.name}
                      </Typography>
                      <Typography variant="caption" className="text-gray-500">
                        Đã bán: {product.sales} sản phẩm
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Card>
        <CardContent>
          <Typography variant="h6" className="font-semibold mb-4">
            Thao tác nhanh
          </Typography>
          
          <Grid container spacing={2}>
            {userRole === USER_ROLES.ADMIN && (
              <>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<Package />}
                    className="h-12"
                  >
                    Thêm sản phẩm
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<Users />}
                    className="h-12"
                  >
                    Quản lý người dùng
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<ShoppingCart />}
                    className="h-12"
                  >
                    Xem đơn hàng
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<TrendingUp />}
                    className="h-12"
                  >
                    Báo cáo
                  </Button>
                </Grid>
              </>
            )}
            
            {userRole === USER_ROLES.EMPLOYEE && (
              <>
                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<ShoppingCart />}
                    className="h-12"
                  >
                    Xử lý đơn hàng
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<Package />}
                    className="h-12"
                  >
                    Cập nhật kho
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<Users />}
                    className="h-12"
                  >
                    Hỗ trợ khách hàng
                  </Button>
                </Grid>
              </>
            )}

            {userRole === USER_ROLES.CUSTOMER && (
              <>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<Package />}
                    className="h-12"
                  >
                    Xem sản phẩm
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<ShoppingCart />}
                    className="h-12"
                  >
                    Giỏ hàng
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<TrendingUp />}
                    className="h-12"
                  >
                    Đơn hàng của tôi
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<Users />}
                    className="h-12"
                  >
                    Hỗ trợ
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* System Status */}
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
    </Box>
  );
};

export default Dashboard;