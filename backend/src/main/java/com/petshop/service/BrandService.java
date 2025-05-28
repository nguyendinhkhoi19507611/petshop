package com.petshop.service;

import com.petshop.dto.ApiResponse;
import com.petshop.dto.BrandDTO;
import com.petshop.dto.BrandRequest;
import com.petshop.entity.Brand;
import com.petshop.exception.ResourceNotFoundException;
import com.petshop.exception.DuplicateResourceException;
import com.petshop.repository.BrandRepository;
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
public class BrandService {

    @Autowired
    private BrandRepository brandRepository;

    // Lấy tất cả thương hiệu với phân trang và tìm kiếm
    public ApiResponse<List<BrandDTO>> getAllBrands(int page, int size, String search, Boolean status) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Brand> brandPage;

            if (status != null) {
                // Lọc theo trạng thái
                brandPage = brandRepository.findByStatusOrderByBrandNameAsc(status, pageable);
            } else if (search != null && !search.trim().isEmpty()) {
                // Tìm kiếm
                brandPage = brandRepository.searchBrands(search.trim(), pageable);
            } else {
                // Lấy tất cả
                brandPage = brandRepository.findAllByOrderByBrandNameAsc(pageable);
            }

            List<BrandDTO> brandDTOs = brandPage.getContent().stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            // Thêm metadata cho phân trang
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("totalElements", brandPage.getTotalElements());
            metadata.put("totalPages", brandPage.getTotalPages());
            metadata.put("currentPage", page);
            metadata.put("pageSize", size);
            metadata.put("hasNext", brandPage.hasNext());
            metadata.put("hasPrevious", brandPage.hasPrevious());

            ApiResponse<List<BrandDTO>> response = ApiResponse.success(
                    "Lấy danh sách thương hiệu thành công", brandDTOs);
            response.setMetadata(metadata);

            return response;
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lấy danh sách thương hiệu: " + e.getMessage());
        }
    }

    // Lấy thương hiệu hoạt động (không phân trang - cho dropdown)
    public ApiResponse<List<BrandDTO>> getActiveBrands() {
        try {
            List<Brand> brands = brandRepository.findByStatusOrderByBrandNameAsc(true);
            List<BrandDTO> brandDTOs = brands.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            return ApiResponse.success("Lấy danh sách thương hiệu hoạt động thành công", brandDTOs);
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lấy danh sách thương hiệu: " + e.getMessage());
        }
    }

    // Lấy thương hiệu theo ID
    public ApiResponse<BrandDTO> getBrandById(Long id) {
        try {
            Brand brand = brandRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thương hiệu với ID: " + id));

            BrandDTO brandDTO = convertToDTO(brand);
            return ApiResponse.success("Lấy thông tin thương hiệu thành công", brandDTO);
        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lấy thông tin thương hiệu: " + e.getMessage());
        }
    }

    // Tạo thương hiệu mới
    public ApiResponse<BrandDTO> createBrand(BrandRequest request) {
        try {
            // Kiểm tra tên thương hiệu đã tồn tại
            if (brandRepository.existsByBrandName(request.getBrandName())) {
                throw new DuplicateResourceException("Tên thương hiệu đã tồn tại: " + request.getBrandName());
            }

            Brand brand = new Brand();
            brand.setBrandName(request.getBrandName());
            brand.setDescription(request.getDescription());
            brand.setLogoUrl(request.getLogoUrl());
            brand.setWebsite(request.getWebsite());
            brand.setStatus(request.getStatus() != null ? request.getStatus() : true);

            Brand savedBrand = brandRepository.save(brand);
            BrandDTO brandDTO = convertToDTO(savedBrand);

            return ApiResponse.success("Tạo thương hiệu thành công", brandDTO);
        } catch (DuplicateResourceException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi tạo thương hiệu: " + e.getMessage());
        }
    }

    // Cập nhật thương hiệu
    public ApiResponse<BrandDTO> updateBrand(Long id, BrandRequest request) {
        try {
            Brand brand = brandRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thương hiệu với ID: " + id));

            // Kiểm tra tên thương hiệu đã tồn tại (loại trừ ID hiện tại)
            if (brandRepository.existsByBrandNameAndIdNot(request.getBrandName(), id)) {
                throw new DuplicateResourceException("Tên thương hiệu đã tồn tại: " + request.getBrandName());
            }

            brand.setBrandName(request.getBrandName());
            brand.setDescription(request.getDescription());
            brand.setLogoUrl(request.getLogoUrl());
            brand.setWebsite(request.getWebsite());
            if (request.getStatus() != null) {
                brand.setStatus(request.getStatus());
            }

            Brand updatedBrand = brandRepository.save(brand);
            BrandDTO brandDTO = convertToDTO(updatedBrand);

            return ApiResponse.success("Cập nhật thương hiệu thành công", brandDTO);
        } catch (ResourceNotFoundException | DuplicateResourceException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi cập nhật thương hiệu: " + e.getMessage());
        }
    }

    // Xóa thương hiệu
    public ApiResponse<Void> deleteBrand(Long id) {
        try {
            Brand brand = brandRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thương hiệu với ID: " + id));

            // TODO: Kiểm tra xem thương hiệu có sản phẩm không trước khi xóa
            // Hiện tại chưa có entity Product nên tạm thời bỏ qua

            brandRepository.delete(brand);
            return ApiResponse.success("Xóa thương hiệu thành công");
        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi xóa thương hiệu: " + e.getMessage());
        }
    }

    // Bật/tắt trạng thái thương hiệu
    public ApiResponse<BrandDTO> toggleBrandStatus(Long id) {
        try {
            Brand brand = brandRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thương hiệu với ID: " + id));

            brand.setStatus(!brand.getStatus());
            Brand updatedBrand = brandRepository.save(brand);
            BrandDTO brandDTO = convertToDTO(updatedBrand);

            String message = brand.getStatus() ? "Kích hoạt thương hiệu thành công" : "Vô hiệu hóa thương hiệu thành công";
            return ApiResponse.success(message, brandDTO);
        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi thay đổi trạng thái thương hiệu: " + e.getMessage());
        }
    }

    // Lấy top thương hiệu theo số lượng sản phẩm
    public ApiResponse<List<BrandDTO>> getTopBrands(int limit) {
        try {
            Pageable pageable = PageRequest.of(0, limit);
            Page<Brand> topBrands = brandRepository.findTopBrandsByProductCount(pageable);

            List<BrandDTO> brandDTOs = topBrands.getContent().stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            return ApiResponse.success("Lấy top thương hiệu thành công", brandDTOs);
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lấy top thương hiệu: " + e.getMessage());
        }
    }

    // Convert Entity to DTO
    private BrandDTO convertToDTO(Brand brand) {
        BrandDTO dto = new BrandDTO();
        dto.setId(brand.getId());
        dto.setBrandName(brand.getBrandName());
        dto.setDescription(brand.getDescription());
        dto.setLogoUrl(brand.getLogoUrl());
        dto.setWebsite(brand.getWebsite());
        dto.setStatus(brand.getStatus());

        // TODO: Thêm product count khi có Product entity
        dto.setProductCount(0L);

        return dto;
    }
}