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
@Repository
public interface PromotionUsageRepository extends JpaRepository<PromotionUsage, Long> {

    // Lấy lịch sử sử dụng của user
    List<PromotionUsage> findByUserIdOrderByUsedAtDesc(Long userId);

    // Lấy lịch sử sử dụng của promotion
    List<PromotionUsage> findByPromotionIdOrderByUsedAtDesc(Long promotionId);

    // Đếm số lần user đã sử dụng promotion
    Long countByPromotionIdAndUserId(Long promotionId, Long userId);

    // Kiểm tra user đã sử dụng promotion chưa
    boolean existsByPromotionIdAndUserId(Long promotionId, Long userId);

    // Lấy usage trong khoảng thời gian
    @Query("SELECT pu FROM PromotionUsage pu WHERE pu.usedAt BETWEEN :startDate AND :endDate " +
            "ORDER BY pu.usedAt DESC")
    List<PromotionUsage> findUsageBetweenDates(@Param("startDate") LocalDateTime startDate,
                                               @Param("endDate") LocalDateTime endDate);

    // Thống kê usage theo tháng
    @Query("SELECT YEAR(pu.usedAt), MONTH(pu.usedAt), COUNT(pu), SUM(pu.discountAmount) " +
            "FROM PromotionUsage pu " +
            "GROUP BY YEAR(pu.usedAt), MONTH(pu.usedAt) " +
            "ORDER BY YEAR(pu.usedAt) DESC, MONTH(pu.usedAt) DESC")
    List<Object[]> getMonthlyUsageStatistics();

    // Lấy top users sử dụng khuyến mãi nhiều nhất
    @Query("SELECT pu.user.id, pu.user.fullName, COUNT(pu) as usageCount, SUM(pu.discountAmount) as totalSaved " +
            "FROM PromotionUsage pu " +
            "GROUP BY pu.user.id, pu.user.fullName " +
            "ORDER BY usageCount DESC")
    List<Object[]> findTopUsersByPromotionUsage(Pageable pageable);

    // Lấy usage theo order
    Optional<PromotionUsage> findByOrderId(Long orderId);

    // Lấy tổng số tiền đã tiết kiệm của user
    @Query("SELECT SUM(pu.discountAmount) FROM PromotionUsage pu WHERE pu.user.id = :userId")
    Double getTotalSavedByUser(@Param("userId") Long userId);

    // Xóa usage cũ (sau khi order bị hủy)
    void deleteByOrderId(Long orderId);

    // Thống kê promotion hiệu quả nhất
    @Query("SELECT p.id, p.promotionName, COUNT(pu) as usageCount, SUM(pu.discountAmount) as totalDiscount " +
            "FROM PromotionUsage pu JOIN pu.promotion p " +
            "GROUP BY p.id, p.promotionName " +
            "ORDER BY usageCount DESC")
    List<Object[]> findMostEffectivePromotions(Pageable pageable);

    // Lấy usage trong ngày
    @Query("SELECT pu FROM PromotionUsage pu WHERE DATE(pu.usedAt) = DATE(:date) " +
            "ORDER BY pu.usedAt DESC")
    List<PromotionUsage> findUsageByDate(@Param("date") LocalDateTime date);

    // Tính tỷ lệ sử dụng promotion
    @Query("SELECT " +
            "(SELECT COUNT(pu) FROM PromotionUsage pu WHERE pu.promotion.id = :promotionId) * 100.0 / " +
            "(SELECT COUNT(o) FROM Order o WHERE o.orderDate >= :startDate) " +
            "FROM Promotion p WHERE p.id = :promotionId")
    Double getPromotionUsageRate(@Param("promotionId") Long promotionId, @Param("startDate") LocalDateTime startDate);
}