package com.petshop.repository;

import com.petshop.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {

    // Lấy địa chỉ theo user
    List<Address> findByUserIdOrderByIsDefaultDescCreatedAtDesc(Long userId);

    // Lấy địa chỉ mặc định của user
    Optional<Address> findByUserIdAndIsDefaultTrue(Long userId);

    // Kiểm tra user có địa chỉ mặc định không
    boolean existsByUserIdAndIsDefaultTrue(Long userId);

    // Đếm số địa chỉ của user
    Long countByUserId(Long userId);

    // Kiểm tra địa chỉ có thuộc về user không
    boolean existsByIdAndUserId(Long addressId, Long userId);

    // Xóa tất cả địa chỉ mặc định của user (để đặt địa chỉ mới làm mặc định)
    @Modifying
    @Query("UPDATE Address a SET a.isDefault = false WHERE a.user.id = :userId AND a.isDefault = true")
    void clearDefaultAddress(@Param("userId") Long userId);

    // Lấy địa chỉ theo tỉnh
    @Query("SELECT a FROM Address a WHERE a.province.id = :provinceId ORDER BY a.createdAt DESC")
    List<Address> findByProvinceId(@Param("provinceId") Long provinceId);

    // Lấy địa chỉ theo quận
    @Query("SELECT a FROM Address a WHERE a.district.id = :districtId ORDER BY a.createdAt DESC")
    List<Address> findByDistrictId(@Param("districtId") Long districtId);

    // Lấy địa chỉ theo phường
    @Query("SELECT a FROM Address a WHERE a.ward.id = :wardId ORDER BY a.createdAt DESC")
    List<Address> findByWardId(@Param("wardId") Long wardId);

    // Thống kê số địa chỉ theo tỉnh
    @Query("SELECT p.provinceName, COUNT(a) FROM Address a JOIN a.province p GROUP BY p.id, p.provinceName ORDER BY COUNT(a) DESC")
    List<Object[]> countAddressesByProvince();
}