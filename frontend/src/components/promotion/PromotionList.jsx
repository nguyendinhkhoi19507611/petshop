//frontend/src/components/promotion/PromotionList.jsx
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
  Fab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
} from '@mui/material';
import { Add, Search, Refresh, LocalOffer } from '@mui/icons-material';
import PromotionCard from './PromotionCard';
import PromotionForm from './PromotionForm';
import { promotionService } from '../../services/promotionService';
import { useAuth } from '../../contexts/AuthContext';

const PromotionList = () => {
  const { isAdmin } = useAuth();
  
  // State management
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tabValue, setTabValue] = useState(0);
  
  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedPromotion, setSelectedPromotion] = useState(null);

  const statusTabs = [
    { label: 'Tất cả', value: '' },
    { label: 'Đang hoạt động', value: 'active' },
    { label: 'Sắp diễn ra', value: 'upcoming' },
    { label: 'Đã kết thúc', value: 'expired' },
    { label: 'Đã tắt', value: 'disabled' },
  ];

  useEffect(() => {
    loadPromotions();
  }, [page, searchTerm, statusFilter]);

  const loadPromotions = async () => {
    try {
      setLoading(true);
      const response = await promotionService.getAll({
        page: page - 1,
        size: 12,
        search: searchTerm,
        status: statusFilter || null,
      });

      if (response.data.success) {
        setPromotions(response.data.data);
        setTotalPages(response.data.metadata?.totalPages || 0);
      } else {
        setError(response.data.message || 'Không thể tải danh sách khuyến mãi');
      }
    } catch (err) {
      setError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormMode('create');
    setSelectedPromotion(null);
    setFormOpen(true);
  };

  const handleEdit = (promotion) => {
    setFormMode('edit');
    setSelectedPromotion(promotion);
    setFormOpen(true);
  };

  const handleView = (promotion) => {
    setFormMode('view');
    setSelectedPromotion(promotion);
    setFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setLoading(true);
      let response;

      if (formMode === 'create') {
        response = await promotionService.create(formData);
      } else if (formMode === 'edit') {
        response = await promotionService.update(selectedPromotion.id, formData);
      }

      if (response.data.success) {
        setSuccess(response.data.message);
        setFormOpen(false);
        loadPromotions();
      } else {
        setError(response.data.message || 'Có lỗi xảy ra');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (promotion) => {
    try {
      const response = await promotionService.toggleStatus(promotion.id);
      if (response.data.success) {
        setSuccess(response.data.message);
        loadPromotions();
      } else {
        setError(response.data.message || 'Không thể thay đổi trạng thái');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi kết nối');
    }
  };

  const handleDelete = async (promotion) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa khuyến mãi "${promotion.promotionName}"?`)) {
      try {
        const response = await promotionService.delete(promotion.id);
        if (response.data.success) {
          setSuccess(response.data.message);
          loadPromotions();
        } else {
          setError(response.data.message || 'Không thể xóa khuyến mãi');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Lỗi kết nối');
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setStatusFilter(statusTabs[newValue].value);
    setPage(1);
  };

  return (
    <Box>
      {/* Header */}
      <Box className="flex items-center justify-between mb-6">
        <Box>
          <Typography variant="h4" className="font-bold text-gray-800 mb-2">
            Quản lý khuyến mãi
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            Quản lý chương trình khuyến mãi và mã giảm giá
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
            Tạo khuyến mãi
          </Button>
        )}
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
      <Card className="mb-6">
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Tìm kiếm khuyến mãi..."
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
                onClick={loadPromotions}
                disabled={loading}
              >
                Làm mới
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Promotions Grid */}
      {loading ? (
        <Box className="text-center py-12">
          <Typography>Đang tải...</Typography>
        </Box>
      ) : promotions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <LocalOffer className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <Typography variant="h6" className="text-gray-500 mb-2">
              {searchTerm ? 'Không tìm thấy khuyến mãi nào' : 'Chưa có khuyến mãi nào'}
            </Typography>
            {isAdmin() && !searchTerm && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreate}
                className="mt-4"
              >
                Tạo khuyến mãi đầu tiên
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <Grid container spacing={3}>
            {promotions.map((promotion) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={promotion.id}>
                <PromotionCard
                  promotion={promotion}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={handleView}
                  onToggleStatus={handleToggleStatus}
                  canEdit={isAdmin()}
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

      {/* Promotion Form Dialog */}
      <PromotionForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        promotion={selectedPromotion}
        mode={formMode}
        loading={loading}
      />

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

export default PromotionList;