package com.petshop.repository;

import com.petshop.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);

    // Kiểm tra email có tồn tại không (loại trừ ID hiện tại)
    Boolean existsByEmailAndIdNot(String email, Long id);

    // Kiểm tra username có tồn tại không (loại trừ ID hiện tại)
    Boolean existsByUsernameAndIdNot(String username, Long id);

    // Lấy user theo trạng thái
    Page<User> findByStatus(Boolean status, Pageable pageable);

    // Lấy user theo role
    Page<User> findByRoleRoleName(String roleName, Pageable pageable);

    // Tìm kiếm user theo username, fullName hoặc email
    Page<User> findByUsernameContainingIgnoreCaseOrFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String username, String fullName, String email, Pageable pageable);

    // Tìm kiếm user theo nhiều tiêu chí
    @Query("SELECT u FROM User u WHERE " +
            "(:search IS NULL OR :search = '' OR " +
            "LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "AND (:roleName IS NULL OR u.role.roleName = :roleName) " +
            "AND (:status IS NULL OR u.status = :status) " +
            "ORDER BY u.createdDate DESC")
    Page<User> searchUsers(@Param("search") String search,
                           @Param("roleName") String roleName,
                           @Param("status") Boolean status,
                           Pageable pageable);

    // Lấy user theo CCCD
    Optional<User> findByCitizenId(String citizenId);

    // Lấy user theo số điện thoại
    Optional<User> findByPhoneNumber(String phoneNumber);

    // Đếm số user theo role
    @Query("SELECT r.roleName, COUNT(u) FROM User u JOIN u.role r GROUP BY r.roleName")
    List<Object[]> countUsersByRole();

    // Đếm số user theo trạng thái
    @Query("SELECT u.status, COUNT(u) FROM User u GROUP BY u.status")
    List<Object[]> countUsersByStatus();

    // Lấy user được tạo trong khoảng thời gian
    @Query("SELECT u FROM User u WHERE u.createdDate BETWEEN :startDate AND :endDate ORDER BY u.createdDate DESC")
    List<User> findUsersCreatedBetween(@Param("startDate") java.time.LocalDate startDate,
                                       @Param("endDate") java.time.LocalDate endDate);

    // Lấy user sinh nhật hôm nay
    @Query("SELECT u FROM User u WHERE MONTH(u.birthDate) = MONTH(CURRENT_DATE) AND DAY(u.birthDate) = DAY(CURRENT_DATE)")
    List<User> findUsersWithBirthdayToday();

    // Lấy user sinh nhật trong tháng
    @Query("SELECT u FROM User u WHERE MONTH(u.birthDate) = :month")
    List<User> findUsersWithBirthdayInMonth(@Param("month") int month);

    // Thống kê user theo giới tính
    @Query("SELECT u.gender, COUNT(u) FROM User u WHERE u.gender IS NOT NULL GROUP BY u.gender")
    List<Object[]> countUsersByGender();

    // Lấy user hoạt động
    List<User> findByStatusTrueOrderByCreatedDateDesc();

    // Lấy user bị khóa
    List<User> findByStatusFalseOrderByCreatedDateDesc();

    // Lấy admin và nhân viên
    @Query("SELECT u FROM User u WHERE u.role.roleName IN ('Admin', 'Nhân viên') ORDER BY u.createdDate DESC")
    List<User> findAdminAndEmployeeUsers();

    // Lấy khách hàng
    @Query("SELECT u FROM User u WHERE u.role.roleName = 'Khách hàng' ORDER BY u.createdDate DESC")
    List<User> findCustomerUsers();

    // Tìm user có nhiều địa chỉ nhất
    @Query("SELECT u FROM User u JOIN Address a ON a.user.id = u.id GROUP BY u.id ORDER BY COUNT(a) DESC")
    List<User> findUsersWithMostAddresses(Pageable pageable);
}