package com.petshop.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.petshop.entity.Cart;
import com.petshop.entity.CartItem;
import com.petshop.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    // Lấy items theo order ID
    List<OrderItem> findByOrderIdOrderById(Long orderId);

    // Lấy items theo product ID
    List<OrderItem> findByProductId(Long productId);

    // Thống kê sản phẩm bán chạy
    @Query("SELECT oi.product.id, oi.product.productName, SUM(oi.quantity) as totalSold " +
            "FROM OrderItem oi JOIN oi.order o WHERE o.status = 'COMPLETED' " +
            "GROUP BY oi.product.id, oi.product.productName " +
            "ORDER BY totalSold DESC")
    List<Object[]> findBestSellingProducts(Pageable pageable);

    // Tính tổng số lượng đã bán của sản phẩm
    @Query("SELECT SUM(oi.quantity) FROM OrderItem oi JOIN oi.order o " +
            "WHERE oi.product.id = :productId AND o.status = 'COMPLETED'")
    Long getTotalSoldQuantityByProductId(@Param("productId") Long productId);

    // Tính doanh thu theo sản phẩm
    @Query("SELECT oi.product.id, oi.product.productName, SUM(oi.subtotal) as revenue " +
            "FROM OrderItem oi JOIN oi.order o WHERE o.status = 'COMPLETED' " +
            "GROUP BY oi.product.id, oi.product.productName " +
            "ORDER BY revenue DESC")
    List<Object[]> getRevenueByProduct(Pageable pageable);

    // Lấy items theo khoảng thời gian
    @Query("SELECT oi FROM OrderItem oi JOIN oi.order o " +
            "WHERE o.orderDate BETWEEN :startDate AND :endDate " +
            "AND o.status = 'COMPLETED' ORDER BY o.orderDate DESC")
    List<OrderItem> findItemsSoldBetween(@Param("startDate") LocalDateTime startDate,
                                         @Param("endDate") LocalDateTime endDate);

    // Tính tổng doanh thu từ order items
    @Query("SELECT SUM(oi.subtotal) FROM OrderItem oi JOIN oi.order o WHERE o.status = 'COMPLETED'")
    BigDecimal getTotalRevenueFromItems();

    // Lấy sản phẩm được mua cùng nhau nhiều nhất
    @Query("SELECT oi1.product.id, oi2.product.id, COUNT(*) as frequency " +
            "FROM OrderItem oi1 JOIN OrderItem oi2 ON oi1.order.id = oi2.order.id " +
            "WHERE oi1.product.id < oi2.product.id " +
            "GROUP BY oi1.product.id, oi2.product.id " +
            "ORDER BY frequency DESC")
    List<Object[]> findFrequentlyBoughtTogether(Pageable pageable);

    // Thống kê theo danh mục sản phẩm
    @Query("SELECT pt.category.categoryName, SUM(oi.quantity) as totalSold, SUM(oi.subtotal) as revenue " +
            "FROM OrderItem oi JOIN oi.product p JOIN p.productType pt JOIN oi.order o " +
            "WHERE o.status = 'COMPLETED' " +
            "GROUP BY pt.category.id, pt.category.categoryName " +
            "ORDER BY revenue DESC")
    List<Object[]> getSalesByCategory();

    // Thống kê theo thương hiệu
    @Query("SELECT b.brandName, SUM(oi.quantity) as totalSold, SUM(oi.subtotal) as revenue " +
            "FROM OrderItem oi JOIN oi.product p JOIN p.brand b JOIN oi.order o " +
            "WHERE o.status = 'COMPLETED' " +
            "GROUP BY b.id, b.brandName " +
            "ORDER BY revenue DESC")
    List<Object[]> getSalesByBrand();

    // Lấy sản phẩm chưa được bán
    @Query("SELECT p FROM Product p WHERE p.id NOT IN " +
            "(SELECT DISTINCT oi.product.id FROM OrderItem oi JOIN oi.order o WHERE o.status = 'COMPLETED')")
    List<Object> findUnsoldProducts();

    // Tính trung bình số lượng sản phẩm trong mỗi đơn hàng
    @Query("SELECT AVG(subquery.itemCount) FROM " +
            "(SELECT COUNT(oi) as itemCount FROM OrderItem oi JOIN oi.order o " +
            "WHERE o.status = 'COMPLETED' GROUP BY o.id) subquery")
    Double getAverageItemsPerOrder();

    // Lấy các sản phẩm có doanh thu cao trong khoảng thời gian
    @Query("SELECT oi.product.id, oi.product.productName, SUM(oi.subtotal) as revenue " +
            "FROM OrderItem oi JOIN oi.order o " +
            "WHERE o.status = 'COMPLETED' AND o.completedAt BETWEEN :startDate AND :endDate " +
            "GROUP BY oi.product.id, oi.product.productName " +
            "ORDER BY revenue DESC")
    List<Object[]> getTopSellingProductsInPeriod(@Param("startDate") LocalDateTime startDate,
                                                 @Param("endDate") LocalDateTime endDate,
                                                 Pageable pageable);
}