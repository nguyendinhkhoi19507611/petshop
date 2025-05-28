package com.petshop.repository;

import com.petshop.entity.Ward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WardRepository extends JpaRepository<Ward, Long> {

    // Lấy phường/xã theo quận
    List<Ward> findByDistrictIdOrderByWardNameAsc(Long districtId);

    // Tìm phường theo tên và quận
    Ward findByWardNameAndDistrictId(String wardName, Long districtId);

    // Kiểm tra phường có tồn tại không
    boolean existsByWardNameAndDistrictId(String wardName, Long districtId);

    // Đếm số phường theo quận
    @Query("SELECT COUNT(w) FROM Ward w WHERE w.district.id = :districtId")
    Long countByDistrictId(@Param("districtId") Long districtId);

    // Lấy phường theo tỉnh (thông qua quận)
    @Query("SELECT w FROM Ward w WHERE w.district.province.id = :provinceId ORDER BY w.wardName ASC")
    List<Ward> findByProvinceId(@Param("provinceId") Long provinceId);
}