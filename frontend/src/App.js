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
import CategoryManagement from './pages/admin/CategoryManagement';
import BrandManagement from './pages/admin/BrandManagement';
import SizeManagement from './pages/admin/SizeManagement';

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
                  
                  {/* Admin routes */}
                  <Route path="/admin/*" element={
                    <ProtectedRoute adminOnly>
                      <Routes>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="categories" element={<CategoryManagement />} />
                        <Route path="brands" element={<BrandManagement />} />
                        <Route path="sizes" element={<SizeManagement />} />
                        {/* Add more admin routes here */}
                      </Routes>
                    </ProtectedRoute>
                  } />
                  
                  {/* Employee routes */}
                  <Route path="/employee/*" element={
                    <ProtectedRoute employeeOnly>
                      <Routes>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="categories" element={<CategoryManagement />} />
                        <Route path="brands" element={<BrandManagement />} />
                        <Route path="sizes" element={<SizeManagement />} />
                        {/* Add more employee routes here */}
                      </Routes>
                    </ProtectedRoute>
                  } />
                  
                  {/* Customer routes */}
                  <Route path="/customer/*" element={
                    <ProtectedRoute requiredRole="KHÁCH HÀNG">
                      <Routes>
                        <Route path="dashboard" element={<Dashboard />} />
                        {/* Add more customer routes here */}
                      </Routes>
                    </ProtectedRoute>
                  } />
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