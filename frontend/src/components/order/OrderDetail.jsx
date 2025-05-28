import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stepper,
  Step,
  StepLabel,
  Paper,
} from '@mui/material';
import {
  Receipt,
  LocalShipping,
  Payment,
  Person,
  Schedule,
} from '@mui/icons-material';

const OrderDetail = ({ 
  open, 
  onClose, 
  order,
  onUpdateStatus,
  canEdit = false 
}) => {
  if (!order) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusSteps = () => {
    return [
      { label: 'Chờ xử lý', key: 'CHỜ_XỬ_LÝ' },
      { label: 'Đã xác nhận', key: 'ĐÃ_XÁC_NHẬN' },
      { label: 'Đang chuẩn bị', key: 'ĐANG_CHUẨN_BỊ' },
      { label: 'Đang giao', key: 'ĐANG_GIAO' },
      { label: 'Hoàn thành', key: 'HOÀN_THÀNH' },
    ];
  };

  const getActiveStep = () => {
    const steps = getStatusSteps();
    return steps.findIndex(step => step.key === order.status);
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      'CHỜ_XỬ_LÝ': { label: 'Chờ xử lý', color: 'default' },
      'ĐÃ_XÁC_NHẬN': { label: 'Đã xác nhận', color: 'info' },
      'ĐANG_CHUẨN_BỊ': { label: 'Đang chuẩn bị', color: 'warning' },
      'ĐANG_GIAO': { label: 'Đang giao', color: 'primary' },
      'HOÀN_THÀNH': { label: 'Hoàn thành', color: 'success' },
      'ĐÃ_HỦY': { label: 'Đã hủy', color: 'error' },
    };

    const config = statusConfig[status] || { label: status, color: 'default' };
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="medium"
        variant="filled"
      />
    );
  };

  const getPaymentMethodLabel = (method) => {
    const methods = {
      'COD': 'Thanh toán khi nhận hàng',
      'BANK_TRANSFER': 'Chuyển khoản ngân hàng',
      'CREDIT_CARD': 'Thẻ tín dụng',
      'E_WALLET': 'Ví điện tử',
    };
    return methods[method] || method;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box className="flex items-center justify-between">
          <Box className="flex items-center space-x-2">
            <Receipt />
            <Typography variant="h6">
              Chi tiết đơn hàng {order.orderCode}
            </Typography>
          </Box>
          {getStatusChip(order.status)}
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Order Progress */}
          {order.status !== 'ĐÃ_HỦY' && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" className="mb-4">
                    Tiến độ đơn hàng
                  </Typography>
                  <Stepper activeStep={getActiveStep()} alternativeLabel>
                    {getStatusSteps().map((step) => (
                      <Step key={step.key}>
                        <StepLabel>{step.label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Order Info */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="mb-3 flex items-center">
                  <Schedule className="mr-2" />
                  Thông tin đơn hàng
                </Typography>
                
                <Box className="space-y-2">
                  <Box className="flex justify-between">
                    <Typography variant="body2" className="text-gray-600">
                      Mã đơn hàng:
                    </Typography>
                    <Typography variant="body2" className="font-medium">
                      {order.orderCode}
                    </Typography>
                  </Box>
                  
                  <Box className="flex justify-between">
                    <Typography variant="body2" className="text-gray-600">
                      Ngày đặt:
                    </Typography>
                    <Typography variant="body2" className="font-medium">
                      {formatDate(order.orderDate)}
                    </Typography>
                  </Box>
                  
                  {order.confirmedAt && (
                    <Box className="flex justify-between">
                      <Typography variant="body2" className="text-gray-600">
                        Ngày xác nhận:
                      </Typography>
                      <Typography variant="body2" className="font-medium">
                        {formatDate(order.confirmedAt)}
                      </Typography>
                    </Box>
                  )}
                  
                  {order.shippedAt && (
                    <Box className="flex justify-between">
                      <Typography variant="body2" className="text-gray-600">
                        Ngày giao:
                      </Typography>
                      <Typography variant="body2" className="font-medium">
                        {formatDate(order.shippedAt)}
                      </Typography>
                    </Box>
                  )}
                  
                  {order.completedAt && (
                    <Box className="flex justify-between">
                      <Typography variant="body2" className="text-gray-600">
                        Ngày hoàn thành:
                      </Typography>
                      <Typography variant="body2" className="font-medium">
                        {formatDate(order.completedAt)}
                      </Typography>
                    </Box>
                  )}
                  
                  {order.trackingNumber && (
                    <Box className="flex justify-between">
                      <Typography variant="body2" className="text-gray-600">
                        Mã vận đơn:
                      </Typography>
                      <Typography variant="body2" className="font-medium text-blue-600">
                        {order.trackingNumber}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Customer & Shipping Info */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="mb-3 flex items-center">
                  <Person className="mr-2" />
                  Thông tin khách hàng
                </Typography>
                
                <Box className="space-y-2 mb-4">
                  <Box className="flex justify-between">
                    <Typography variant="body2" className="text-gray-600">
                      Tên khách hàng:
                    </Typography>
                    <Typography variant="body2" className="font-medium">
                      {order.userName}
                    </Typography>
                  </Box>
                  
                  <Box className="flex justify-between">
                    <Typography variant="body2" className="text-gray-600">
                      Email:
                    </Typography>
                    <Typography variant="body2" className="font-medium">
                      {order.userEmail}
                    </Typography>
                  </Box>
                </Box>

                <Divider className="my-3" />

                <Typography variant="subtitle2" className="mb-2 flex items-center">
                  <LocalShipping className="mr-2" />
                  Thông tin giao hàng
                </Typography>
                
                <Box className="space-y-2">
                  <Typography variant="body2">
                    <strong>Người nhận:</strong> {order.receiverName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>SĐT:</strong> {order.receiverPhone}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Địa chỉ:</strong> {order.shippingAddress}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Payment Info */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="mb-3 flex items-center">
                  <Payment className="mr-2" />
                  Thông tin thanh toán
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box className="flex justify-between">
                      <Typography variant="body2" className="text-gray-600">
                        Phương thức:
                      </Typography>
                      <Typography variant="body2" className="font-medium">
                        {getPaymentMethodLabel(order.paymentMethod)}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box className="flex justify-between">
                      <Typography variant="body2" className="text-gray-600">
                        Trạng thái:
                      </Typography>
                      <Chip
                        label={order.paymentStatus === 'ĐÃ_THANH_TOÁN' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                        color={order.paymentStatus === 'ĐÃ_THANH_TOÁN' ? 'success' : 'warning'}
                        size="small"
                      />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Order Items */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="mb-3">
                  Sản phẩm đã đặt ({order.orderItems?.length || 0} sản phẩm)
                </Typography>
                
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Sản phẩm</TableCell>
                        <TableCell align="center">Số lượng</TableCell>
                        <TableCell align="right">Đơn giá</TableCell>
                        <TableCell align="right">Thành tiền</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {order.orderItems?.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Box className="flex items-center space-x-3">
                              <Avatar
                                src={item.productImage}
                                alt={item.productName}
                                variant="rounded"
                                sx={{ width: 50, height: 50 }}
                              />
                              <Box>
                                <Typography variant="body2" className="font-medium">
                                  {item.productName}
                                </Typography>
                                {item.sku && (
                                  <Typography variant="caption" className="text-gray-500">
                                    SKU: {item.sku}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            {item.quantity}
                          </TableCell>
                          <TableCell align="right">
                            <Box>
                              {item.salePriceAtTime && item.salePriceAtTime < item.priceAtTime ? (
                                <>
                                  <Typography variant="body2" className="font-medium text-red-600">
                                    {formatPrice(item.salePriceAtTime)}
                                  </Typography>
                                  <Typography variant="caption" className="text-gray-500 line-through">
                                    {formatPrice(item.priceAtTime)}
                                  </Typography>
                                </>
                              ) : (
                                <Typography variant="body2" className="font-medium">
                                  {formatPrice(item.priceAtTime)}
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" className="font-medium">
                              {formatPrice(item.subtotal)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="mb-3">
                  Tóm tắt đơn hàng
                </Typography>
                
                <Box className="space-y-2 max-w-md ml-auto">
                  <Box className="flex justify-between">
                    <Typography variant="body2">Tạm tính:</Typography>
                    <Typography variant="body2">{formatPrice(order.subtotal)}</Typography>
                  </Box>
                  
                  <Box className="flex justify-between">
                    <Typography variant="body2">Phí vận chuyển:</Typography>
                    <Typography variant="body2">
                      {order.shippingFee > 0 ? formatPrice(order.shippingFee) : 'Miễn phí'}
                    </Typography>
                  </Box>
                  
                  {order.discount > 0 && (
                    <>
                      <Box className="flex justify-between text-green-600">
                        <Typography variant="body2">Giảm giá:</Typography>
                        <Typography variant="body2">-{formatPrice(order.discount)}</Typography>
                      </Box>
                      
                      {order.couponCode && (
                        <Box className="flex justify-between">
                          <Typography variant="caption" className="text-gray-500">
                            Mã giảm giá:
                          </Typography>
                          <Typography variant="caption" className="text-gray-500">
                            {order.couponCode}
                          </Typography>
                        </Box>
                      )}
                    </>
                  )}
                  
                  <Divider />
                  
                  <Box className="flex justify-between">
                    <Typography variant="h6" className="font-bold">
                      Tổng cộng:
                    </Typography>
                    <Typography variant="h6" className="font-bold text-primary-600">
                      {formatPrice(order.totalAmount)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Notes */}
          {order.notes && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" className="mb-2">
                    Ghi chú
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    {order.notes}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Cancellation Reason */}
          {order.status === 'ĐÃ_HỦY' && order.cancellationReason && (
            <Grid item xs={12}>
              <Card className="border-red-200">
                <CardContent>
                  <Typography variant="h6" className="mb-2 text-red-600">
                    Lý do hủy đơn hàng
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    {order.cancellationReason}
                  </Typography>
                  {order.cancelledAt && (
                    <Typography variant="caption" className="text-gray-500 block mt-2">
                      Hủy lúc: {formatDate(order.cancelledAt)}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Đóng
        </Button>
        
        {canEdit && order.status !== 'ĐÃ_HỦY' && order.status !== 'HOÀN_THÀNH' && (
          <Button
            variant="contained"
            onClick={() => onUpdateStatus(order)}
          >
            Cập nhật trạng thái
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetail;
