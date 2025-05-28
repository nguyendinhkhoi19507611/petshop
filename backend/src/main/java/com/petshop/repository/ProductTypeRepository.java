package com.petshop.repository;

import com.petshop.entity.ProductType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductTypeRepository extends JpaRepository<ProductType, Long> {

    // Tìm loại sản phẩm theo tên
    Optional<ProductType> findByProductTypeName(String productTypeName);

    // Kiểm tra tên loại sản phẩm có tồn tại không
    boolean existsByProductTypeName(String productTypeName);

    // Kiểm tra tên loại sản phẩm có tồn tại không (loại trừ ID hiện tại)
    boolean existsByProductTypeNameAndIdNot(String productTypeName, Long id);

    // Lấy loại sản phẩm theo trạng thái
    List<ProductType> findByStatusOrderByProductTypeNameAsc(Boolean status);

    // Lấy loại sản phẩm theo danh mục
    List<ProductType> findByCategoryIdAndStatusOrderByProductTypeNameAsc(Long categoryId, Boolean status);

    // Lấy tất cả loại sản phẩm có phân trang
    Page<ProductType> findAllByOrderByProductTypeNameAsc(Pageable pageable);

    // Tìm kiếm loại sản phẩm theo tên hoặc mô tả
    @Query("SELECT pt FROM ProductType pt WHERE " +
            "(:search IS NULL OR :search = '' OR " +
            "LOWER(pt.productTypeName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(pt.description) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "ORDER BY pt.productTypeName ASC")
    Page<ProductType> searchProductTypes(@Param("search") String search, Pageable pageable);

    // Lấy loại sản phẩm theo trạng thái với phân trang
    Page<ProductType> findByStatusOrderByProductTypeNameAsc(Boolean status, Pageable pageable);

    // Lấy loại sản phẩm theo danh mục với phân trang
    Page<ProductType> findByCategoryIdOrderByProductTypeNameAsc(Long categoryId, Pageable pageable);

    // Đếm số sản phẩm theo loại sản phẩm
    @Query("SELECT pt.id, COUNT(p.id) FROM ProductType pt " +
            "LEFT JOIN Product p ON p.productType.id = pt.id " +
            "GROUP BY pt.id")
    List<Object[]> countProductsByProductType();

    // Lấy loại sản phẩm có sản phẩm
    @Query("SELECT DISTINCT pt FROM ProductType pt " +
            "INNER JOIN Product p ON p.productType.id = pt.id " +
            "WHERE pt.status = true " +
            "ORDER BY pt.productTypeName ASC")
    List<ProductType> findProductTypesWithProducts();

    // Lấy loại sản phẩm theo type code
    List<ProductType> findByTypeAndStatusOrderByProductTypeNameAsc(Integer type, Boolean status);

    // Lấy loại sản phẩm theo category và type
    List<ProductType> findByCategoryIdAndTypeAndStatusOrderByProductTypeNameAsc(
            Long categoryId, Integer type, Boolean status);

    // Kiểm tra xem có sản phẩm nào thuộc loại sản phẩm này không
    @Query("SELECT COUNT(p) > 0 FROM Product p WHERE p.productType.id = :productTypeId")
    boolean hasProducts(@Param("productTypeId") Long productTypeId);
}