package com.petshop.repository;

import com.petshop.entity.Cart;
import com.petshop.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

// CartRepository.java
@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    // Tìm giỏ hàng theo user
    Optional<Cart> findByUserId(Long userId);

    // Kiểm tra user có giỏ hàng không
    boolean existsByUserId(Long userId);

    // Xóa giỏ hàng cũ (không hoạt động trong X ngày)
    @Modifying
    @Query("DELETE FROM Cart c WHERE c.lastUpdated < :cutoffDate")
    void deleteInactiveCarts(@Param("cutoffDate") LocalDateTime cutoffDate);

    // Thống kê số lượng giỏ hàng theo trạng thái
    @Query("SELECT COUNT(c) FROM Cart c WHERE c.totalQuantity > 0")
    Long countActiveCartsWithItems();

    @Query("SELECT COUNT(c) FROM Cart c WHERE c.totalQuantity = 0 OR c.totalQuantity IS NULL")
    Long countEmptyCarts();

    // Lấy giỏ hàng có tổng giá trị cao nhất
    @Query("SELECT c FROM Cart c WHERE c.totalPrice = (SELECT MAX(c2.totalPrice) FROM Cart c2)")
    List<Cart> findCartsWithHighestValue();

    // Tính tổng giá trị tất cả giỏ hàng
    @Query("SELECT SUM(c.totalPrice) FROM Cart c WHERE c.totalPrice > 0")
    Double getTotalCartValue();
}