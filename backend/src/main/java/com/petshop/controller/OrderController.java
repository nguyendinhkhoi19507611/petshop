package com.petshop.controller;

import com.petshop.dto.*;
import com.petshop.entity.Order;
import com.petshop.security.UserDetailsImpl;
import com.petshop.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // Lấy tất cả đơn hàng [ADMIN/EMPLOYEE]
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('NHÂN VIÊN')")
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Order.OrderStatus status) {

        ApiResponse<List<OrderDTO>> response = orderService.getAllOrders(page, size, search, status);
        return ResponseEntity.ok(response);
    }

    // Lấy đơn hàng theo ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderDTO>> getOrderById(
            @PathVariable Long id,
            Authentication authentication) {

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        // Lấy đơn hàng
        ApiResponse<OrderDTO> response = orderService.getOrderById(id);

        if (!response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        // Kiểm tra quyền xem (Admin/Employee hoặc chủ đơn hàng)
        boolean hasAdminRole = userDetails.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN") ||
                        auth.getAuthority().equals("ROLE_NHÂN VIÊN"));

        if (!hasAdminRole && !response.getData().getUserId().equals(userDetails.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Bạn không có quyền xem đơn hàng này"));
        }

        return ResponseEntity.ok(response);
    }

    // Tạo đơn hàng mới [AUTH]
    @PostMapping
    public ResponseEntity<ApiResponse<OrderDTO>> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            Authentication authentication) {

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = userDetails.getId();

        ApiResponse<OrderDTO> response = orderService.createOrder(userId, request);

        if (response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Cập nhật trạng thái [ADMIN/EMPLOYEE]
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NHÂN VIÊN')")
    public ResponseEntity<ApiResponse<OrderDTO>> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request) {

        ApiResponse<OrderDTO> response = orderService.updateOrderStatus(id, request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Hủy đơn hàng [CONDITIONS]
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderDTO>> cancelOrder(
            @PathVariable Long id,
            @Valid @RequestBody CancelOrderRequest request,
            Authentication authentication) {

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        // Admin/Employee có thể hủy bất kỳ đơn hàng nào
        boolean hasAdminRole = userDetails.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN") ||
                        auth.getAuthority().equals("ROLE_NHÂN VIÊN"));

        Long userId = hasAdminRole ? null : userDetails.getId();

        ApiResponse<OrderDTO> response = orderService.cancelOrder(id, userId, request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Đơn hàng của tôi [AUTH]
    @GetMapping("/my-orders")
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getMyOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Order.OrderStatus status,
            Authentication authentication) {

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = userDetails.getId();

        ApiResponse<List<OrderDTO>> response = orderService.getMyOrders(userId, page, size, status);
        return ResponseEntity.ok(response);
    }

    // Theo dõi đơn hàng
    @GetMapping("/{id}/tracking")
    public ResponseEntity<ApiResponse<OrderTrackingDTO>> trackOrder(@PathVariable Long id) {
        // Lấy order code từ ID
        ApiResponse<OrderDTO> orderResponse = orderService.getOrderById(id);
        if (!orderResponse.isSuccess()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Không tìm thấy đơn hàng"));
        }

        String orderCode = orderResponse.getData().getOrderCode();
        ApiResponse<OrderTrackingDTO> response = orderService.trackOrder(orderCode);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // Hủy đơn hàng [CUSTOMER]
    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<OrderDTO>> cancelOrderByCustomer(
            @PathVariable Long id,
            @Valid @RequestBody CancelOrderRequest request,
            Authentication authentication) {

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = userDetails.getId();

        ApiResponse<OrderDTO> response = orderService.cancelOrder(id, userId, request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Lọc đơn hàng theo trạng thái
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NHÂN VIÊN')")
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getOrdersByStatus(
            @PathVariable Order.OrderStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        ApiResponse<List<OrderDTO>> response = orderService.getAllOrders(page, size, null, status);
        return ResponseEntity.ok(response);
    }

    // Xác nhận đơn hàng [EMPLOYEE]
    @PostMapping("/{id}/confirm")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NHÂN VIÊN')")
    public ResponseEntity<ApiResponse<OrderDTO>> confirmOrder(@PathVariable Long id) {
        ApiResponse<OrderDTO> response = orderService.confirmOrder(id);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Giao hàng [EMPLOYEE]
    @PostMapping("/{id}/ship")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NHÂN VIÊN')")
    public ResponseEntity<ApiResponse<OrderDTO>> shipOrder(
            @PathVariable Long id,
            @RequestParam(required = false) String trackingNumber) {

        ApiResponse<OrderDTO> response = orderService.shipOrder(id, trackingNumber);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Hoàn thành [EMPLOYEE]
    @PostMapping("/{id}/complete")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NHÂN VIÊN')")
    public ResponseEntity<ApiResponse<OrderDTO>> completeOrder(@PathVariable Long id) {
        ApiResponse<OrderDTO> response = orderService.completeOrder(id);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}