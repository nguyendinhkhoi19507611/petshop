package com.petshop.repository;

import com.petshop.entity.Size;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SizeRepository extends JpaRepository<Size, Long> {

    // Tìm kích cỡ theo tên
    Optional<Size> findBySizeName(String sizeName);

    // Kiểm tra tên kích cỡ có tồn tại không
    boolean existsBySizeName(String sizeName);

    // Kiểm tra tên kích cỡ có tồn tại không (loại trừ ID hiện tại)
    boolean existsBySizeNameAndIdNot(String sizeName, Long id);

    // Lấy kích cỡ theo trạng thái và sắp xếp theo thứ tự hiển thị
    List<Size> findByStatusOrderByDisplayOrderAscSizeNameAsc(Boolean status);

    // Lấy tất cả kích cỡ có phân trang và sắp xếp
    Page<Size> findAllByOrderByDisplayOrderAscSizeNameAsc(Pageable pageable);

    // Tìm kiếm kích cỡ theo tên hoặc mô tả
    @Query("SELECT s FROM Size s WHERE " +
            "(:search IS NULL OR :search = '' OR " +
            "LOWER(s.sizeName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(s.description) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(s.value) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(s.unit) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "ORDER BY s.displayOrder ASC, s.sizeName ASC")
    Page<Size> searchSizes(@Param("search") String search, Pageable pageable);

    // Lấy kích cỡ theo trạng thái với phân trang
    Page<Size> findByStatusOrderByDisplayOrderAscSizeNameAsc(Boolean status, Pageable pageable);

    // Lấy kích cỡ theo đơn vị
    List<Size> findByUnitOrderByDisplayOrderAscSizeNameAsc(String unit);

    // Đếm số sản phẩm theo kích cỡ
    @Query("SELECT s.id, COUNT(p.id) FROM Size s " +
            "LEFT JOIN Product p ON p.size.id = s.id " +
            "GROUP BY s.id")
    List<Object[]> countProductsBySize();

    // Lấy kích cỡ có sản phẩm
    @Query("SELECT DISTINCT s FROM Size s " +
            "INNER JOIN Product p ON p.size.id = s.id " +
            "WHERE s.status = true " +
            "ORDER BY s.displayOrder ASC, s.sizeName ASC")
    List<Size> findSizesWithProducts();

    // Lấy thứ tự hiển thị lớn nhất
    @Query("SELECT MAX(s.displayOrder) FROM Size s")
    Integer findMaxDisplayOrder();

    // Lấy kích cỡ theo khoảng thứ tự hiển thị
    List<Size> findByDisplayOrderBetweenOrderByDisplayOrderAsc(Integer start, Integer end);

    List<Size> findAllByOrderByDisplayOrderAscSizeNameAsc();
}