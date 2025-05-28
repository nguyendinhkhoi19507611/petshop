package com.petshop.repository;

import com.petshop.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    // Tìm danh mục theo tên
    Optional<Category> findByCategoryName(String categoryName);

    // Kiểm tra tên danh mục có tồn tại không
    boolean existsByCategoryName(String categoryName);

    // Kiểm tra tên danh mục có tồn tại không (loại trừ ID hiện tại)
    boolean existsByCategoryNameAndIdNot(String categoryName, Long id);

    // Lấy danh mục theo trạng thái
    List<Category> findByStatusOrderByCategoryNameAsc(Boolean status);

    // Lấy tất cả danh mục có phân trang
    Page<Category> findAllByOrderByCategoryNameAsc(Pageable pageable);

    // Tìm kiếm danh mục theo tên
    @Query("SELECT c FROM Category c WHERE " +
            "(:search IS NULL OR :search = '' OR " +
            "LOWER(c.categoryName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(c.description) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "ORDER BY c.categoryName ASC")
    Page<Category> searchCategories(@Param("search") String search, Pageable pageable);

    // Đếm số sản phẩm trong mỗi danh mục
    @Query("SELECT c.id, COUNT(pt.id) FROM Category c " +
            "LEFT JOIN ProductType pt ON pt.category.id = c.id " +
            "GROUP BY c.id")
    List<Object[]> countProductsByCategory();

    // Lấy danh mục có sản phẩm
    @Query("SELECT DISTINCT c FROM Category c " +
            "INNER JOIN ProductType pt ON pt.category.id = c.id " +
            "WHERE c.status = true " +
            "ORDER BY c.categoryName ASC")
    List<Category> findCategoriesWithProducts();
}