package com.petshop.controller;

import com.petshop.dto.ApiResponse;
import com.petshop.dto.ProductTypeDTO;
import com.petshop.dto.ProductTypeRequest;
import com.petshop.service.ProductTypeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/product-types")
public class ProductTypeController {

    @Autowired
    private ProductTypeService productTypeService;

    // Lấy tất cả loại sản phẩm (có phân trang và tìm kiếm)
    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductTypeDTO>>> getAllProductTypes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean status,
            @RequestParam(required = false) Long categoryId) {

        ApiResponse<List<ProductTypeDTO>> response = productTypeService.getAllProductTypes(
                page, size, search, status, categoryId);
        return ResponseEntity.ok(response);
    }

    // Lấy loại sản phẩm hoạt động (cho dropdown, select...)
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<ProductTypeDTO>>> getActiveProductTypes() {
        ApiResponse<List<ProductTypeDTO>> response = productTypeService.getActiveProductTypes();
        return ResponseEntity.ok(response);
    }

    // Lấy loại sản phẩm theo danh mục
    @GetMapping("/by-category/{categoryId}")
    public ResponseEntity<ApiResponse<List<ProductTypeDTO>>> getProductTypesByCategory(
            @PathVariable Long categoryId) {
        ApiResponse<List<ProductTypeDTO>> response = productTypeService.getProductTypesByCategory(categoryId);
        return ResponseEntity.ok(response);
    }

    // Lấy loại sản phẩm theo type code
    @GetMapping("/by-type/{type}")
    public ResponseEntity<ApiResponse<List<ProductTypeDTO>>> getProductTypesByType(
            @PathVariable Integer type) {
        ApiResponse<List<ProductTypeDTO>> response = productTypeService.getProductTypesByType(type);
        return ResponseEntity.ok(response);
    }

    // Lấy loại sản phẩm theo ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductTypeDTO>> getProductTypeById(@PathVariable Long id) {
        ApiResponse<ProductTypeDTO> response = productTypeService.getProductTypeById(id);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // Tạo loại sản phẩm mới (chỉ Admin)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductTypeDTO>> createProductType(
            @Valid @RequestBody ProductTypeRequest request) {
        ApiResponse<ProductTypeDTO> response = productTypeService.createProductType(request);

        if (response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Cập nhật loại sản phẩm (chỉ Admin)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductTypeDTO>> updateProductType(
            @PathVariable Long id,
            @Valid @RequestBody ProductTypeRequest request) {

        ApiResponse<ProductTypeDTO> response = productTypeService.updateProductType(id, request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Xóa loại sản phẩm (chỉ Admin)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteProductType(@PathVariable Long id) {
        ApiResponse<Void> response = productTypeService.deleteProductType(id);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Bật/tắt trạng thái loại sản phẩm (chỉ Admin)
    @PostMapping("/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductTypeDTO>> toggleProductTypeStatus(@PathVariable Long id) {
        ApiResponse<ProductTypeDTO> response = productTypeService.toggleProductTypeStatus(id);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}