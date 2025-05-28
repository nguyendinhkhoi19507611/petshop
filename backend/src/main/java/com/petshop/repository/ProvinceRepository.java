package com.petshop.repository;

import com.petshop.entity.Province;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProvinceRepository extends JpaRepository<Province, Long> {

    // Lấy tất cả tỉnh thành theo thứ tự alphabet
    List<Province> findAllByOrderByProvinceNameAsc();

    // Tìm tỉnh theo tên
    Province findByProvinceName(String provinceName);

    // Kiểm tra tỉnh có tồn tại không
    boolean existsByProvinceName(String provinceName);
}