package com.petshop.controller;

import com.petshop.dto.ApiResponse;
import com.petshop.dto.BrandDTO;
import com.petshop.dto.BrandRequest;
import com.petshop.service.BrandService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/brands")
public class BrandController {

    @Autowired
    private BrandService brandService;

    // Lấy tất cả thương hiệu (có phân trang và tìm kiếm)
    @GetMapping
    public ResponseEntity<ApiResponse<List<BrandDTO>>> getAllBrands(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean status) {

        ApiResponse<List<BrandDTO>> response = brandService.getAllBrands(page, size, search, status);
        return ResponseEntity.ok(response);
    }

    // Lấy thương hiệu hoạt động (cho dropdown, select...)
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<BrandDTO>>> getActiveBrands() {
        ApiResponse<List<BrandDTO>> response = brandService.getActiveBrands();
        return ResponseEntity.ok(response);
    }

    // Lấy top thương hiệu
    @GetMapping("/top")
    public ResponseEntity<ApiResponse<List<BrandDTO>>> getTopBrands(
            @RequestParam(defaultValue = "10") int limit) {
        ApiResponse<List<BrandDTO>> response = brandService.getTopBrands(limit);
        return ResponseEntity.ok(response);
    }

    // Lấy thương hiệu theo ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BrandDTO>> getBrandById(@PathVariable Long id) {
        ApiResponse<BrandDTO> response = brandService.getBrandById(id);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // Tạo thương hiệu mới (chỉ Admin)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BrandDTO>> createBrand(@Valid @RequestBody BrandRequest request) {
        ApiResponse<BrandDTO> response = brandService.createBrand(request);

        if (response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Cập nhật thương hiệu (chỉ Admin)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BrandDTO>> updateBrand(
            @PathVariable Long id,
            @Valid @RequestBody BrandRequest request) {

        ApiResponse<BrandDTO> response = brandService.updateBrand(id, request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Xóa thương hiệu (chỉ Admin)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteBrand(@PathVariable Long id) {
        ApiResponse<Void> response = brandService.deleteBrand(id);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // Bật/tắt trạng thái thương hiệu (chỉ Admin)
    @PostMapping("/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BrandDTO>> toggleBrandStatus(@PathVariable Long id) {
        ApiResponse<BrandDTO> response = brandService.toggleBrandStatus(id);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}