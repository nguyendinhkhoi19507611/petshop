//frontend/src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Unauthorized from './pages/Unauthorized';
import CartPage from './pages/CartPage';

// Admin pages
import CategoryManagement from './pages/admin/CategoryManagement';
import BrandManagement from './pages/admin/BrandManagement';
import SizeManagement from './pages/admin/SizeManagement';
import ProductTypeManagement from './pages/admin/ProductTypeManagement';
import ProductManagement from './pages/admin/ProductManagement';
import OrderManagement from './pages/admin/OrderManagement';
import PromotionManagement from './pages/admin/PromotionManagement';
import UserManagement from './pages/admin/UserManagement';

// Employee pages
import EmployeeCategoryManagement from './pages/employee/CategoryManagement';
import EmployeeBrandManagement from './pages/employee/BrandManagement';
import EmployeeSizeManagement from './pages/employee/SizeManagement';
import EmployeeProductManagement from './pages/employee/ProductManagement';
import EmployeeOrderManagement from './pages/employee/OrderManagement';

// Customer pages
import ProductsPage from './pages/customer/ProductsPage';
import MyOrdersPage from './pages/customer/MyOrdersPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import AddressManagement from './pages/customer/AddressManagement';

// Shared pages
import ProductDetailPage from './pages/ProductDetailPage';
import UserProfile from './pages/UserProfile';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Box className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Protected routes */}
          <Route path="/*" element={
            <ProtectedRoute>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  
                  {/* Admin routes */}
                  <Route path="/admin/*" element={
                    <ProtectedRoute adminOnly>
                      <Routes>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="categories" element={<CategoryManagement />} />
                        <Route path="brands" element={<BrandManagement />} />
                        <Route path="sizes" element={<SizeManagement />} />
                        <Route path="product-types" element={<ProductTypeManagement />} />
                        <Route path="products" element={<ProductManagement />} />
                        <Route path="orders" element={<OrderManagement />} />
                        <Route path="promotions" element={<PromotionManagement />} />
                        <Route path="users" element={<UserManagement />} />
                      </Routes>
                    </ProtectedRoute>
                  } />
                  
                  {/* Employee routes */}
                  <Route path="/employee/*" element={
                    <ProtectedRoute employeeOnly>
                      <Routes>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="categories" element={<EmployeeCategoryManagement />} />
                        <Route path="brands" element={<EmployeeBrandManagement />} />
                        <Route path="sizes" element={<EmployeeSizeManagement />} />
                        <Route path="products" element={<EmployeeProductManagement />} />
                        <Route path="orders" element={<EmployeeOrderManagement />} />
                      </Routes>
                    </ProtectedRoute>
                  } />
                  
                  {/* Customer routes */}
                  <Route path="/customer/*" element={
                    <ProtectedRoute requiredRole="KHÁCH HÀNG">
                      <Routes>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="addresses" element={<AddressManagement />} />
                      </Routes>
                    </ProtectedRoute>
                  } />

                  {/* Shared customer routes */}
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/my-orders" element={<MyOrdersPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/addresses" element={<AddressManagement />} />
                  
                  {/* 404 page */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </Box>
    </AuthProvider>
  );
}

export default App;