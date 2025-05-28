package com.petshop.controller;

import com.petshop.dto.*;
import com.petshop.security.UserDetailsImpl;
import com.petshop.service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    // Lấy giỏ hàng hiện tại [AUTH]
    @GetMapping
    public ResponseEntity<ApiResponse<CartDTO>> getCart(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = userDetails.getId();

        ApiResponse<CartDTO> response = cartService.getCart(userId);
        return ResponseEntity.ok(response);
    }

    // Thêm sản phẩm vào giỏ [AUTH]
    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartDTO>> addToCart(
            @Valid @RequestBody AddToCartRequest request,
            Authentication authentication) {

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = userDetails.getId();

        ApiResponse<CartDTO> response = cartService.addToCart(userId, request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Cập nhật số lượng [AUTH]
    @PutMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartDTO>> updateCartItem(
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateCartItemRequest request,
            Authentication authentication) {

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = userDetails.getId();

        ApiResponse<CartDTO> response = cartService.updateCartItem(userId, itemId, request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Xóa sản phẩm khỏi giỏ [AUTH]
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartDTO>> removeFromCart(
            @PathVariable Long itemId,
            Authentication authentication) {

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = userDetails.getId();

        ApiResponse<CartDTO> response = cartService.removeFromCart(userId, itemId);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Xóa toàn bộ giỏ hàng [AUTH]
    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<Void>> clearCart(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = userDetails.getId();

        ApiResponse<Void> response = cartService.clearCart(userId);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Tóm tắt giỏ hàng [AUTH]
    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<CartSummaryDTO>> getCartSummary(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = userDetails.getId();

        ApiResponse<CartSummaryDTO> response = cartService.getCartSummary(userId);
        return ResponseEntity.ok(response);
    }

    // Áp dụng mã giảm giá [AUTH]
    @PostMapping("/apply-coupon")
    public ResponseEntity<ApiResponse<CartDTO>> applyCoupon(
            @Valid @RequestBody ApplyCouponRequest request,
            Authentication authentication) {

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = userDetails.getId();

        ApiResponse<CartDTO> response = cartService.applyCoupon(userId, request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
