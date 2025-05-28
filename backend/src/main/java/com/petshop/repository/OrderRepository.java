package com.petshop.repository;

import com.petshop.entity.Order;
import com.petshop.entity.OrderItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

// OrderRepository.java
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Tìm đơn hàng theo mã đơn hàng
    Optional<Order> findByOrderCode(String orderCode);

    // Kiểm tra mã đơn hàng có tồn tại không
    boolean existsByOrderCode(String orderCode);

    // Lấy đơn hàng của user
    Page<Order> findByUserIdOrderByOrderDateDesc(Long userId, Pageable pageable);

    // Lấy đơn hàng theo trạng thái
    Page<Order> findByStatusOrderByOrderDateDesc(Order.OrderStatus status, Pageable pageable);

    // Lấy đơn hàng theo trạng thái và user
    Page<Order> findByUserIdAndStatusOrderByOrderDateDesc(Long userId, Order.OrderStatus status, Pageable pageable);

    // Tìm kiếm đơn hàng
    @Query("SELECT o FROM Order o WHERE " +
            "(:search IS NULL OR :search = '' OR " +
            "LOWER(o.orderCode) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(o.receiverName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(o.receiverPhone) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "ORDER BY o.orderDate DESC")
    Page<Order> searchOrders(@Param("search") String search, Pageable pageable);

    // Lấy đơn hàng trong khoảng thời gian
    @Query("SELECT o FROM Order o WHERE o.orderDate BETWEEN :startDate AND :endDate " +
            "ORDER BY o.orderDate DESC")
    Page<Order> findOrdersBetweenDates(@Param("startDate") LocalDateTime startDate,
                                       @Param("endDate") LocalDateTime endDate,
                                       Pageable pageable);

    // Lấy đơn hàng theo phương thức thanh toán
    Page<Order> findByPaymentMethodOrderByOrderDateDesc(Order.PaymentMethod paymentMethod, Pageable pageable);

    // Lấy đơn hàng theo trạng thái thanh toán
    Page<Order> findByPaymentStatusOrderByOrderDateDesc(Order.PaymentStatus paymentStatus, Pageable pageable);

    // Thống kê đơn hàng theo trạng thái
    @Query("SELECT o.status, COUNT(o) FROM Order o GROUP BY o.status")
    List<Object[]> countOrdersByStatus();

    // Thống kê doanh thu theo tháng
    @Query("SELECT YEAR(o.orderDate), MONTH(o.orderDate), SUM(o.totalAmount) " +
            "FROM Order o WHERE o.status = 'COMPLETED' " +
            "GROUP BY YEAR(o.orderDate), MONTH(o.orderDate) " +
            "ORDER BY YEAR(o.orderDate) DESC, MONTH(o.orderDate) DESC")
    List<Object[]> getMonthlyRevenue();

    // Tính tổng doanh thu
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status = 'COMPLETED'")
    BigDecimal getTotalRevenue();

    // Tính doanh thu trong khoảng thời gian
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status = 'COMPLETED' " +
            "AND o.completedAt BETWEEN :startDate AND :endDate")
    BigDecimal getRevenueInPeriod(@Param("startDate") LocalDateTime startDate,
                                  @Param("endDate") LocalDateTime endDate);

    // Đếm đơn hàng theo trạng thái
    Long countByStatus(Order.OrderStatus status);

    // Lấy đơn hàng có giá trị cao nhất
    @Query("SELECT o FROM Order o WHERE o.totalAmount = (SELECT MAX(o2.totalAmount) FROM Order o2)")
    List<Order> findOrdersWithHighestValue();

    // Lấy top khách hàng theo số đơn hàng
    @Query("SELECT o.user.id, o.user.fullName, COUNT(o) as orderCount " +
            "FROM Order o WHERE o.status = 'COMPLETED' " +
            "GROUP BY o.user.id, o.user.fullName " +
            "ORDER BY orderCount DESC")
    List<Object[]> findTopCustomersByOrderCount(Pageable pageable);

    // Lấy top khách hàng theo doanh thu
    @Query("SELECT o.user.id, o.user.fullName, SUM(o.totalAmount) as totalSpent " +
            "FROM Order o WHERE o.status = 'COMPLETED' " +
            "GROUP BY o.user.id, o.user.fullName " +
            "ORDER BY totalSpent DESC")
    List<Object[]> findTopCustomersByRevenue(Pageable pageable);

    // Lấy đơn hàng cần xử lý (pending quá lâu)
    @Query("SELECT o FROM Order o WHERE o.status = 'PENDING' " +
            "AND o.orderDate < :cutoffDate ORDER BY o.orderDate ASC")
    List<Order> findPendingOrdersOlderThan(@Param("cutoffDate") LocalDateTime cutoffDate);

    // Lấy đơn hàng theo mã vận chuyển
    Optional<Order> findByTrackingNumber(String trackingNumber);

    // Đếm đơn hàng của user theo trạng thái
    Long countByUserIdAndStatus(Long userId, Order.OrderStatus status);

    // Lấy đơn hàng gần đây của user
    @Query("SELECT o FROM Order o WHERE o.user.id = :userId " +
            "ORDER BY o.orderDate DESC")
    List<Order> findRecentOrdersByUserId(@Param("userId") Long userId, Pageable pageable);

    // Kiểm tra user có đơn hàng hoàn thành nào không (để xác định khách hàng mới)
    @Query("SELECT COUNT(o) > 0 FROM Order o WHERE o.user.id = :userId AND o.status = 'COMPLETED'")
    boolean hasCompletedOrdersByUserId(@Param("userId") Long userId);
}
