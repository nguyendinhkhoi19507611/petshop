package com.petshop.service;

import com.petshop.dto.*;
import com.petshop.entity.*;
import com.petshop.exception.DuplicateResourceException;
import com.petshop.exception.ResourceNotFoundException;
import com.petshop.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class PromotionService {

    @Autowired
    private PromotionRepository promotionRepository;

    @Autowired
    private PromotionUsageRepository promotionUsageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    // Lấy tất cả khuyến mãi
    public ApiResponse<List<PromotionDTO>> getAllPromotions(int page, int size, String search, Boolean status) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Promotion> promotionPage;

            if (status != null) {
                promotionPage = promotionRepository.findByStatusOrderByStartDateDesc(status, pageable);
            } else if (search != null && !search.trim().isEmpty()) {
                promotionPage = promotionRepository.searchPromotions(search.trim(), pageable);
            } else {
                promotionPage = promotionRepository.findAll(pageable);
            }

            List<PromotionDTO> promotionDTOs = promotionPage.getContent().stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            Map<String, Object> metadata = new HashMap<>();
            metadata.put("totalElements", promotionPage.getTotalElements());
            metadata.put("totalPages", promotionPage.getTotalPages());
            metadata.put("currentPage", page);
            metadata.put("pageSize", size);
            metadata.put("hasNext", promotionPage.hasNext());
            metadata.put("hasPrevious", promotionPage.hasPrevious());

            ApiResponse<List<PromotionDTO>> response = ApiResponse.success("Lấy danh sách khuyến mãi thành công", promotionDTOs);
            response.setMetadata(metadata);

            return response;
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lấy danh sách khuyến mãi: " + e.getMessage());
        }
    }

    // Lấy khuyến mãi theo ID
    public ApiResponse<PromotionDTO> getPromotionById(Long id) {
        try {
            Promotion promotion = promotionRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khuyến mãi với ID: " + id));

            PromotionDTO promotionDTO = convertToDTO(promotion);
            return ApiResponse.success("Lấy thông tin khuyến mãi thành công", promotionDTO);
        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lấy thông tin khuyến mãi: " + e.getMessage());
        }
    }

    // Tạo khuyến mãi mới
    public ApiResponse<PromotionDTO> createPromotion(PromotionRequest request) {
        try {
            // Kiểm tra mã giảm giá đã tồn tại
            if (promotionRepository.existsByCouponCode(request.getCouponCode())) {
                throw new DuplicateResourceException("Mã giảm giá đã tồn tại: " + request.getCouponCode());
            }

            Promotion promotion = new Promotion();
            promotion.setPromotionName(request.getPromotionName());
            promotion.setDescription(request.getDescription());
            promotion.setCouponCode(request.getCouponCode().toUpperCase());
            promotion.setDiscountType(request.getDiscountType());
            promotion.setDiscountValue(request.getDiscountValue());
            promotion.setMaxDiscountAmount(request.getMaxDiscountAmount());
            promotion.setMinOrderAmount(request.getMinOrderAmount());
            promotion.setMaxUsageCount(request.getMaxUsageCount());
            promotion.setLimitPerCustomer(request.getLimitPerCustomer());
            promotion.setStartDate(request.getStartDate());
            promotion.setEndDate(request.getEndDate());
            promotion.setStatus(request.getStatus());
            promotion.setApplicableType(request.getApplicableType());
            promotion.setForNewCustomersOnly(request.getForNewCustomersOnly());

            // Set applicable products/categories
            if (request.getApplicableProductIds() != null && !request.getApplicableProductIds().isEmpty()) {
                List<Product> products = productRepository.findAllById(request.getApplicableProductIds());
                promotion.setApplicableProducts(products);
            }

            if (request.getApplicableCategoryIds() != null && !request.getApplicableCategoryIds().isEmpty()) {
                List<Category> categories = categoryRepository.findAllById(request.getApplicableCategoryIds());
                promotion.setApplicableCategories(categories);
            }

            Promotion savedPromotion = promotionRepository.save(promotion);
            PromotionDTO promotionDTO = convertToDTO(savedPromotion);

            return ApiResponse.success("Tạo khuyến mãi thành công", promotionDTO);
        } catch (DuplicateResourceException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi tạo khuyến mãi: " + e.getMessage());
        }
    }

    // Cập nhật khuyến mãi
    public ApiResponse<PromotionDTO> updatePromotion(Long id, PromotionRequest request) {
        try {
            Promotion promotion = promotionRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khuyến mãi với ID: " + id));

            // Kiểm tra mã giảm giá đã tồn tại (loại trừ ID hiện tại)
            if (promotionRepository.existsByCouponCodeAndIdNot(request.getCouponCode(), id)) {
                throw new DuplicateResourceException("Mã giảm giá đã tồn tại: " + request.getCouponCode());
            }

            promotion.setPromotionName(request.getPromotionName());
            promotion.setDescription(request.getDescription());
            promotion.setCouponCode(request.getCouponCode().toUpperCase());
            promotion.setDiscountType(request.getDiscountType());
            promotion.setDiscountValue(request.getDiscountValue());
            promotion.setMaxDiscountAmount(request.getMaxDiscountAmount());
            promotion.setMinOrderAmount(request.getMinOrderAmount());
            promotion.setMaxUsageCount(request.getMaxUsageCount());
            promotion.setLimitPerCustomer(request.getLimitPerCustomer());
            promotion.setStartDate(request.getStartDate());
            promotion.setEndDate(request.getEndDate());
            promotion.setStatus(request.getStatus());
            promotion.setApplicableType(request.getApplicableType());
            promotion.setForNewCustomersOnly(request.getForNewCustomersOnly());

            // Update applicable products/categories
            if (request.getApplicableProductIds() != null) {
                List<Product> products = productRepository.findAllById(request.getApplicableProductIds());
                promotion.setApplicableProducts(products);
            }

            if (request.getApplicableCategoryIds() != null) {
                List<Category> categories = categoryRepository.findAllById(request.getApplicableCategoryIds());
                promotion.setApplicableCategories(categories);
            }

            Promotion updatedPromotion = promotionRepository.save(promotion);
            PromotionDTO promotionDTO = convertToDTO(updatedPromotion);

            return ApiResponse.success("Cập nhật khuyến mãi thành công", promotionDTO);
        } catch (ResourceNotFoundException | DuplicateResourceException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi cập nhật khuyến mãi: " + e.getMessage());
        }
    }

    // Xóa khuyến mãi
    public ApiResponse<Void> deletePromotion(Long id) {
        try {
            Promotion promotion = promotionRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khuyến mãi với ID: " + id));

            // Kiểm tra xem có đơn hàng nào đang sử dụng không
            boolean hasUsage = !promotionUsageRepository.findByPromotionIdOrderByUsedAtDesc(id).isEmpty();
            if (hasUsage) {
                return ApiResponse.error("Không thể xóa khuyến mãi đã được sử dụng");
            }

            promotionRepository.delete(promotion);
            return ApiResponse.success("Xóa khuyến mãi thành công");
        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi xóa khuyến mãi: " + e.getMessage());
        }
    }

    // Lấy khuyến mãi đang hoạt động
    public ApiResponse<List<PromotionDTO>> getActivePromotions(int page, int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Promotion> promotionPage = promotionRepository.findActivePromotions(LocalDateTime.now(), pageable);

            List<PromotionDTO> promotionDTOs = promotionPage.getContent().stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            Map<String, Object> metadata = new HashMap<>();
            metadata.put("totalElements", promotionPage.getTotalElements());
            metadata.put("totalPages", promotionPage.getTotalPages());
            metadata.put("currentPage", page);
            metadata.put("pageSize", size);

            ApiResponse<List<PromotionDTO>> response = ApiResponse.success("Lấy danh sách khuyến mãi đang hoạt động thành công", promotionDTOs);
            response.setMetadata(metadata);

            return response;
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lấy danh sách khuyến mãi đang hoạt động: " + e.getMessage());
        }
    }

    // Bật/tắt trạng thái khuyến mãi
    public ApiResponse<PromotionDTO> togglePromotionStatus(Long id) {
        try {
            Promotion promotion = promotionRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khuyến mãi với ID: " + id));

            promotion.setStatus(!promotion.getStatus());
            Promotion updatedPromotion = promotionRepository.save(promotion);
            PromotionDTO promotionDTO = convertToDTO(updatedPromotion);

            String message = promotion.getStatus() ? "Kích hoạt khuyến mãi thành công" : "Vô hiệu hóa khuyến mãi thành công";
            return ApiResponse.success(message, promotionDTO);
        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi thay đổi trạng thái khuyến mãi: " + e.getMessage());
        }
    }

    // Validate mã giảm giá
    public ApiResponse<ValidateCouponResponse> validateCoupon(ValidateCouponRequest request) {
        try {
            Promotion promotion = promotionRepository.findByCouponCode(request.getCouponCode().toUpperCase())
                    .orElse(null);

            if (promotion == null) {
                return ApiResponse.success("Validation completed",
                        new ValidateCouponResponse(false, "Mã giảm giá không tồn tại"));
            }

            if (!promotion.isActive()) {
                String message = "Mã giảm giá ";
                LocalDateTime now = LocalDateTime.now();
                if (now.isBefore(promotion.getStartDate())) {
                    message += "chưa có hiệu lực";
                } else if (now.isAfter(promotion.getEndDate())) {
                    message += "đã hết hạn";
                } else {
                    message += "không hoạt động";
                }
                return ApiResponse.success("Validation completed",
                        new ValidateCouponResponse(false, message));
            }

            if (!promotion.isAvailable()) {
                return ApiResponse.success("Validation completed",
                        new ValidateCouponResponse(false, "Mã giảm giá đã hết lượt sử dụng"));
            }

            if (request.getOrderAmount().compareTo(promotion.getMinOrderAmount()) < 0) {
                return ApiResponse.success("Validation completed",
                        new ValidateCouponResponse(false,
                                "Đơn hàng phải có giá trị tối thiểu " + promotion.getMinOrderAmount() + " VNĐ"));
            }

            // Kiểm tra user-specific conditions
            if (request.getUserId() != null) {
                User user = userRepository.findById(request.getUserId()).orElse(null);
                if (user != null && !promotion.canBeUsedBy(user)) {
                    if (promotion.getForNewCustomersOnly() && orderRepository.hasCompletedOrdersByUserId(request.getUserId())) {
                        return ApiResponse.success("Validation completed",
                                new ValidateCouponResponse(false, "Mã giảm giá chỉ dành cho khách hàng mới"));
                    }

                    Long userUsageCount = promotionRepository.countUsageByPromotionAndUser(promotion.getId(), request.getUserId());
                    if (userUsageCount >= promotion.getLimitPerCustomer()) {
                        return ApiResponse.success("Validation completed",
                                new ValidateCouponResponse(false, "Bạn đã sử dụng hết lượt cho mã giảm giá này"));
                    }
                }
            }

            // Tính toán giảm giá
            BigDecimal discountAmount = promotion.calculateDiscount(request.getOrderAmount());

            return ApiResponse.success("Validation completed",
                    new ValidateCouponResponse(true, "Mã giảm giá hợp lệ", discountAmount,
                            promotion.getCouponCode(), promotion.getPromotionName()));

        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi validate mã giảm giá: " + e.getMessage());
        }
    }

    // Lấy khuyến mãi có thể áp dụng cho user
    public ApiResponse<List<PromotionDTO>> getApplicablePromotions(Long userId) {
        try {
            boolean isNewCustomer = false;
            if (userId != null) {
                isNewCustomer = !orderRepository.hasCompletedOrdersByUserId(userId);
            }

            List<Promotion> promotions = promotionRepository.findApplicablePromotions(
                    LocalDateTime.now(), false, isNewCustomer);

            // Filter by user usage limit
            if (userId != null) {
                promotions = promotions.stream()
                        .filter(promotion -> {
                            Long userUsageCount = promotionRepository.countUsageByPromotionAndUser(promotion.getId(), userId);
                            return userUsageCount < promotion.getLimitPerCustomer();
                        })
                        .collect(Collectors.toList());
            }

            List<PromotionDTO> promotionDTOs = promotions.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            return ApiResponse.success("Lấy danh sách khuyến mãi có thể áp dụng thành công", promotionDTOs);
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lấy danh sách khuyến mãi có thể áp dụng: " + e.getMessage());
        }
    }

    // Ghi nhận sử dụng khuyến mãi
    public void recordPromotionUsage(String couponCode, Long userId, Long orderId, BigDecimal discountAmount, BigDecimal orderAmount) {
        try {
            Promotion promotion = promotionRepository.findByCouponCode(couponCode.toUpperCase()).orElse(null);
            if (promotion == null) return;

            User user = userRepository.findById(userId).orElse(null);
            if (user == null) return;

            Order order = orderRepository.findById(orderId).orElse(null);
            if (order == null) return;

            // Tạo promotion usage record
            PromotionUsage usage = new PromotionUsage(promotion, user, order, discountAmount, orderAmount);
            promotionUsageRepository.save(usage);

            // Tăng usage count
            promotion.incrementUsageCount();
            promotionRepository.save(promotion);

        } catch (Exception e) {
            // Log error but don't throw exception to avoid affecting order creation
            System.err.println("Error recording promotion usage: " + e.getMessage());
        }
    }

    // Convert methods

    private PromotionDTO convertToDTO(Promotion promotion) {
        PromotionDTO dto = new PromotionDTO();
        dto.setId(promotion.getId());
        dto.setPromotionName(promotion.getPromotionName());
        dto.setDescription(promotion.getDescription());
        dto.setCouponCode(promotion.getCouponCode());
        dto.setDiscountType(promotion.getDiscountType());
        dto.setDiscountValue(promotion.getDiscountValue());
        dto.setMaxDiscountAmount(promotion.getMaxDiscountAmount());
        dto.setMinOrderAmount(promotion.getMinOrderAmount());
        dto.setMaxUsageCount(promotion.getMaxUsageCount());
        dto.setUsedCount(promotion.getUsedCount());
        dto.setLimitPerCustomer(promotion.getLimitPerCustomer());
        dto.setStartDate(promotion.getStartDate());
        dto.setEndDate(promotion.getEndDate());
        dto.setStatus(promotion.getStatus());
        dto.setApplicableType(promotion.getApplicableType());
        dto.setForNewCustomersOnly(promotion.getForNewCustomersOnly());

        if (promotion.getApplicableProducts() != null) {
            List<Long> productIds = promotion.getApplicableProducts().stream()
                    .map(Product::getId)
                    .collect(Collectors.toList());
            dto.setApplicableProductIds(productIds);
        }

        if (promotion.getApplicableCategories() != null) {
            List<Long> categoryIds = promotion.getApplicableCategories().stream()
                    .map(Category::getId)
                    .collect(Collectors.toList());
            dto.setApplicableCategoryIds(categoryIds);
        }

        return dto;
    }
}