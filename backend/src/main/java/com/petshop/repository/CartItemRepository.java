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
@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    // Tìm item trong giỏ hàng của user
    @Query("SELECT ci FROM CartItem ci WHERE ci.cart.user.id = :userId AND ci.product.id = :productId")
    Optional<CartItem> findByUserIdAndProductId(@Param("userId") Long userId, @Param("productId") Long productId);

    // Lấy tất cả items trong giỏ hàng của user
    @Query("SELECT ci FROM CartItem ci WHERE ci.cart.user.id = :userId ORDER BY ci.addedAt DESC")
    List<CartItem> findByUserId(@Param("userId") Long userId);

    // Lấy items theo cart ID
    List<CartItem> findByCartIdOrderByAddedAtDesc(Long cartId);

    // Xóa tất cả items trong giỏ hàng của user
    @Modifying
    @Query("DELETE FROM CartItem ci WHERE ci.cart.user.id = :userId")
    void deleteAllByUserId(@Param("userId") Long userId);

    // Xóa items theo cart ID
    @Modifying
    @Query("DELETE FROM CartItem ci WHERE ci.cart.id = :cartId")
    void deleteAllByCartId(@Param("cartId") Long cartId);

    // Đếm số lượng items trong giỏ hàng
    @Query("SELECT COUNT(ci) FROM CartItem ci WHERE ci.cart.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);

    // Tìm items có sản phẩm cụ thể
    List<CartItem> findByProductId(Long productId);

    // Xóa items có sản phẩm đã bị xóa hoặc hết hàng
    @Modifying
    @Query("DELETE FROM CartItem ci WHERE ci.product.status = false OR ci.product.stock <= 0")
    void deleteInvalidItems();

    // Cập nhật giá cho tất cả items trong giỏ hàng
    @Modifying
    @Query("UPDATE CartItem ci SET ci.priceAtTime = ci.product.price, " +
            "ci.salePriceAtTime = ci.product.salePrice WHERE ci.cart.id = :cartId")
    void updatePricesForCart(@Param("cartId") Long cartId);

    // Lấy sản phẩm được thêm vào giỏ hàng nhiều nhất
    @Query("SELECT ci.product.id, COUNT(ci) as count FROM CartItem ci " +
            "GROUP BY ci.product.id ORDER BY count DESC")
    List<Object[]> findMostAddedProducts();

    // Tính tổng số lượng sản phẩm trong tất cả giỏ hàng
    @Query("SELECT SUM(ci.quantity) FROM CartItem ci")
    Long getTotalQuantityInAllCarts();

    // Lấy items được thêm trong khoảng thời gian
    @Query("SELECT ci FROM CartItem ci WHERE ci.addedAt BETWEEN :startDate AND :endDate " +
            "ORDER BY ci.addedAt DESC")
    List<CartItem> findItemsAddedBetween(@Param("startDate") LocalDateTime startDate,
                                         @Param("endDate") LocalDateTime endDate);

    // Kiểm tra sản phẩm có trong giỏ hàng của user không
    @Query("SELECT COUNT(ci) > 0 FROM CartItem ci WHERE ci.cart.user.id = :userId AND ci.product.id = :productId")
    boolean existsByUserIdAndProductId(@Param("userId") Long userId, @Param("productId") Long productId);

    // Lấy tổng giá trị giỏ hàng của user
    @Query("SELECT SUM(ci.subtotal) FROM CartItem ci WHERE ci.cart.user.id = :userId")
    Double getTotalValueByUserId(@Param("userId") Long userId);
}
