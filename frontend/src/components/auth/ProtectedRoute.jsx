import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  fallback = '/login',
  adminOnly = false,
  employeeOnly = false 
}) => {
  const { isAuthenticated, isLoading, user, hasRole, isAdmin, isEmployee } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box 
        className="flex items-center justify-center min-h-screen"
        sx={{ bgcolor: 'background.default' }}
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={fallback} state={{ from: location }} replace />;
  }

  // Check admin-only access
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check employee-only access (includes admin)
  if (employeeOnly && !isEmployee() && !isAdmin()) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check specific role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;