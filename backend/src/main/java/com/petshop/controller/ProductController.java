package com.petshop.controller;

import com.petshop.dto.*;
import com.petshop.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    // Lấy tất cả sản phẩm (có phân trang, filter)
    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean status) {

        ApiResponse<List<ProductDTO>> response = productService.getAllProducts(page, size, search, status);
        return ResponseEntity.ok(response);
    }

    // Lấy sản phẩm theo ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDTO>> getProductById(@PathVariable Long id) {
        ApiResponse<ProductDTO> response = productService.getProductById(id);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // Tạo sản phẩm mới (Admin/Employee)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('NHÂN VIÊN')")
    public ResponseEntity<ApiResponse<ProductDTO>> createProduct(@Valid @RequestBody ProductRequest request) {
        ApiResponse<ProductDTO> response = productService.createProduct(request);

        if (response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Cập nhật sản phẩm (Admin/Employee)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NHÂN VIÊN')")
    public ResponseEntity<ApiResponse<ProductDTO>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {

        ApiResponse<ProductDTO> response = productService.updateProduct(id, request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Xóa sản phẩm (chỉ Admin)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        ApiResponse<Void> response = productService.deleteProduct(id);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // Tìm kiếm sản phẩm
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> searchProducts(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        ApiResponse<List<ProductDTO>> response = productService.getAllProducts(page, size, query, true);
        return ResponseEntity.ok(response);
    }

    // Lọc sản phẩm theo tiêu chí
    @PostMapping("/filter")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> filterProducts(
            @RequestBody ProductFilterRequest request) {

        ApiResponse<List<ProductDTO>> response = productService.filterProducts(request);
        return ResponseEntity.ok(response);
    }

    // Upload hình ảnh sản phẩm (Admin/Employee)
    @PostMapping("/{id}/upload-image")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NHÂN VIÊN')")
    public ResponseEntity<ApiResponse<String>> uploadProductImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {

        ApiResponse<String> response = productService.uploadProductImage(id, file);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Cập nhật tồn kho (Admin/Employee)
    @PutMapping("/{id}/stock")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NHÂN VIÊN')")
    public ResponseEntity<ApiResponse<ProductDTO>> updateStock(
            @PathVariable Long id,
            @Valid @RequestBody StockUpdateRequest request) {

        ApiResponse<ProductDTO> response = productService.updateStock(id, request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Sản phẩm sắp hết hàng (Admin/Employee)
    @GetMapping("/low-stock")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NHÂN VIÊN')")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getLowStockProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        ApiResponse<List<ProductDTO>> response = productService.getLowStockProducts(page, size);
        return ResponseEntity.ok(response);
    }

    // Sản phẩm bán chạy
    @GetMapping("/bestsellers")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getBestSellingProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        ApiResponse<List<ProductDTO>> response = productService.getBestSellingProducts(page, size);
        return ResponseEntity.ok(response);
    }

    // Sản phẩm nổi bật
    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getFeaturedProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        ApiResponse<List<ProductDTO>> response = productService.getFeaturedProducts(page, size);
        return ResponseEntity.ok(response);
    }

    // Sản phẩm khuyến mãi
    @GetMapping("/on-sale")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getProductsOnSale(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        ApiResponse<List<ProductDTO>> response = productService.getProductsOnSale(page, size);
        return ResponseEntity.ok(response);
    }

    // Sản phẩm liên quan
    @GetMapping("/{id}/related")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getRelatedProducts(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size) {

        ApiResponse<List<ProductDTO>> response = productService.getRelatedProducts(id, page, size);
        return ResponseEntity.ok(response);
    }
}