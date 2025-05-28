package com.petshop.service;

import com.petshop.dto.*;
import com.petshop.entity.*;
import com.petshop.exception.ResourceNotFoundException;
import com.petshop.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PromotionService promotionService;

    // Lấy tất cả đơn hàng (Admin/Employee)
    public ApiResponse<List<OrderDTO>> getAllOrders(int page, int size, String search, Order.OrderStatus status) {
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "orderDate"));
            Page<Order> orderPage;

            if (status != null) {
                orderPage = orderRepository.findByStatusOrderByOrderDateDesc(status, pageable);
            } else if (search != null && !search.trim().isEmpty()) {
                orderPage = orderRepository.searchOrders(search.trim(), pageable);
            } else {
                orderPage = orderRepository.findAll(pageable);
            }

            List<OrderDTO> orderDTOs = orderPage.getContent().stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            Map<String, Object> metadata = new HashMap<>();
            metadata.put("totalElements", orderPage.getTotalElements());
            metadata.put("totalPages", orderPage.getTotalPages());
            metadata.put("currentPage", page);
            metadata.put("pageSize", size);
            metadata.put("hasNext", orderPage.hasNext());
            metadata.put("hasPrevious", orderPage.hasPrevious());

            ApiResponse<List<OrderDTO>> response = ApiResponse.success("Lấy danh sách đơn hàng thành công", orderDTOs);
            response.setMetadata(metadata);

            return response;
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lấy danh sách đơn hàng: " + e.getMessage());
        }
    }

    // Lấy đơn hàng theo ID
    public ApiResponse<OrderDTO> getOrderById(Long orderId) {
        try {
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với ID: " + orderId));

            OrderDTO orderDTO = convertToDTO(order);
            return ApiResponse.success("Lấy thông tin đơn hàng thành công", orderDTO);
        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lấy thông tin đơn hàng: " + e.getMessage());
        }
    }

    // Tạo đơn hàng mới
    public ApiResponse<OrderDTO> createOrder(Long userId, CreateOrderRequest request) {
        try {
            // Kiểm tra giỏ hàng
            Cart cart = cartRepository.findByUserId(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Giỏ hàng trống"));

            List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
            if (cartItems.isEmpty()) {
                return ApiResponse.error("Giỏ hàng trống");
            }

            // Kiểm tra tồn kho
            for (CartItem item : cartItems) {
                Product product = item.getProduct();
                if (!product.getStatus()) {
                    return ApiResponse.error("Sản phẩm " + product.getProductName() + " đã ngừng kinh doanh");
                }
                if (product.getStock() < item.getQuantity()) {
                    return ApiResponse.error("Sản phẩm " + product.getProductName() +
                            " không đủ tồn kho. Còn lại: " + product.getStock());
                }
            }

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));

            // Tạo đơn hàng
            Order order = new Order(user);
            order.setPaymentMethod(request.getPaymentMethod());
            order.setNotes(request.getNotes());

            // Set địa chỉ giao hàng
            if (request.getAddressId() != null) {
                Address address = addressRepository.findById(request.getAddressId())
                        .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy địa chỉ"));

                if (!address.getUser().getId().equals(userId)) {
                    return ApiResponse.error("Địa chỉ không thuộc về bạn");
                }

                order.setReceiverName(address.getReceiverName() != null ? address.getReceiverName() : user.getFullName());
                order.setReceiverPhone(address.getReceiverPhone() != null ? address.getReceiverPhone() : user.getPhoneNumber());
                order.setShippingAddress(address.getFullAddress());
            } else {
                order.setReceiverName(request.getReceiverName());
                order.setReceiverPhone(request.getReceiverPhone());
                order.setShippingAddress(request.getShippingAddress());
            }

            // Tính tổng giá trị
            BigDecimal subtotal = cartItems.stream()
                    .map(CartItem::getSubtotal)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            order.setSubtotal(subtotal);
            order.setShippingFee(calculateShippingFee(subtotal));

            // Áp dụng mã giảm giá nếu có
            BigDecimal discount = BigDecimal.ZERO;
            if (request.getCouponCode() != null && !request.getCouponCode().trim().isEmpty()) {
                ValidateCouponRequest validateRequest = new ValidateCouponRequest();
                validateRequest.setCouponCode(request.getCouponCode());
                validateRequest.setOrderAmount(subtotal);
                validateRequest.setUserId(userId);

                ApiResponse<ValidateCouponResponse> validationResult = promotionService.validateCoupon(validateRequest);
                if (validationResult.isSuccess() && validationResult.getData().isValid()) {
                    discount = validationResult.getData().getDiscountAmount();
                    order.setCouponCode(request.getCouponCode());
                }
            }

            order.setDiscount(discount);
            order.calculateTotalAmount();

            // Lưu đơn hàng
            Order savedOrder = orderRepository.save(order);

            // Tạo order items
            List<OrderItem> orderItems = new ArrayList<>();
            for (CartItem cartItem : cartItems) {
                OrderItem orderItem = new OrderItem(savedOrder, cartItem.getProduct(), cartItem.getQuantity());
                orderItems.add(orderItem);
            }
            orderItemRepository.saveAll(orderItems);

            // Cập nhật tồn kho
            for (CartItem cartItem : cartItems) {
                Product product = cartItem.getProduct();
                product.setStock(product.getStock() - cartItem.getQuantity());
                product.setSoldQuantity(product.getSoldQuantity() + cartItem.getQuantity());
                productRepository.save(product);
            }

            // Ghi nhận sử dụng coupon
            if (discount.compareTo(BigDecimal.ZERO) > 0) {
                promotionService.recordPromotionUsage(request.getCouponCode(), userId, savedOrder.getId(), discount, subtotal);
            }

            // Xóa giỏ hàng
            cartItemRepository.deleteAllByUserId(userId);
            cart.setTotalPrice(BigDecimal.ZERO);
            cart.setTotalQuantity(0);
            cart.setDiscount(BigDecimal.ZERO);
            cart.setCouponCode(null);
            cartRepository.save(cart);

            OrderDTO orderDTO = convertToDTO(savedOrder);
            return ApiResponse.success("Tạo đơn hàng thành công", orderDTO);

        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi tạo đơn hàng: " + e.getMessage());
        }
    }

    // Cập nhật trạng thái đơn hàng
    public ApiResponse<OrderDTO> updateOrderStatus(Long orderId, UpdateOrderStatusRequest request) {
        try {
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng"));

            // Kiểm tra logic chuyển trạng thái
            if (!canChangeStatus(order, request.getStatus())) {
                return ApiResponse.error("Không thể chuyển từ trạng thái " +
                        order.getStatus().getDisplayName() + " sang " +
                        request.getStatus().getDisplayName());
            }

            order.setStatus(request.getStatus());
            if (request.getNotes() != null) {
                order.setNotes(request.getNotes());
            }
            if (request.getTrackingNumber() != null) {
                order.setTrackingNumber(request.getTrackingNumber());
            }

            Order updatedOrder = orderRepository.save(order);
            OrderDTO orderDTO = convertToDTO(updatedOrder);

            return ApiResponse.success("Cập nhật trạng thái đơn hàng thành công", orderDTO);
        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi cập nhật trạng thái đơn hàng: " + e.getMessage());
        }
    }

    // Hủy đơn hàng
    public ApiResponse<OrderDTO> cancelOrder(Long orderId, Long userId, CancelOrderRequest request) {
        try {
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng"));

            // Kiểm tra quyền hủy
            if (userId != null && !order.getUser().getId().equals(userId)) {
                return ApiResponse.error("Bạn không có quyền hủy đơn hàng này");
            }

            if (!order.canBeCancelled()) {
                return ApiResponse.error("Đơn hàng không thể hủy ở trạng thái hiện tại");
            }

            order.setStatus(Order.OrderStatus.CANCELLED);
            order.setCancellationReason(request.getCancellationReason());

            // Hoàn lại tồn kho
            List<OrderItem> orderItems = orderItemRepository.findByOrderIdOrderById(orderId);
            for (OrderItem item : orderItems) {
                Product product = item.getProduct();
                product.setStock(product.getStock() + item.getQuantity());
                product.setSoldQuantity(Math.max(0, product.getSoldQuantity() - item.getQuantity()));
                productRepository.save(product);
            }

            Order updatedOrder = orderRepository.save(order);
            OrderDTO orderDTO = convertToDTO(updatedOrder);

            return ApiResponse.success("Hủy đơn hàng thành công", orderDTO);
        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi hủy đơn hàng: " + e.getMessage());
        }
    }

    // Lấy đơn hàng của tôi
    public ApiResponse<List<OrderDTO>> getMyOrders(Long userId, int page, int size, Order.OrderStatus status) {
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "orderDate"));
            Page<Order> orderPage;

            if (status != null) {
                orderPage = orderRepository.findByUserIdAndStatusOrderByOrderDateDesc(userId, status, pageable);
            } else {
                orderPage = orderRepository.findByUserIdOrderByOrderDateDesc(userId, pageable);
            }

            List<OrderDTO> orderDTOs = orderPage.getContent().stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            Map<String, Object> metadata = new HashMap<>();
            metadata.put("totalElements", orderPage.getTotalElements());
            metadata.put("totalPages", orderPage.getTotalPages());
            metadata.put("currentPage", page);
            metadata.put("pageSize", size);

            ApiResponse<List<OrderDTO>> response = ApiResponse.success("Lấy danh sách đơn hàng thành công", orderDTOs);
            response.setMetadata(metadata);

            return response;
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lấy danh sách đơn hàng: " + e.getMessage());
        }
    }

    // Theo dõi đơn hàng
    public ApiResponse<OrderTrackingDTO> trackOrder(String orderCode) {
        try {
            Order order = orderRepository.findByOrderCode(orderCode)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với mã: " + orderCode));

            OrderTrackingDTO tracking = new OrderTrackingDTO();
            tracking.setOrderCode(order.getOrderCode());
            tracking.setCurrentStatus(order.getStatus());
            tracking.setTrackingNumber(order.getTrackingNumber());

            // Tạo lịch sử trạng thái
            List<OrderStatusHistoryDTO> statusHistory = createStatusHistory(order);
            tracking.setStatusHistory(statusHistory);

            return ApiResponse.success("Lấy thông tin theo dõi đơn hàng thành công", tracking);
        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi theo dõi đơn hàng: " + e.getMessage());
        }
    }

    // Xác nhận đơn hàng
    public ApiResponse<OrderDTO> confirmOrder(Long orderId) {
        try {
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng"));

            if (!order.canBeConfirmed()) {
                return ApiResponse.error("Đơn hàng không thể xác nhận ở trạng thái hiện tại");
            }

            order.setStatus(Order.OrderStatus.CONFIRMED);
            Order updatedOrder = orderRepository.save(order);
            OrderDTO orderDTO = convertToDTO(updatedOrder);

            return ApiResponse.success("Xác nhận đơn hàng thành công", orderDTO);
        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi xác nhận đơn hàng: " + e.getMessage());
        }
    }

    // Giao hàng
    public ApiResponse<OrderDTO> shipOrder(Long orderId, String trackingNumber) {
        try {
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng"));

            if (!order.canBeShipped()) {
                return ApiResponse.error("Đơn hàng không thể giao ở trạng thái hiện tại");
            }

            order.setStatus(Order.OrderStatus.SHIPPING);
            if (trackingNumber != null) {
                order.setTrackingNumber(trackingNumber);
            }

            Order updatedOrder = orderRepository.save(order);
            OrderDTO orderDTO = convertToDTO(updatedOrder);

            return ApiResponse.success("Cập nhật trạng thái giao hàng thành công", orderDTO);
        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi cập nhật trạng thái giao hàng: " + e.getMessage());
        }
    }

    // Hoàn thành đơn hàng
    public ApiResponse<OrderDTO> completeOrder(Long orderId) {
        try {
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng"));

            if (!order.canBeCompleted()) {
                return ApiResponse.error("Đơn hàng không thể hoàn thành ở trạng thái hiện tại");
            }

            order.setStatus(Order.OrderStatus.COMPLETED);
            order.setPaymentStatus(Order.PaymentStatus.PAID);

            Order updatedOrder = orderRepository.save(order);
            OrderDTO orderDTO = convertToDTO(updatedOrder);

            return ApiResponse.success("Hoàn thành đơn hàng thành công", orderDTO);
        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi hoàn thành đơn hàng: " + e.getMessage());
        }
    }

    // Helper methods

    private boolean canChangeStatus(Order order, Order.OrderStatus newStatus) {
        Order.OrderStatus currentStatus = order.getStatus();

        switch (newStatus) {
            case CONFIRMED:
                return currentStatus == Order.OrderStatus.PENDING;
            case SHIPPING:
                return currentStatus == Order.OrderStatus.CONFIRMED;
            case COMPLETED:
                return currentStatus == Order.OrderStatus.SHIPPING;
            case CANCELLED:
                return currentStatus == Order.OrderStatus.PENDING || currentStatus == Order.OrderStatus.CONFIRMED;
            default:
                return false;
        }
    }

    private BigDecimal calculateShippingFee(BigDecimal subtotal) {
        if (subtotal.compareTo(BigDecimal.valueOf(500000)) >= 0) {
            return BigDecimal.ZERO;
        }
        return BigDecimal.valueOf(30000);
    }

    private List<OrderStatusHistoryDTO> createStatusHistory(Order order) {
        List<OrderStatusHistoryDTO> history = new ArrayList<>();

        if (order.getOrderDate() != null) {
            history.add(new OrderStatusHistoryDTO(Order.OrderStatus.PENDING, order.getOrderDate(), "Đơn hàng được tạo"));
        }
        if (order.getConfirmedAt() != null) {
            history.add(new OrderStatusHistoryDTO(Order.OrderStatus.CONFIRMED, order.getConfirmedAt(), "Đơn hàng được xác nhận"));
        }
        if (order.getShippedAt() != null) {
            history.add(new OrderStatusHistoryDTO(Order.OrderStatus.SHIPPING, order.getShippedAt(),
                    "Đơn hàng đang được giao" + (order.getTrackingNumber() != null ? " - Mã vận chuyển: " + order.getTrackingNumber() : "")));
        }
        if (order.getCompletedAt() != null) {
            history.add(new OrderStatusHistoryDTO(Order.OrderStatus.COMPLETED, order.getCompletedAt(), "Đơn hàng hoàn thành"));
        }
        if (order.getCancelledAt() != null) {
            history.add(new OrderStatusHistoryDTO(Order.OrderStatus.CANCELLED, order.getCancelledAt(),
                    "Đơn hàng bị hủy" + (order.getCancellationReason() != null ? " - " + order.getCancellationReason() : "")));
        }

        return history;
    }

    // Convert methods

    private OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setOrderCode(order.getOrderCode());
        dto.setUserId(order.getUser().getId());
        dto.setUserName(order.getUser().getFullName());
        dto.setUserEmail(order.getUser().getEmail());
        dto.setStatus(order.getStatus());
        dto.setSubtotal(order.getSubtotal());
        dto.setShippingFee(order.getShippingFee());
        dto.setDiscount(order.getDiscount());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setCouponCode(order.getCouponCode());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setPaymentStatus(order.getPaymentStatus());
        dto.setOrderDate(order.getOrderDate());
        dto.setConfirmedAt(order.getConfirmedAt());
        dto.setShippedAt(order.getShippedAt());
        dto.setCompletedAt(order.getCompletedAt());
        dto.setCancelledAt(order.getCancelledAt());
        dto.setNotes(order.getNotes());
        dto.setCancellationReason(order.getCancellationReason());
        dto.setReceiverName(order.getReceiverName());
        dto.setReceiverPhone(order.getReceiverPhone());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setTrackingNumber(order.getTrackingNumber());

        // Load order items
        List<OrderItem> orderItems = orderItemRepository.findByOrderIdOrderById(order.getId());
        List<OrderItemDTO> itemDTOs = orderItems.stream()
                .map(this::convertItemToDTO)
                .collect(Collectors.toList());
        dto.setOrderItems(itemDTOs);

        return dto;
    }

    private OrderItemDTO convertItemToDTO(OrderItem item) {
        OrderItemDTO dto = new OrderItemDTO();
        dto.setId(item.getId());
        dto.setOrderId(item.getOrder().getId());
        dto.setProductId(item.getProduct().getId());
        dto.setProductName(item.getProductNameAtTime());
        dto.setProductImage(item.getImageAtTime());
        dto.setSku(item.getSkuAtTime());
        dto.setQuantity(item.getQuantity());
        dto.setPriceAtTime(item.getPriceAtTime());
        dto.setSalePriceAtTime(item.getSalePriceAtTime());
        dto.setSubtotal(item.getSubtotal());
        return dto;
    }
}