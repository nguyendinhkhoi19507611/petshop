package com.petshop.service;

import com.petshop.dto.ApiResponse;
import com.petshop.dto.ProductTypeDTO;
import com.petshop.dto.ProductTypeRequest;
import com.petshop.entity.Category;
import com.petshop.entity.ProductType;
import com.petshop.exception.ResourceNotFoundException;
import com.petshop.exception.DuplicateResourceException;
import com.petshop.repository.CategoryRepository;
import com.petshop.repository.ProductTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductTypeService {

    @Autowired
    private ProductTypeRepository productTypeRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    // Lấy tất cả loại sản phẩm với phân trang và tìm kiếm
    public ApiResponse<List<ProductTypeDTO>> getAllProductTypes(int page, int size, String search, Boolean status, Long categoryId) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<ProductType> productTypePage;

            if (categoryId != null) {
                productTypePage = productTypeRepository.findByCategoryIdOrderByProductTypeNameAsc(categoryId, pageable);
            } else if (status != null) {
                productTypePage = productTypeRepository.findByStatusOrderByProductTypeNameAsc(status, pageable);
            } else if (search != null && !search.trim().isEmpty()) {
                productTypePage = productTypeRepository.searchProductTypes(search.trim(), pageable);
            } else {
                productTypePage = productTypeRepository.findAllByOrderByProductTypeNameAsc(pageable);
            }

            List<ProductTypeDTO> productTypeDTOs = productTypePage.getContent().stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            // Thêm metadata cho phân trang
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("totalElements", productTypePage.getTotalElements());
            metadata.put("totalPages", productTypePage.getTotalPages());
            metadata.put("currentPage", page);
            metadata.put("pageSize", size);
            metadata.put("hasNext", productTypePage.hasNext());
            metadata.put("hasPrevious", productTypePage.hasPrevious());

            ApiResponse<List<ProductTypeDTO>> response = ApiResponse.success(
                    "Lấy danh sách loại sản phẩm thành công", productTypeDTOs);
            response.setMetadata(metadata);

            return response;
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lấy danh sách loại sản phẩm: " + e.getMessage());
        }
    }

    // Lấy loại sản phẩm hoạt động (không phân trang - cho dropdown)
    public ApiResponse<List<ProductTypeDTO>> getActiveProductTypes() {
        try {
            List<ProductType> productTypes = productTypeRepository.findByStatusOrderByProductTypeNameAsc(true);
            List<ProductTypeDTO> productTypeDTOs = productTypes.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            return ApiResponse.success("Lấy danh sách loại sản phẩm hoạt động thành công", productTypeDTOs);
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lấy danh sách loại sản phẩm: " + e.getMessage());
        }
    }

    // Lấy loại sản phẩm theo danh mục
    public ApiResponse<List<ProductTypeDTO>> getProductTypesByCategory(Long categoryId) {
        try {
            List<ProductType> productTypes = productTypeRepository.findByCategoryIdAndStatusOrderByProductTypeNameAsc(categoryId, true);
            List<ProductTypeDTO> productTypeDTOs = productTypes.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            return ApiResponse.success("Lấy danh sách loại sản phẩm theo danh mục thành công", productTypeDTOs);
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lấy danh sách loại sản phẩm: " + e.getMessage());
        }
    }

    // Lấy loại sản phẩm theo ID
    public ApiResponse<ProductTypeDTO> getProductTypeById(Long id) {
        try {
            ProductType productType = productTypeRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy loại sản phẩm với ID: " + id));

            ProductTypeDTO productTypeDTO = convertToDTO(productType);
            return ApiResponse.success("Lấy thông tin loại sản phẩm thành công", productTypeDTO);
        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lấy thông tin loại sản phẩm: " + e.getMessage());
        }
    }

    // Tạo loại sản phẩm mới
    public ApiResponse<ProductTypeDTO> createProductType(ProductTypeRequest request) {
        try {
            // Kiểm tra tên loại sản phẩm đã tồn tại
            if (productTypeRepository.existsByProductTypeName(request.getProductTypeName())) {
                throw new DuplicateResourceException("Tên loại sản phẩm đã tồn tại: " + request.getProductTypeName());
            }

            // Kiểm tra danh mục có tồn tại
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với ID: " + request.getCategoryId()));

            ProductType productType = new ProductType();
            productType.setProductTypeName(request.getProductTypeName());
            productType.setType(request.getType());
            productType.setCategory(category);
            productType.setDescription(request.getDescription());
            productType.setStatus(request.getStatus() != null ? request.getStatus() : true);

            ProductType savedProductType = productTypeRepository.save(productType);
            ProductTypeDTO productTypeDTO = convertToDTO(savedProductType);

            return ApiResponse.success("Tạo loại sản phẩm thành công", productTypeDTO);
        } catch (DuplicateResourceException | ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi tạo loại sản phẩm: " + e.getMessage());
        }
    }

    // Cập nhật loại sản phẩm
    public ApiResponse<ProductTypeDTO> updateProductType(Long id, ProductTypeRequest request) {
        try {
            ProductType productType = productTypeRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy loại sản phẩm với ID: " + id));

            // Kiểm tra tên loại sản phẩm đã tồn tại (loại trừ ID hiện tại)
            if (productTypeRepository.existsByProductTypeNameAndIdNot(request.getProductTypeName(), id)) {
                throw new DuplicateResourceException("Tên loại sản phẩm đã tồn tại: " + request.getProductTypeName());
            }

            // Kiểm tra danh mục có tồn tại
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với ID: " + request.getCategoryId()));

            productType.setProductTypeName(request.getProductTypeName());
            productType.setType(request.getType());
            productType.setCategory(category);
            productType.setDescription(request.getDescription());
            if (request.getStatus() != null) {
                productType.setStatus(request.getStatus());
            }

            ProductType updatedProductType = productTypeRepository.save(productType);
            ProductTypeDTO productTypeDTO = convertToDTO(updatedProductType);

            return ApiResponse.success("Cập nhật loại sản phẩm thành công", productTypeDTO);
        } catch (ResourceNotFoundException | DuplicateResourceException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi cập nhật loại sản phẩm: " + e.getMessage());
        }
    }

    // Xóa loại sản phẩm
    public ApiResponse<Void> deleteProductType(Long id) {
        try {
            ProductType productType = productTypeRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy loại sản phẩm với ID: " + id));

            // Kiểm tra xem loại sản phẩm có sản phẩm không trước khi xóa
            if (productTypeRepository.hasProducts(id)) {
                return ApiResponse.error("Không thể xóa loại sản phẩm đã có sản phẩm");
            }

            productTypeRepository.delete(productType);
            return ApiResponse.success("Xóa loại sản phẩm thành công");
        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi xóa loại sản phẩm: " + e.getMessage());
        }
    }

    // Bật/tắt trạng thái loại sản phẩm
    public ApiResponse<ProductTypeDTO> toggleProductTypeStatus(Long id) {
        try {
            ProductType productType = productTypeRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy loại sản phẩm với ID: " + id));

            productType.setStatus(!productType.getStatus());
            ProductType updatedProductType = productTypeRepository.save(productType);
            ProductTypeDTO productTypeDTO = convertToDTO(updatedProductType);

            String message = productType.getStatus() ? "Kích hoạt loại sản phẩm thành công" : "Vô hiệu hóa loại sản phẩm thành công";
            return ApiResponse.success(message, productTypeDTO);
        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi thay đổi trạng thái loại sản phẩm: " + e.getMessage());
        }
    }

    // Lấy loại sản phẩm theo type code
    public ApiResponse<List<ProductTypeDTO>> getProductTypesByType(Integer type) {
        try {
            List<ProductType> productTypes = productTypeRepository.findByTypeAndStatusOrderByProductTypeNameAsc(type, true);
            List<ProductTypeDTO> productTypeDTOs = productTypes.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            return ApiResponse.success("Lấy danh sách loại sản phẩm theo type thành công", productTypeDTOs);
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lấy danh sách loại sản phẩm: " + e.getMessage());
        }
    }

    // Convert Entity to DTO
    private ProductTypeDTO convertToDTO(ProductType productType) {
        ProductTypeDTO dto = new ProductTypeDTO();
        dto.setId(productType.getId());
        dto.setProductTypeName(productType.getProductTypeName());
        dto.setType(productType.getType());
        dto.setDescription(productType.getDescription());
        dto.setStatus(productType.getStatus());

        if (productType.getCategory() != null) {
            dto.setCategoryId(productType.getCategory().getId());
            dto.setCategoryName(productType.getCategory().getCategoryName());
        }

        // TODO: Thêm product count khi có Product entity relationship
        dto.setProductCount(0L);

        return dto;
    }
}