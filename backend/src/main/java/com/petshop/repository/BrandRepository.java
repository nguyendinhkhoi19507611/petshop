package com.petshop.repository;

import com.petshop.entity.Brand;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {

    // Tìm thương hiệu theo tên
    Optional<Brand> findByBrandName(String brandName);

    // Kiểm tra tên thương hiệu có tồn tại không
    boolean existsByBrandName(String brandName);

    // Kiểm tra tên thương hiệu có tồn tại không (loại trừ ID hiện tại)
    boolean existsByBrandNameAndIdNot(String brandName, Long id);

    // Lấy thương hiệu theo trạng thái
    List<Brand> findByStatusOrderByBrandNameAsc(Boolean status);

    // Lấy tất cả thương hiệu có phân trang và sắp xếp
    Page<Brand> findAllByOrderByBrandNameAsc(Pageable pageable);

    // Tìm kiếm thương hiệu theo tên hoặc mô tả
    @Query("SELECT b FROM Brand b WHERE " +
            "(:search IS NULL OR :search = '' OR " +
            "LOWER(b.brandName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(b.description) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "ORDER BY b.brandName ASC")
    Page<Brand> searchBrands(@Param("search") String search, Pageable pageable);

    // Lấy thương hiệu theo trạng thái với phân trang
    Page<Brand> findByStatusOrderByBrandNameAsc(Boolean status, Pageable pageable);

    // Đếm số sản phẩm theo thương hiệu
    @Query("SELECT b.id, COUNT(p.id) FROM Brand b " +
            "LEFT JOIN Product p ON p.brand.id = b.id " +
            "GROUP BY b.id")
    List<Object[]> countProductsByBrand();

    // Lấy thương hiệu có sản phẩm
    @Query("SELECT DISTINCT b FROM Brand b " +
            "INNER JOIN Product p ON p.brand.id = b.id " +
            "WHERE b.status = true " +
            "ORDER BY b.brandName ASC")
    List<Brand> findBrandsWithProducts();

    // Top thương hiệu theo số lượng sản phẩm
    @Query("SELECT b FROM Brand b " +
            "LEFT JOIN Product p ON p.brand.id = b.id " +
            "WHERE b.status = true " +
            "GROUP BY b.id " +
            "ORDER BY COUNT(p.id) DESC")
    Page<Brand> findTopBrandsByProductCount(Pageable pageable);
}