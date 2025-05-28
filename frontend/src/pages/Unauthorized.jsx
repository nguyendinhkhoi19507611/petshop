import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
} from '@mui/material';
import { Lock, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isEmployee } = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    if (isAdmin()) {
      navigate('/admin/dashboard');
    } else if (isEmployee()) {
      navigate('/employee/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <Container maxWidth="sm" className="min-h-screen flex items-center justify-center">
      <Card className="w-full shadow-xl">
        <CardContent className="p-8 text-center">
          {/* Icon */}
          <Box className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-red-600" />
          </Box>

          {/* Title */}
          <Typography variant="h4" className="font-bold text-gray-800 mb-4">
            Truy cập bị từ chối
          </Typography>

          {/* Message */}
          <Typography variant="body1" className="text-gray-600 mb-6">
            Xin lỗi, bạn không có quyền truy cập vào trang này. 
            {user && (
              <>
                <br />
                Tài khoản của bạn: <strong>{user.username}</strong> ({user.role})
              </>
            )}
          </Typography>

          {/* Actions */}
          <Box className="space-y-3">
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleGoHome}
              className="rounded-xl"
            >
              Về trang chủ
            </Button>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={handleGoBack}
              startIcon={<ArrowBack />}
              className="rounded-xl"
            >
              Quay lại
            </Button>
          </Box>

          {/* Help Text */}
          <Box className="mt-6 p-4 bg-gray-50 rounded-lg">
            <Typography variant="caption" className="text-gray-600">
              Nếu bạn cho rằng đây là lỗi, vui lòng liên hệ với quản trị viên hệ thống.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Unauthorized;