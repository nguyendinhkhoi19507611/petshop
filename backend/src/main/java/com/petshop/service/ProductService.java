package com.petshop.service;

import com.petshop.dto.*;
import com.petshop.entity.*;
import com.petshop.exception.ResourceNotFoundException;
import com.petshop.exception.DuplicateResourceException;
import com.petshop.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductTypeRepository productTypeRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private SizeRepository sizeRepository;

    private static final String UPLOAD_DIR = "uploads/products/";

    // Lấy tất cả sản phẩm với phân trang và tìm kiếm
    public ApiResponse<List<ProductDTO>> getAllProducts(int page, int size, String search, Boolean status) {
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdDate"));
            Page<Product> productPage;

            if (status != null) {
                productPage = productRepository.findByStatusOrderByCreatedDateDesc(status, pageable);
            } else if (search != null && !search.trim().isEmpty()) {
                productPage = productRepository.searchProducts(search.trim(), null, pageable);
            } else {
                productPage = productRepository.findAll(pageable);
            }

            List<ProductDTO> productDTOs = productPage.getContent().stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            // Thêm metadata cho phân trang
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("totalElements", productPage.getTotalElements());
            metadata.put("totalPages", productPage.getTotalPages());
            metadata.put("currentPage", page);
            metadata.put("pageSize", size);
            metadata.put("hasNext", productPage.hasNext());
            metadata.put("hasPrevious", productPage.hasPrevious());

            ApiResponse<List<ProductDTO>> response = ApiResponse.success(
                    "Lấy danh sách sản phẩm thành công", productDTOs);
            response.setMetadata(metadata);

            return response;
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lấy danh sách sản phẩm: " + e.getMessage());
        }
    }

    // Lọc sản phẩm theo nhiều tiêu chí
    public ApiResponse<List<ProductDTO>> filterProducts(ProductFilterRequest request) {
        try {
            // Tạo sort
            Sort sort = createSort(request.getSortBy(), request.getSortDir());
            Pageable pageable = PageRequest.of(request.getPage(), request.getSize(), sort);

            Page<Product> productPage = productRepository.filterProducts(
                    request.getSearch(),
                    request.getCategoryId(),
                    request.getBrandId(),
                    request.getSizeId(),
                    request.getProductTypeId(),
                    request.getMinPrice(),
                    request.getMaxPrice(),
                    request.getStatus(),
                    request.getFeatured(),
                    request.getInStock(),
                    pageable
            );

            List<ProductDTO> productDTOs = productPage.getContent().stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            // Thêm metadata cho phân trang
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("totalElements", productPage.getTotalElements());
            metadata.put("totalPages", productPage.getTotalPages());
            metadata.put("currentPage", request.getPage());
            metadata.put("pageSize", request.getSize());
            metadata.put("hasNext", productPage.hasNext());
            metadata.put("hasPrevious", productPage.hasPrevious());

            ApiResponse<List<ProductDTO>> response = ApiResponse.success(
                    "Lọc sản phẩm thành công", productDTOs);
            response.setMetadata(metadata);

            return response;
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lọc sản phẩm: " + e.getMessage());
        }
    }

    // Lấy sản phẩm theo ID
    public ApiResponse<ProductDTO> getProductById(Long id) {
        try {
            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với ID: " + id));

            ProductDTO productDTO = convertToDTO(product);
            return ApiResponse.success("Lấy thông tin sản phẩm thành công", productDTO);
        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lấy thông tin sản phẩm: " + e.getMessage());
        }
    }

    // Tạo sản phẩm mới
    public ApiResponse<ProductDTO> createProduct(ProductRequest request) {
        try {
            // Kiểm tra SKU đã tồn tại (nếu có)
            if (request.getSku() != null && productRepository.existsBySku(request.getSku())) {
                throw new DuplicateResourceException("SKU đã tồn tại: " + request.getSku());
            }

            // Kiểm tra các entity liên quan có tồn tại
            ProductType productType = productTypeRepository.findById(request.getProductTypeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy loại sản phẩm với ID: " + request.getProductTypeId()));

            Brand brand = brandRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thương hiệu với ID: " + request.getBrandId()));

            Size size = null;
            if (request.getSizeId() != null) {
                size = sizeRepository.findById(request.getSizeId())
                        .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy kích cỡ với ID: " + request.getSizeId()));
            }

            Product product = new Product();
            product.setProductName(request.getProductName());
            product.setDescription(request.getDescription());
            product.setImage(request.getImage());
            product.setPrice(request.getPrice());
            product.setSalePrice(request.getSalePrice());
            product.setProductType(productType);
            product.setBrand(brand);
            product.setSize(size);
            product.setStock(request.getStock());
            product.setSku(request.getSku() != null ? request.getSku() : generateSKU());
            product.setStatus(request.getStatus() != null ? request.getStatus() : true);
            product.setFeatured(request.getFeatured() != null ? request.getFeatured() : false);
            product.setWeight(request.getWeight());
            product.setDimensions(request.getDimensions());
            product.setMetaTitle(request.getMetaTitle());
            product.setMetaDescription(request.getMetaDescription());
            product.setTags(request.getTags());
            product.setLowStockThreshold(request.getLowStockThreshold());
            product.setCreatedDate(LocalDateTime.now());

            Product savedProduct = productRepository.save(product);
            ProductDTO productDTO = convertToDTO(savedProduct);

            return ApiResponse.success("Tạo sản phẩm thành công", productDTO);
        } catch (DuplicateResourceException | ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi tạo sản phẩm: " + e.getMessage());
        }
    }

    // Cập nhật sản phẩm
    public ApiResponse<ProductDTO> updateProduct(Long id, ProductRequest request) {
        try {
            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với ID: " + id));

            // Kiểm tra SKU đã tồn tại (nếu có và khác với SKU hiện tại)
            if (request.getSku() != null && productRepository.existsBySkuAndIdNot(request.getSku(), id)) {
                throw new DuplicateResourceException("SKU đã tồn tại: " + request.getSku());
            }

            // Kiểm tra các entity liên quan có tồn tại
            ProductType productType = productTypeRepository.findById(request.getProductTypeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy loại sản phẩm với ID: " + request.getProductTypeId()));

            Brand brand = brandRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thương hiệu với ID: " + request.getBrandId()));

            Size size = null;
            if (request.getSizeId() != null) {
                size = sizeRepository.findById(request.getSizeId())
                        .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy kích cỡ với ID: " + request.getSizeId()));
            }

            product.setProductName(request.getProductName());
            product.setDescription(request.getDescription());
            if (request.getImage() != null) {
                product.setImage(request.getImage());
            }
            product.setPrice(request.getPrice());
            product.setSalePrice(request.getSalePrice());
            product.setProductType(productType);
            product.setBrand(brand);
            product.setSize(size);
            product.setStock(request.getStock());
            if (request.getSku() != null) {
                product.setSku(request.getSku());
            }
            if (request.getStatus() != null) {
                product.setStatus(request.getStatus());
            }
            if (request.getFeatured() != null) {
                product.setFeatured(request.getFeatured());
            }
            product.setWeight(request.getWeight());
            product.setDimensions(request.getDimensions());
            product.setMetaTitle(request.getMetaTitle());
            product.setMetaDescription(request.getMetaDescription());
            product.setTags(request.getTags());
            if (request.getLowStockThreshold() != null) {
                product.setLowStockThreshold(request.getLowStockThreshold());
            }

            Product updatedProduct = productRepository.save(product);
            ProductDTO productDTO = convertToDTO(updatedProduct);

            return ApiResponse.success("Cập nhật sản phẩm thành công", productDTO);
        } catch (ResourceNotFoundException | DuplicateResourceException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi cập nhật sản phẩm: " + e.getMessage());
        }
    }

    // Xóa sản phẩm
    public ApiResponse<Void> deleteProduct(Long id) {
        try {
            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với ID: " + id));

            // TODO: Kiểm tra xem sản phẩm có trong đơn hàng nào không trước khi xóa

            productRepository.delete(product);
            return ApiResponse.success("Xóa sản phẩm thành công");
        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi xóa sản phẩm: " + e.getMessage());
        }
    }

    // Upload hình ảnh sản phẩm
    public ApiResponse<String> uploadProductImage(Long id, MultipartFile file) {
        try {
            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với ID: " + id));

            if (file.isEmpty()) {
                return ApiResponse.error("File không được để trống");
            }

            // Kiểm tra loại file
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ApiResponse.error("Chỉ chấp nhận file hình ảnh");
            }

            // Tạo tên file unique
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

            // Tạo thư mục nếu chưa tồn tại
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Lưu file
            Path filePath = uploadPath.resolve(fileName);
            file.transferTo(filePath.toFile());

            // Cập nhật đường dẫn hình ảnh
            String imageUrl = "/uploads/products/" + fileName;
            product.setImage(imageUrl);
            productRepository.save(product);

            return ApiResponse.success("Upload hình ảnh thành công", imageUrl);
        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (IOException e) {
            return ApiResponse.error("Lỗi khi lưu file: " + e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi upload hình ảnh: " + e.getMessage());
        }
    }

    // Cập nhật tồn kho
    public ApiResponse<ProductDTO> updateStock(Long id, StockUpdateRequest request) {
        try {
            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với ID: " + id));

            product.setStock(request.getStock());
            Product updatedProduct = productRepository.save(product);
            ProductDTO productDTO = convertToDTO(updatedProduct);

            return ApiResponse.success("Cập nhật tồn kho thành công", productDTO);
        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi cập nhật tồn kho: " + e.getMessage());
        }
    }

    // Lấy sản phẩm sắp hết hàng
    public ApiResponse<List<ProductDTO>> getLowStockProducts(int page, int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Product> productPage = productRepository.findLowStockProducts(pageable);

            List<ProductDTO> productDTOs = productPage.getContent().stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            Map<String, Object> metadata = new HashMap<>();
            metadata.put("totalElements", productPage.getTotalElements());
            metadata.put("totalPages", productPage.getTotalPages());
            metadata.put("currentPage", page);
            metadata.put("pageSize", size);

            ApiResponse<List<ProductDTO>> response = ApiResponse.success(
                    "Lấy danh sách sản phẩm sắp hết hàng thành công", productDTOs);
            response.setMetadata(metadata);

            return response;
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lấy danh sách sản phẩm sắp hết hàng: " + e.getMessage());
        }
    }

    // Lấy sản phẩm bán chạy
    public ApiResponse<List<ProductDTO>> getBestSellingProducts(int page, int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Product> productPage = productRepository.findBestSellingProducts(pageable);

            List<ProductDTO> productDTOs = productPage.getContent().stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            Map<String, Object> metadata = new HashMap<>();
            metadata.put("totalElements", productPage.getTotalElements());
            metadata.put("totalPages", productPage.getTotalPages());
            metadata.put("currentPage", page);
            metadata.put("pageSize", size);

            ApiResponse<List<ProductDTO>> response = ApiResponse.success(
                    "Lấy danh sách sản phẩm bán chạy thành công", productDTOs);
            response.setMetadata(metadata);

            return response;
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lấy danh sách sản phẩm bán chạy: " + e.getMessage());
        }
    }

    // Lấy sản phẩm nổi bật
    public ApiResponse<List<ProductDTO>> getFeaturedProducts(int page, int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Product> productPage = productRepository.findByFeaturedAndStatusOrderByCreatedDateDesc(true, true, pageable);

            List<ProductDTO> productDTOs = productPage.getContent().stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            Map<String, Object> metadata = new HashMap<>();
            metadata.put("totalElements", productPage.getTotalElements());
            metadata.put("totalPages", productPage.getTotalPages());
            metadata.put("currentPage", page);
            metadata.put("pageSize", size);

            ApiResponse<List<ProductDTO>> response = ApiResponse.success(
                    "Lấy danh sách sản phẩm nổi bật thành công", productDTOs);
            response.setMetadata(metadata);

            return response;
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lấy danh sách sản phẩm nổi bật: " + e.getMessage());
        }
    }

    // Lấy sản phẩm khuyến mãi
    public ApiResponse<List<ProductDTO>> getProductsOnSale(int page, int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Product> productPage = productRepository.findProductsOnSale(pageable);

            List<ProductDTO> productDTOs = productPage.getContent().stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            Map<String, Object> metadata = new HashMap<>();
            metadata.put("totalElements", productPage.getTotalElements());
            metadata.put("totalPages", productPage.getTotalPages());
            metadata.put("currentPage", page);
            metadata.put("pageSize", size);

            ApiResponse<List<ProductDTO>> response = ApiResponse.success(
                    "Lấy danh sách sản phẩm khuyến mãi thành công", productDTOs);
            response.setMetadata(metadata);

            return response;
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lấy danh sách sản phẩm khuyến mãi: " + e.getMessage());
        }
    }

    // Lấy sản phẩm liên quan
    public ApiResponse<List<ProductDTO>> getRelatedProducts(Long productId, int page, int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Product> productPage = productRepository.findRelatedProducts(productId, pageable);

            List<ProductDTO> productDTOs = productPage.getContent().stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            return ApiResponse.success("Lấy danh sách sản phẩm liên quan thành công", productDTOs);
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lấy danh sách sản phẩm liên quan: " + e.getMessage());
        }
    }

    // Helper methods

    private Sort createSort(String sortBy, String sortDir) {
        Sort.Direction direction = "asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC;

        switch (sortBy) {
            case "price":
                return Sort.by(direction, "price");
            case "productName":
                return Sort.by(direction, "productName");
            case "soldQuantity":
                return Sort.by(direction, "soldQuantity");
            case "stock":
                return Sort.by(direction, "stock");
            default:
                return Sort.by(direction, "createdDate");
        }
    }

    private String generateSKU() {
        return "PRD-" + System.currentTimeMillis();
    }

    // Convert Entity to DTO
    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setProductName(product.getProductName());
        dto.setDescription(product.getDescription());
        dto.setImage(product.getImage());
        dto.setCreatedDate(product.getCreatedDate());
        dto.setPrice(product.getPrice());
        dto.setSalePrice(product.getSalePrice());
        dto.setEffectivePrice(product.getEffectivePrice());
        dto.setDiscountPercentage(product.getDiscountPercentage());
        dto.setStock(product.getStock());
        dto.setSku(product.getSku());
        dto.setStatus(product.getStatus());
        dto.setFeatured(product.getFeatured());
        dto.setWeight(product.getWeight());
        dto.setDimensions(product.getDimensions());
        dto.setMetaTitle(product.getMetaTitle());
        dto.setMetaDescription(product.getMetaDescription());
        dto.setTags(product.getTags());
        dto.setSoldQuantity(product.getSoldQuantity());
        dto.setLowStockThreshold(product.getLowStockThreshold());

        // Set status flags
        dto.setIsLowStock(product.isLowStock());
        dto.setIsOutOfStock(product.isOutOfStock());
        dto.setIsOnSale(product.isOnSale());

        // Set related entities
        if (product.getProductType() != null) {
            dto.setProductTypeId(product.getProductType().getId());
            dto.setProductTypeName(product.getProductType().getProductTypeName());

            if (product.getProductType().getCategory() != null) {
                dto.setCategoryName(product.getProductType().getCategory().getCategoryName());
            }
        }

        if (product.getBrand() != null) {
            dto.setBrandId(product.getBrand().getId());
            dto.setBrandName(product.getBrand().getBrandName());
        }

        if (product.getSize() != null) {
            dto.setSizeId(product.getSize().getId());
            dto.setSizeName(product.getSize().getSizeName());
        }

        return dto;
    }
}