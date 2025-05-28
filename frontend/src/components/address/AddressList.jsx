import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  Snackbar,
  Fab,
} from '@mui/material';
import { Add, Home } from '@mui/icons-material';
import AddressCard from './AddressCard';
import AddressForm from './AddressForm';
import { addressService } from '../../services/addressService';
import { useAuth } from '../../contexts/AuthContext';

const AddressList = ({ userId = null, showHeader = true, canEdit = true }) => {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;
  
  // State management
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    if (targetUserId) {
      loadAddresses();
    }
  }, [targetUserId]);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const response = await addressService.getUserAddresses(targetUserId);

      if (response.data.success) {
        setAddresses(response.data.data || []);
      } else {
        setError(response.data.message || 'Không thể tải danh sách địa chỉ');
      }
    } catch (err) {
      setError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormMode('create');
    setSelectedAddress(null);
    setFormOpen(true);
  };

  const handleEdit = (address) => {
    setFormMode('edit');
    setSelectedAddress(address);
    setFormOpen(true);
  };

  const handleView = (address) => {
    setFormMode('view');
    setSelectedAddress(address);
    setFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setLoading(true);
      let response;

      if (formMode === 'create') {
        response = await addressService.createAddress(targetUserId, formData);
      } else if (formMode === 'edit') {
        response = await addressService.updateAddress(selectedAddress.id, formData);
      }

      if (response.data.success) {
        setSuccess(response.data.message);
        setFormOpen(false);
        loadAddresses();
      } else {
        setError(response.data.message || 'Có lỗi xảy ra');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (address) => {
    try {
      const response = await addressService.setDefaultAddress(address.id);
      if (response.data.success) {
        setSuccess('Đã đặt làm địa chỉ mặc định');
        loadAddresses();
      } else {
        setError(response.data.message || 'Không thể đặt làm địa chỉ mặc định');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi kết nối');
    }
  };

  const handleDelete = async (address) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa địa chỉ này?`)) {
      try {
        const response = await addressService.deleteAddress(address.id);
        if (response.data.success) {
          setSuccess('Đã xóa địa chỉ');
          loadAddresses();
        } else {
          setError(response.data.message || 'Không thể xóa địa chỉ');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Lỗi kết nối');
      }
    }
  };

  return (
    <Box>
      {/* Header */}
      {showHeader && (
        <Box className="flex items-center justify-between mb-6">
          <Box>
            <Typography variant="h4" className="font-bold text-gray-800 mb-2">
              Sổ địa chỉ
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Quản lý địa chỉ giao hàng của bạn
            </Typography>
          </Box>
          
          {canEdit && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleCreate}
              size="large"
              className="rounded-lg"
            >
              Thêm địa chỉ
            </Button>
          )}
        </Box>
      )}

      {/* Addresses Grid */}
      {loading ? (
        <Box className="text-center py-12">
          <Typography>Đang tải...</Typography>
        </Box>
      ) : addresses.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <Typography variant="h6" className="text-gray-500 mb-2">
              Chưa có địa chỉ nào
            </Typography>
            <Typography variant="body2" className="text-gray-400 mb-4">
              Thêm địa chỉ để dễ dàng đặt hàng và giao hàng
            </Typography>
            {canEdit && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreate}
                className="mt-4"
              >
                Thêm địa chỉ đầu tiên
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {addresses.map((address) => (
            <Grid item xs={12} md={6} lg={4} key={address.id}>
              <AddressCard
                address={address}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                onSetDefault={handleSetDefault}
                canEdit={canEdit}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Address Form Dialog */}
      <AddressForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        address={selectedAddress}
        mode={formMode}
        loading={loading}
        userId={targetUserId}
      />

      {/* Floating Action Button for Mobile */}
      {canEdit && (
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

export default AddressList;