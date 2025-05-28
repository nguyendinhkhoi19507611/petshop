package com.petshop.repository;

import com.petshop.entity.Promotion;
import com.petshop.entity.PromotionUsage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

// PromotionRepository.java
@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {

    // Tìm khuyến mãi theo mã giảm giá
    Optional<Promotion> findByCouponCode(String couponCode);

    // Kiểm tra mã giảm giá có tồn tại không
    boolean existsByCouponCode(String couponCode);

    // Kiểm tra mã giảm giá có tồn tại không (loại trừ ID hiện tại)
    boolean existsByCouponCodeAndIdNot(String couponCode, Long id);

    // Lấy khuyến mãi theo trạng thái
    Page<Promotion> findByStatusOrderByStartDateDesc(Boolean status, Pageable pageable);

    // Tìm kiếm khuyến mãi
    @Query("SELECT p FROM Promotion p WHERE " +
            "(:search IS NULL OR :search = '' OR " +
            "LOWER(p.promotionName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(p.couponCode) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "ORDER BY p.startDate DESC")
    Page<Promotion> searchPromotions(@Param("search") String search, Pageable pageable);

    // Lấy khuyến mãi đang hoạt động
    @Query("SELECT p FROM Promotion p WHERE p.status = true " +
            "AND p.startDate <= :now AND p.endDate > :now " +
            "ORDER BY p.startDate DESC")
    List<Promotion> findActivePromotions(@Param("now") LocalDateTime now);

    // Lấy khuyến mãi đang hoạt động với phân trang
    @Query("SELECT p FROM Promotion p WHERE p.status = true " +
            "AND p.startDate <= :now AND p.endDate > :now " +
            "ORDER BY p.startDate DESC")
    Page<Promotion> findActivePromotions(@Param("now") LocalDateTime now, Pageable pageable);

    // Lấy khuyến mãi có thể áp dụng cho user
    @Query("SELECT p FROM Promotion p WHERE p.status = true " +
            "AND p.startDate <= :now AND p.endDate > :now " +
            "AND (p.maxUsageCount IS NULL OR p.usedCount < p.maxUsageCount) " +
            "AND (:forNewCustomersOnly = false OR p.forNewCustomersOnly = false OR :isNewCustomer = true) " +
            "ORDER BY p.discountValue DESC")
    List<Promotion> findApplicablePromotions(@Param("now") LocalDateTime now,
                                             @Param("forNewCustomersOnly") boolean forNewCustomersOnly,
                                             @Param("isNewCustomer") boolean isNewCustomer);

    // Lấy khuyến mãi áp dụng cho sản phẩm cụ thể
    @Query("SELECT p FROM Promotion p JOIN p.applicableProducts ap WHERE ap.id = :productId " +
            "AND p.status = true AND p.startDate <= :now AND p.endDate > :now " +
            "ORDER BY p.discountValue DESC")
    List<Promotion> findPromotionsForProduct(@Param("productId") Long productId, @Param("now") LocalDateTime now);

    // Lấy khuyến mãi áp dụng cho danh mục
    @Query("SELECT p FROM Promotion p JOIN p.applicableCategories ac WHERE ac.id = :categoryId " +
            "AND p.status = true AND p.startDate <= :now AND p.endDate > :now " +
            "ORDER BY p.discountValue DESC")
    List<Promotion> findPromotionsForCategory(@Param("categoryId") Long categoryId, @Param("now") LocalDateTime now);

    // Lấy khuyến mãi sắp hết hạn
    @Query("SELECT p FROM Promotion p WHERE p.status = true " +
            "AND p.endDate BETWEEN :now AND :warningDate " +
            "ORDER BY p.endDate ASC")
    List<Promotion> findPromotionsExpiringSoon(@Param("now") LocalDateTime now,
                                               @Param("warningDate") LocalDateTime warningDate);

    // Lấy khuyến mãi sắp bắt đầu
    @Query("SELECT p FROM Promotion p WHERE p.status = true " +
            "AND p.startDate BETWEEN :now AND :upcomingDate " +
            "ORDER BY p.startDate ASC")
    List<Promotion> findUpcomingPromotions(@Param("now") LocalDateTime now,
                                           @Param("upcomingDate") LocalDateTime upcomingDate);

    // Lấy khuyến mãi đã hết hạn
    @Query("SELECT p FROM Promotion p WHERE p.endDate < :now ORDER BY p.endDate DESC")
    Page<Promotion> findExpiredPromotions(@Param("now") LocalDateTime now, Pageable pageable);

    // Thống kê khuyến mãi theo loại giảm giá
    @Query("SELECT p.discountType, COUNT(p) FROM Promotion p GROUP BY p.discountType")
    List<Object[]> countPromotionsByDiscountType();

    // Lấy khuyến mãi được sử dụng nhiều nhất
    @Query("SELECT p FROM Promotion p WHERE p.usedCount > 0 ORDER BY p.usedCount DESC")
    List<Promotion> findMostUsedPromotions(Pageable pageable);

    // Tính tổng số tiền đã giảm giá
    @Query("SELECT SUM(pu.discountAmount) FROM PromotionUsage pu")
    Double getTotalDiscountAmount();

    // Lấy khuyến mãi theo khoảng thời gian
    @Query("SELECT p FROM Promotion p WHERE " +
            "(p.startDate BETWEEN :startDate AND :endDate) OR " +
            "(p.endDate BETWEEN :startDate AND :endDate) OR " +
            "(p.startDate <= :startDate AND p.endDate >= :endDate) " +
            "ORDER BY p.startDate DESC")
    List<Promotion> findPromotionsInPeriod(@Param("startDate") LocalDateTime startDate,
                                           @Param("endDate") LocalDateTime endDate);

    // Đếm số lượng khuyến mãi theo trạng thái
    Long countByStatus(Boolean status);

    // Lấy khuyến mãi chưa được sử dụng
    @Query("SELECT p FROM Promotion p WHERE p.usedCount = 0 ORDER BY p.startDate DESC")
    List<Promotion> findUnusedPromotions();

    // Kiểm tra user đã sử dụng promotion bao nhiều lần
    @Query("SELECT COUNT(pu) FROM PromotionUsage pu WHERE pu.promotion.id = :promotionId AND pu.user.id = :userId")
    Long countUsageByPromotionAndUser(@Param("promotionId") Long promotionId, @Param("userId") Long userId);
}