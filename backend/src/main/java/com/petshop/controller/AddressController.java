package com.petshop.controller;

import com.petshop.dto.*;
import com.petshop.service.UserManagementService;
import com.petshop.security.UserDetailsImpl;
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
@RequestMapping("/api")
public class AddressController {

    @Autowired
    private UserManagementService userManagementService;

    // Lấy tất cả tỉnh/thành
    @GetMapping("/addresses/provinces")
    public ResponseEntity<ApiResponse<List<ProvinceDTO>>> getAllProvinces() {
        ApiResponse<List<ProvinceDTO>> response = userManagementService.getAllProvinces();
        return ResponseEntity.ok(response);
    }

    // Lấy quận/huyện theo tỉnh
    @GetMapping("/addresses/districts/{provinceId}")
    public ResponseEntity<ApiResponse<List<DistrictDTO>>> getDistrictsByProvince(
            @PathVariable Long provinceId) {
        ApiResponse<List<DistrictDTO>> response = userManagementService.getDistrictsByProvince(provinceId);
        return ResponseEntity.ok(response);
    }

    // Lấy phường/xã theo quận
    @GetMapping("/addresses/wards/{districtId}")
    public ResponseEntity<ApiResponse<List<WardDTO>>> getWardsByDistrict(
            @PathVariable Long districtId) {
        ApiResponse<List<WardDTO>> response = userManagementService.getWardsByDistrict(districtId);
        return ResponseEntity.ok(response);
    }

    // Lấy địa chỉ của user
    @GetMapping("/users/{userId}/addresses")
    @PreAuthorize("hasRole('ADMIN') or authentication.principal.id == #userId")
    public ResponseEntity<ApiResponse<List<AddressDTO>>> getUserAddresses(@PathVariable Long userId) {
        ApiResponse<List<AddressDTO>> response = userManagementService.getUserAddresses(userId);
        return ResponseEntity.ok(response);
    }

    // Thêm địa chỉ mới
    @PostMapping("/users/{userId}/addresses")
    @PreAuthorize("authentication.principal.id == #userId")
    public ResponseEntity<ApiResponse<AddressDTO>> createAddress(
            @PathVariable Long userId,
            @Valid @RequestBody AddressRequest request) {

        ApiResponse<AddressDTO> response = userManagementService.createAddress(userId, request);

        if (response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Cập nhật địa chỉ
    @PutMapping("/addresses/{id}")
    public ResponseEntity<ApiResponse<AddressDTO>> updateAddress(
            @PathVariable Long id,
            @Valid @RequestBody AddressRequest request,
            Authentication authentication) {

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = userDetails.getId();

        ApiResponse<AddressDTO> response = userManagementService.updateAddress(id, request, userId);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Xóa địa chỉ
    @DeleteMapping("/addresses/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(
            @PathVariable Long id,
            Authentication authentication) {

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = userDetails.getId();

        ApiResponse<Void> response = userManagementService.deleteAddress(id, userId);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Đặt địa chỉ mặc định
    @PostMapping("/addresses/{id}/set-default")
    public ResponseEntity<ApiResponse<AddressDTO>> setDefaultAddress(
            @PathVariable Long id,
            Authentication authentication) {

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = userDetails.getId();

        ApiResponse<AddressDTO> response = userManagementService.setDefaultAddress(id, userId);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}