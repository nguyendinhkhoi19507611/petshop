package com.petshop.controller;

import com.petshop.dto.ApiResponse;
import com.petshop.dto.SizeDTO;
import com.petshop.dto.SizeRequest;
import com.petshop.service.SizeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/sizes")
public class SizeController {

    @Autowired
    private SizeService sizeService;

    // Lấy tất cả kích cỡ (có phân trang và tìm kiếm)
    @GetMapping
    public ResponseEntity<ApiResponse<List<SizeDTO>>> getAllSizes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean status) {

        ApiResponse<List<SizeDTO>> response = sizeService.getAllSizes(page, size, search, status);
        return ResponseEntity.ok(response);
    }

    // Lấy kích cỡ hoạt động (cho dropdown, select...)
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<SizeDTO>>> getActiveSizes() {
        ApiResponse<List<SizeDTO>> response = sizeService.getActiveSizes();
        return ResponseEntity.ok(response);
    }

    // Lấy kích cỡ theo đơn vị
    @GetMapping("/by-unit/{unit}")
    public ResponseEntity<ApiResponse<List<SizeDTO>>> getSizesByUnit(@PathVariable String unit) {
        ApiResponse<List<SizeDTO>> response = sizeService.getSizesByUnit(unit);
        return ResponseEntity.ok(response);
    }

    // Lấy kích cỡ theo ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SizeDTO>> getSizeById(@PathVariable Long id) {
        ApiResponse<SizeDTO> response = sizeService.getSizeById(id);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // Tạo kích cỡ mới (chỉ Admin)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SizeDTO>> createSize(@Valid @RequestBody SizeRequest request) {
        ApiResponse<SizeDTO> response = sizeService.createSize(request);

        if (response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Cập nhật kích cỡ (chỉ Admin)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SizeDTO>> updateSize(
            @PathVariable Long id,
            @Valid @RequestBody SizeRequest request) {

        ApiResponse<SizeDTO> response = sizeService.updateSize(id, request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Xóa kích cỡ (chỉ Admin)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteSize(@PathVariable Long id) {
        ApiResponse<Void> response = sizeService.deleteSize(id);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // Bật/tắt trạng thái kích cỡ (chỉ Admin)
    @PostMapping("/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SizeDTO>> toggleSizeStatus(@PathVariable Long id) {
        ApiResponse<SizeDTO> response = sizeService.toggleSizeStatus(id);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // Cập nhật thứ tự hiển thị (chỉ Admin)
    @PutMapping("/display-order")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<SizeDTO>>> updateDisplayOrder(@RequestBody List<Long> sizeIds) {
        ApiResponse<List<SizeDTO>> response = sizeService.updateDisplayOrder(sizeIds);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}