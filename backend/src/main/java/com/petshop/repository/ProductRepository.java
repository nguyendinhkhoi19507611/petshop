package com.petshop.repository;

import com.petshop.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Tìm sản phẩm theo SKU
    Optional<Product> findBySku(String sku);

    // Kiểm tra SKU có tồn tại không
    boolean existsBySku(String sku);

    // Kiểm tra SKU có tồn tại không (loại trừ ID hiện tại)
    boolean existsBySkuAndIdNot(String sku, Long id);

    // Lấy sản phẩm theo trạng thái
    Page<Product> findByStatusOrderByCreatedDateDesc(Boolean status, Pageable pageable);

    // Lấy sản phẩm nổi bật
    Page<Product> findByFeaturedAndStatusOrderByCreatedDateDesc(Boolean featured, Boolean status, Pageable pageable);

    // Lấy sản phẩm theo thương hiệu
    Page<Product> findByBrandIdAndStatusOrderByCreatedDateDesc(Long brandId, Boolean status, Pageable pageable);

    // Lấy sản phẩm theo danh mục (thông qua product type)
    @Query("SELECT p FROM Product p WHERE p.productType.category.id = :categoryId AND p.status = :status ORDER BY p.createdDate DESC")
    Page<Product> findByCategoryIdAndStatus(@Param("categoryId") Long categoryId, @Param("status") Boolean status, Pageable pageable);

    // Lấy sản phẩm theo loại sản phẩm
    Page<Product> findByProductTypeIdAndStatusOrderByCreatedDateDesc(Long productTypeId, Boolean status, Pageable pageable);

    // Lấy sản phẩm theo kích cỡ
    Page<Product> findBySizeIdAndStatusOrderByCreatedDateDesc(Long sizeId, Boolean status, Pageable pageable);

    // Tìm kiếm sản phẩm theo tên
    @Query("SELECT p FROM Product p WHERE " +
            "(:search IS NULL OR :search = '' OR " +
            "LOWER(p.productName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(p.sku) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "AND (:status IS NULL OR p.status = :status) " +
            "ORDER BY p.createdDate DESC")
    Page<Product> searchProducts(@Param("search") String search, @Param("status") Boolean status, Pageable pageable);

    // Lọc sản phẩm theo nhiều tiêu chí
    @Query("SELECT p FROM Product p WHERE " +
            "(:search IS NULL OR :search = '' OR " +
            "LOWER(p.productName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "AND (:categoryId IS NULL OR p.productType.category.id = :categoryId) " +
            "AND (:brandId IS NULL OR p.brand.id = :brandId) " +
            "AND (:sizeId IS NULL OR p.size.id = :sizeId) " +
            "AND (:productTypeId IS NULL OR p.productType.id = :productTypeId) " +
            "AND (:minPrice IS NULL OR p.price >= :minPrice) " +
            "AND (:maxPrice IS NULL OR p.price <= :maxPrice) " +
            "AND (:status IS NULL OR p.status = :status) " +
            "AND (:featured IS NULL OR p.featured = :featured) " +
            "AND (:inStock IS NULL OR (:inStock = true AND p.stock > 0) OR (:inStock = false AND p.stock <= 0))")
    Page<Product> filterProducts(
            @Param("search") String search,
            @Param("categoryId") Long categoryId,
            @Param("brandId") Long brandId,
            @Param("sizeId") Long sizeId,
            @Param("productTypeId") Long productTypeId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("status") Boolean status,
            @Param("featured") Boolean featured,
            @Param("inStock") Boolean inStock,
            Pageable pageable);

    // Lấy sản phẩm có giá khuyến mãi
    @Query("SELECT p FROM Product p WHERE p.salePrice IS NOT NULL AND p.salePrice > 0 AND p.salePrice < p.price AND p.status = true ORDER BY p.createdDate DESC")
    Page<Product> findProductsOnSale(Pageable pageable);

    // Lấy sản phẩm sắp hết hàng
    @Query("SELECT p FROM Product p WHERE p.stock <= p.lowStockThreshold AND p.stock > 0 AND p.status = true ORDER BY p.stock ASC")
    Page<Product> findLowStockProducts(Pageable pageable);

    // Lấy sản phẩm hết hàng
    @Query("SELECT p FROM Product p WHERE p.stock <= 0 AND p.status = true ORDER BY p.createdDate DESC")
    Page<Product> findOutOfStockProducts(Pageable pageable);

    // Lấy sản phẩm bán chạy nhất
    @Query("SELECT p FROM Product p WHERE p.status = true ORDER BY p.soldQuantity DESC")
    Page<Product> findBestSellingProducts(Pageable pageable);

    // Lấy sản phẩm mới nhất
    @Query("SELECT p FROM Product p WHERE p.status = true ORDER BY p.createdDate DESC")
    Page<Product> findLatestProducts(Pageable pageable);

    // Lấy sản phẩm liên quan (cùng danh mục hoặc thương hiệu)
    @Query("SELECT p FROM Product p WHERE " +
            "(p.productType.category.id = (SELECT pr.productType.category.id FROM Product pr WHERE pr.id = :productId) " +
            "OR p.brand.id = (SELECT pr.brand.id FROM Product pr WHERE pr.id = :productId)) " +
            "AND p.id != :productId AND p.status = true " +
            "ORDER BY p.soldQuantity DESC")
    Page<Product> findRelatedProducts(@Param("productId") Long productId, Pageable pageable);

    // Lấy sản phẩm theo tags
    @Query("SELECT p FROM Product p WHERE p.tags IS NOT NULL AND " +
            "(:tag IS NULL OR LOWER(p.tags) LIKE LOWER(CONCAT('%', :tag, '%'))) " +
            "AND p.status = true ORDER BY p.createdDate DESC")
    Page<Product> findByTag(@Param("tag") String tag, Pageable pageable);

    // Thống kê số lượng sản phẩm theo trạng thái
    @Query("SELECT p.status, COUNT(p) FROM Product p GROUP BY p.status")
    List<Object[]> countProductsByStatus();

    // Thống kê số lượng sản phẩm theo thương hiệu
    @Query("SELECT b.brandName, COUNT(p) FROM Product p JOIN p.brand b GROUP BY b.id, b.brandName ORDER BY COUNT(p) DESC")
    List<Object[]> countProductsByBrand();

    // Thống kê số lượng sản phẩm theo danh mục
    @Query("SELECT c.categoryName, COUNT(p) FROM Product p JOIN p.productType pt JOIN pt.category c GROUP BY c.id, c.categoryName ORDER BY COUNT(p) DESC")
    List<Object[]> countProductsByCategory();

    // Tính tổng giá trị kho hàng
    @Query("SELECT SUM(p.price * p.stock) FROM Product p WHERE p.status = true")
    BigDecimal calculateTotalInventoryValue();

    // Lấy giá cao nhất và thấp nhất
    @Query("SELECT MIN(p.price), MAX(p.price) FROM Product p WHERE p.status = true")
    List<Object[]> getPriceRange();

    // Đếm tổng số sản phẩm đã bán
    @Query("SELECT SUM(p.soldQuantity) FROM Product p")
    Long getTotalSoldQuantity();

    // Lấy sản phẩm có doanh thu cao nhất
    @Query("SELECT p FROM Product p WHERE p.status = true ORDER BY (p.soldQuantity * p.price) DESC")
    Page<Product> findTopRevenueProducts(Pageable pageable);

    // Cập nhật số lượng đã bán
    @Query("UPDATE Product p SET p.soldQuantity = p.soldQuantity + :quantity WHERE p.id = :productId")
    void updateSoldQuantity(@Param("productId") Long productId, @Param("quantity") Integer quantity);

    // Cập nhật tồn kho
    @Query("UPDATE Product p SET p.stock = p.stock - :quantity WHERE p.id = :productId")
    void updateStock(@Param("productId") Long productId, @Param("quantity") Integer quantity);
}