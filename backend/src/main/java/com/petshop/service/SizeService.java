package com.petshop.service;

import com.petshop.dto.ApiResponse;
import com.petshop.dto.SizeDTO;
import com.petshop.dto.SizeRequest;
import com.petshop.entity.Size;
import com.petshop.exception.ResourceNotFoundException;
import com.petshop.exception.DuplicateResourceException;
import com.petshop.repository.SizeRepository;
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
public class SizeService {

    @Autowired
    private SizeRepository sizeRepository;

    // Lấy tất cả kích cỡ với phân trang và tìm kiếm
    public ApiResponse<List<SizeDTO>> getAllSizes(int page, int size, String search, Boolean status) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Size> sizePage;

            if (status != null) {
                // Lọc theo trạng thái
                sizePage = sizeRepository.findByStatusOrderByDisplayOrderAscSizeNameAsc(status, pageable);
            } else if (search != null && !search.trim().isEmpty()) {
                // Tìm kiếm
                sizePage = sizeRepository.searchSizes(search.trim(), pageable);
            } else {
                // Lấy tất cả
                sizePage = sizeRepository.findAllByOrderByDisplayOrderAscSizeNameAsc(pageable);
            }

            List<SizeDTO> sizeDTOs = sizePage.getContent().stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            // Thêm metadata cho phân trang
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("totalElements", sizePage.getTotalElements());
            metadata.put("totalPages", sizePage.getTotalPages());
            metadata.put("currentPage", page);
            metadata.put("pageSize", size);
            metadata.put("hasNext", sizePage.hasNext());
            metadata.put("hasPrevious", sizePage.hasPrevious());

            ApiResponse<List<SizeDTO>> response = ApiResponse.success(
                    "Lấy danh sách kích cỡ thành công", sizeDTOs);
            response.setMetadata(metadata);

            return response;
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lấy danh sách kích cỡ: " + e.getMessage());
        }
    }

    // Lấy kích cỡ hoạt động (không phân trang - cho dropdown)
    public ApiResponse<List<SizeDTO>> getActiveSizes() {
        try {
            List<Size> sizes = sizeRepository.findByStatusOrderByDisplayOrderAscSizeNameAsc(true);
            List<SizeDTO> sizeDTOs = sizes.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            return ApiResponse.success("Lấy danh sách kích cỡ hoạt động thành công", sizeDTOs);
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lấy danh sách kích cỡ: " + e.getMessage());
        }
    }

    // Lấy kích cỡ theo ID
    public ApiResponse<SizeDTO> getSizeById(Long id) {
        try {
            Size size = sizeRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy kích cỡ với ID: " + id));

            SizeDTO sizeDTO = convertToDTO(size);
            return ApiResponse.success("Lấy thông tin kích cỡ thành công", sizeDTO);
        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lấy thông tin kích cỡ: " + e.getMessage());
        }
    }

    // Tạo kích cỡ mới
    public ApiResponse<SizeDTO> createSize(SizeRequest request) {
        try {
            // Kiểm tra tên kích cỡ đã tồn tại
            if (sizeRepository.existsBySizeName(request.getSizeName())) {
                throw new DuplicateResourceException("Tên kích cỡ đã tồn tại: " + request.getSizeName());
            }

            Size size = new Size();
            size.setSizeName(request.getSizeName());
            size.setDescription(request.getDescription());
            size.setValue(request.getValue());
            size.setUnit(request.getUnit());
            size.setStatus(request.getStatus() != null ? request.getStatus() : true);

            // Tự động gán thứ tự hiển thị nếu không có
            if (request.getDisplayOrder() == null) {
                Integer maxOrder = sizeRepository.findMaxDisplayOrder();
                size.setDisplayOrder(maxOrder == null ? 1 : maxOrder + 1);
            } else {
                size.setDisplayOrder(request.getDisplayOrder());
            }

            Size savedSize = sizeRepository.save(size);
            SizeDTO sizeDTO = convertToDTO(savedSize);

            return ApiResponse.success("Tạo kích cỡ thành công", sizeDTO);
        } catch (DuplicateResourceException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi tạo kích cỡ: " + e.getMessage());
        }
    }

    // Cập nhật kích cỡ
    public ApiResponse<SizeDTO> updateSize(Long id, SizeRequest request) {
        try {
            Size size = sizeRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy kích cỡ với ID: " + id));

            // Kiểm tra tên kích cỡ đã tồn tại (loại trừ ID hiện tại)
            if (sizeRepository.existsBySizeNameAndIdNot(request.getSizeName(), id)) {
                throw new DuplicateResourceException("Tên kích cỡ đã tồn tại: " + request.getSizeName());
            }

            size.setSizeName(request.getSizeName());
            size.setDescription(request.getDescription());
            size.setValue(request.getValue());
            size.setUnit(request.getUnit());
            if (request.getStatus() != null) {
                size.setStatus(request.getStatus());
            }
            if (request.getDisplayOrder() != null) {
                size.setDisplayOrder(request.getDisplayOrder());
            }

            Size updatedSize = sizeRepository.save(size);
            SizeDTO sizeDTO = convertToDTO(updatedSize);

            return ApiResponse.success("Cập nhật kích cỡ thành công", sizeDTO);
        } catch (ResourceNotFoundException | DuplicateResourceException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi cập nhật kích cỡ: " + e.getMessage());
        }
    }

    // Xóa kích cỡ
    public ApiResponse<Void> deleteSize(Long id) {
        try {
            Size size = sizeRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy kích cỡ với ID: " + id));

            // TODO: Kiểm tra xem kích cỡ có sản phẩm không trước khi xóa
            // Hiện tại chưa có entity Product nên tạm thời bỏ qua

            sizeRepository.delete(size);
            return ApiResponse.success("Xóa kích cỡ thành công");
        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi xóa kích cỡ: " + e.getMessage());
        }
    }

    // Bật/tắt trạng thái kích cỡ
    public ApiResponse<SizeDTO> toggleSizeStatus(Long id) {
        try {
            Size size = sizeRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy kích cỡ với ID: " + id));

            size.setStatus(!size.getStatus());
            Size updatedSize = sizeRepository.save(size);
            SizeDTO sizeDTO = convertToDTO(updatedSize);

            String message = size.getStatus() ? "Kích hoạt kích cỡ thành công" : "Vô hiệu hóa kích cỡ thành công";
            return ApiResponse.success(message, sizeDTO);
        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi thay đổi trạng thái kích cỡ: " + e.getMessage());
        }
    }

    // Lấy kích cỡ theo đơn vị
    public ApiResponse<List<SizeDTO>> getSizesByUnit(String unit) {
        try {
            List<Size> sizes = sizeRepository.findByUnitOrderByDisplayOrderAscSizeNameAsc(unit);
            List<SizeDTO> sizeDTOs = sizes.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            return ApiResponse.success("Lấy kích cỡ theo đơn vị thành công", sizeDTOs);
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lấy kích cỡ theo đơn vị: " + e.getMessage());
        }
    }

    // Cập nhật thứ tự hiển thị
    public ApiResponse<List<SizeDTO>> updateDisplayOrder(List<Long> sizeIds) {
        try {
            for (int i = 0; i < sizeIds.size(); i++) {
                Long sizeId = sizeIds.get(i);
                Size size = sizeRepository.findById(sizeId)
                        .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy kích cỡ với ID: " + sizeId));
                size.setDisplayOrder(i + 1);
                sizeRepository.save(size);
            }

            // Trả về danh sách đã cập nhật
            List<Size> updatedSizes = sizeRepository.findAllByOrderByDisplayOrderAscSizeNameAsc();
            List<SizeDTO> sizeDTOs = updatedSizes.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            return ApiResponse.success("Cập nhật thứ tự hiển thị thành công", sizeDTOs);
        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi cập nhật thứ tự hiển thị: " + e.getMessage());
        }
    }

    // Convert Entity to DTO
    private SizeDTO convertToDTO(Size size) {
        SizeDTO dto = new SizeDTO();
        dto.setId(size.getId());
        dto.setSizeName(size.getSizeName());
        dto.setDescription(size.getDescription());
        dto.setValue(size.getValue());
        dto.setUnit(size.getUnit());
        dto.setDisplayOrder(size.getDisplayOrder());
        dto.setStatus(size.getStatus());

        // TODO: Thêm product count khi có Product entity
        dto.setProductCount(0L);

        return dto;
    }
}