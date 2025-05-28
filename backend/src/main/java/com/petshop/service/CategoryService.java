package com.petshop.service;

import com.petshop.dto.ApiResponse;
import com.petshop.dto.CategoryDTO;
import com.petshop.dto.CategoryRequest;
import com.petshop.entity.Category;
import com.petshop.exception.ResourceNotFoundException;
import com.petshop.exception.DuplicateResourceException;
import com.petshop.repository.CategoryRepository;
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
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // Lấy tất cả danh mục với phân trang
    public ApiResponse<List<CategoryDTO>> getAllCategories(int page, int size, String search) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Category> categoryPage;

            if (search != null && !search.trim().isEmpty()) {
                categoryPage = categoryRepository.searchCategories(search.trim(), pageable);
            } else {
                categoryPage = categoryRepository.findAllByOrderByCategoryNameAsc(pageable);
            }

            List<CategoryDTO> categoryDTOs = categoryPage.getContent().stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            // Thêm metadata cho phân trang
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("totalElements", categoryPage.getTotalElements());
            metadata.put("totalPages", categoryPage.getTotalPages());
            metadata.put("currentPage", page);
            metadata.put("pageSize", size);
            metadata.put("hasNext", categoryPage.hasNext());
            metadata.put("hasPrevious", categoryPage.hasPrevious());

            ApiResponse<List<CategoryDTO>> response = ApiResponse.success(
                    "Lấy danh sách danh mục thành công", categoryDTOs);
            response.setMetadata(metadata);

            return response;
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lấy danh sách danh mục: " + e.getMessage());
        }
    }

    // Lấy tất cả danh mục hoạt động (không phân trang)
    public ApiResponse<List<CategoryDTO>> getActiveCategories() {
        try {
            List<Category> categories = categoryRepository.findByStatusOrderByCategoryNameAsc(true);
            List<CategoryDTO> categoryDTOs = categories.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            return ApiResponse.success("Lấy danh sách danh mục hoạt động thành công", categoryDTOs);
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lấy danh sách danh mục: " + e.getMessage());
        }
    }

    // Lấy danh mục theo ID
    public ApiResponse<CategoryDTO> getCategoryById(Long id) {
        try {
            Category category = categoryRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với ID: " + id));

            CategoryDTO categoryDTO = convertToDTO(category);
            return ApiResponse.success("Lấy thông tin danh mục thành công", categoryDTO);
        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lấy thông tin danh mục: " + e.getMessage());
        }
    }

    // Tạo danh mục mới
    public ApiResponse<CategoryDTO> createCategory(CategoryRequest request) {
        try {
            // Kiểm tra tên danh mục đã tồn tại
            if (categoryRepository.existsByCategoryName(request.getCategoryName())) {
                throw new DuplicateResourceException("Tên danh mục đã tồn tại: " + request.getCategoryName());
            }

            Category category = new Category();
            category.setCategoryName(request.getCategoryName());
            category.setDescription(request.getDescription());
            category.setStatus(request.getStatus() != null ? request.getStatus() : true);

            Category savedCategory = categoryRepository.save(category);
            CategoryDTO categoryDTO = convertToDTO(savedCategory);

            return ApiResponse.success("Tạo danh mục thành công", categoryDTO);
        } catch (DuplicateResourceException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi tạo danh mục: " + e.getMessage());
        }
    }

    // Cập nhật danh mục
    public ApiResponse<CategoryDTO> updateCategory(Long id, CategoryRequest request) {
        try {
            Category category = categoryRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với ID: " + id));

            // Kiểm tra tên danh mục đã tồn tại (loại trừ ID hiện tại)
            if (categoryRepository.existsByCategoryNameAndIdNot(request.getCategoryName(), id)) {
                throw new DuplicateResourceException("Tên danh mục đã tồn tại: " + request.getCategoryName());
            }

            category.setCategoryName(request.getCategoryName());
            category.setDescription(request.getDescription());
            if (request.getStatus() != null) {
                category.setStatus(request.getStatus());
            }

            Category updatedCategory = categoryRepository.save(category);
            CategoryDTO categoryDTO = convertToDTO(updatedCategory);

            return ApiResponse.success("Cập nhật danh mục thành công", categoryDTO);
        } catch (ResourceNotFoundException | DuplicateResourceException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi cập nhật danh mục: " + e.getMessage());
        }
    }

    // Xóa danh mục
    public ApiResponse<Void> deleteCategory(Long id) {
        try {
            Category category = categoryRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với ID: " + id));

            // TODO: Kiểm tra xem danh mục có sản phẩm không trước khi xóa
            // Hiện tại chưa có entity Product nên tạm thời bỏ qua

            categoryRepository.delete(category);
            return ApiResponse.success("Xóa danh mục thành công");
        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi xóa danh mục: " + e.getMessage());
        }
    }

    // Bật/tắt trạng thái danh mục
    public ApiResponse<CategoryDTO> toggleCategoryStatus(Long id) {
        try {
            Category category = categoryRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với ID: " + id));

            category.setStatus(!category.getStatus());
            Category updatedCategory = categoryRepository.save(category);
            CategoryDTO categoryDTO = convertToDTO(updatedCategory);

            String message = category.getStatus() ? "Kích hoạt danh mục thành công" : "Vô hiệu hóa danh mục thành công";
            return ApiResponse.success(message, categoryDTO);
        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi thay đổi trạng thái danh mục: " + e.getMessage());
        }
    }

    // Lấy sản phẩm theo danh mục (sẽ implement sau khi có Product entity)
    public ApiResponse<List<Object>> getProductsByCategory(Long categoryId) {
        try {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với ID: " + categoryId));

            // TODO: Implement khi có Product entity và ProductService
            return ApiResponse.success("Tính năng sẽ được implement trong phase tiếp theo", List.of());
        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lấy sản phẩm theo danh mục: " + e.getMessage());
        }
    }

    // Convert Entity to DTO
    private CategoryDTO convertToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setCategoryName(category.getCategoryName());
        dto.setDescription(category.getDescription());
        dto.setStatus(category.getStatus());

        // TODO: Thêm product count khi có Product entity
        dto.setProductCount(0L);

        return dto;
    }
}