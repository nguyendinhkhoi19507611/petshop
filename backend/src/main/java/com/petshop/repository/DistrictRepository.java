package com.petshop.repository;

import com.petshop.entity.District;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DistrictRepository extends JpaRepository<District, Long> {

    // Lấy quận/huyện theo tỉnh
    List<District> findByProvinceIdOrderByDistrictNameAsc(Long provinceId);

    // Tìm quận theo tên và tỉnh
    District findByDistrictNameAndProvinceId(String districtName, Long provinceId);

    // Kiểm tra quận có tồn tại không
    boolean existsByDistrictNameAndProvinceId(String districtName, Long provinceId);

    // Đếm số quận theo tỉnh
    @Query("SELECT COUNT(d) FROM District d WHERE d.province.id = :provinceId")
    Long countByProvinceId(@Param("provinceId") Long provinceId);
}