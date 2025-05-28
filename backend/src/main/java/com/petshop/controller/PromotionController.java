package com.petshop.controller;

import com.petshop.dto.*;
import com.petshop.security.UserDetailsImpl;
import com.petshop.service.PromotionService;
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
@RequestMapping("/api/promotions")
public class PromotionController {

    @Autowired
    private PromotionService promotionService;

    // Lấy tất cả khuyến mãi
    @GetMapping
    public ResponseEntity<ApiResponse<List<PromotionDTO>>> getAllPromotions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean status) {

        ApiResponse<List<PromotionDTO>> response = promotionService.getAllPromotions(page, size, search, status);
        return ResponseEntity.ok(response);
    }

    // Lấy khuyến mãi theo ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PromotionDTO>> getPromotionById(@PathVariable Long id) {
        ApiResponse<PromotionDTO> response = promotionService.getPromotionById(id);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // Tạo khuyến mãi [ADMIN]
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PromotionDTO>> createPromotion(@Valid @RequestBody PromotionRequest request) {
        ApiResponse<PromotionDTO> response = promotionService.createPromotion(request);

        if (response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Cập nhật khuyến mãi [ADMIN]
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PromotionDTO>> updatePromotion(
            @PathVariable Long id,
            @Valid @RequestBody PromotionRequest request) {

        ApiResponse<PromotionDTO> response = promotionService.updatePromotion(id, request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Xóa khuyến mãi [ADMIN]
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deletePromotion(@PathVariable Long id) {
        ApiResponse<Void> response = promotionService.deletePromotion(id);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Khuyến mãi đang hoạt động
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<PromotionDTO>>> getActivePromotions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        ApiResponse<List<PromotionDTO>> response = promotionService.getActivePromotions(page, size);
        return ResponseEntity.ok(response);
    }

    // Bật/tắt khuyến mãi [ADMIN]
    @PostMapping("/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PromotionDTO>> togglePromotionStatus(@PathVariable Long id) {
        ApiResponse<PromotionDTO> response = promotionService.togglePromotionStatus(id);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // Validate mã giảm giá
    @PostMapping("/validate-coupon")
    public ResponseEntity<ApiResponse<ValidateCouponResponse>> validateCoupon(
            @Valid @RequestBody ValidateCouponRequest request,
            Authentication authentication) {

        // Set user ID if authenticated
        if (authentication != null && authentication.isAuthenticated()) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            request.setUserId(userDetails.getId());
        }

        ApiResponse<ValidateCouponResponse> response = promotionService.validateCoupon(request);
        return ResponseEntity.ok(response);
    }

    // Khuyến mãi có thể áp dụng
    @GetMapping("/applicable")
    public ResponseEntity<ApiResponse<List<PromotionDTO>>> getApplicablePromotions(
            Authentication authentication) {

        Long userId = null;
        if (authentication != null && authentication.isAuthenticated()) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            userId = userDetails.getId();
        }

        ApiResponse<List<PromotionDTO>> response = promotionService.getApplicablePromotions(userId);
        return ResponseEntity.ok(response);
    }
}