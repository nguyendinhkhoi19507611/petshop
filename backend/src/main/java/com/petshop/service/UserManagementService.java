package com.petshop.service;

import com.petshop.dto.*;
import com.petshop.entity.*;
import com.petshop.exception.ResourceNotFoundException;
import com.petshop.exception.DuplicateResourceException;
import com.petshop.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserManagementService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private ProvinceRepository provinceRepository;

    @Autowired
    private DistrictRepository districtRepository;

    @Autowired
    private WardRepository wardRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // User Management

    // Lấy tất cả người dùng (Admin only)
    public ApiResponse<List<UserDTO>> getAllUsers(int page, int size, String search, String role, Boolean status) {
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdDate"));
            Page<User> userPage;

            if (search != null && !search.trim().isEmpty()) {
                userPage = userRepository.findByUsernameContainingIgnoreCaseOrFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                        search.trim(), search.trim(), search.trim(), pageable);
            } else if (role != null && !role.trim().isEmpty()) {
                userPage = userRepository.findByRoleRoleName(role, pageable);
            } else if (status != null) {
                userPage = userRepository.findByStatus(status, pageable);
            } else {
                userPage = userRepository.findAll(pageable);
            }

            List<UserDTO> userDTOs = userPage.getContent().stream()
                    .map(this::convertUserToDTO)
                    .collect(Collectors.toList());

            Map<String, Object> metadata = new HashMap<>();
            metadata.put("totalElements", userPage.getTotalElements());
            metadata.put("totalPages", userPage.getTotalPages());
            metadata.put("currentPage", page);
            metadata.put("pageSize", size);
            metadata.put("hasNext", userPage.hasNext());
            metadata.put("hasPrevious", userPage.hasPrevious());

            ApiResponse<List<UserDTO>> response = ApiResponse.success("Lấy danh sách người dùng thành công", userDTOs);
            response.setMetadata(metadata);

            return response;
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lấy danh sách người dùng: " + e.getMessage());
        }
    }

    // Lấy người dùng theo ID
    public ApiResponse<UserDTO> getUserById(Long id) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + id));

            UserDTO userDTO = convertUserToDTO(user);
            return ApiResponse.success("Lấy thông tin người dùng thành công", userDTO);
        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lấy thông tin người dùng: " + e.getMessage());
        }
    }

    // Cập nhật thông tin người dùng
    public ApiResponse<UserDTO> updateUser(Long id, UserUpdateRequest request) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + id));

            // Kiểm tra email có bị trùng không
            if (request.getEmail() != null && userRepository.existsByEmailAndIdNot(request.getEmail(), id)) {
                throw new DuplicateResourceException("Email đã được sử dụng: " + request.getEmail());
            }

            // Cập nhật thông tin
            if (request.getFullName() != null) {
                user.setFullName(request.getFullName());
            }
            if (request.getEmail() != null) {
                user.setEmail(request.getEmail());
            }
            if (request.getBirthDate() != null) {
                user.setBirthDate(request.getBirthDate());
            }
            if (request.getGender() != null) {
                user.setGender(request.getGender());
            }
            if (request.getCitizenId() != null) {
                user.setCitizenId(request.getCitizenId());
            }
            if (request.getPhoneNumber() != null) {
                user.setPhoneNumber(request.getPhoneNumber());
            }
            if (request.getStatus() != null) {
                user.setStatus(request.getStatus());
            }

            // Cập nhật role (chỉ admin)
            if (request.getRoleId() != null) {
                Role role = roleRepository.findById(request.getRoleId())
                        .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vai trò với ID: " + request.getRoleId()));
                user.setRole(role);
            }

            User updatedUser = userRepository.save(user);
            UserDTO userDTO = convertUserToDTO(updatedUser);

            return ApiResponse.success("Cập nhật thông tin người dùng thành công", userDTO);
        } catch (ResourceNotFoundException | DuplicateResourceException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi cập nhật thông tin người dùng: " + e.getMessage());
        }
    }

    // Xóa người dùng (Admin only)
    public ApiResponse<Void> deleteUser(Long id) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + id));

            // TODO: Kiểm tra xem user có đơn hàng không trước khi xóa

            userRepository.delete(user);
            return ApiResponse.success("Xóa người dùng thành công");
        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi xóa người dùng: " + e.getMessage());
        }
    }

    // Khóa/mở khóa người dùng
    public ApiResponse<UserDTO> toggleUserStatus(Long id) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + id));

            user.setStatus(!user.getStatus());
            User updatedUser = userRepository.save(user);
            UserDTO userDTO = convertUserToDTO(updatedUser);

            String message = user.getStatus() ? "Mở khóa tài khoản thành công" : "Khóa tài khoản thành công";
            return ApiResponse.success(message, userDTO);
        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi thay đổi trạng thái tài khoản: " + e.getMessage());
        }
    }

    // Đổi mật khẩu
    public ApiResponse<Void> changePassword(Long userId, PasswordChangeRequest request) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + userId));

            // Kiểm tra mật khẩu hiện tại
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                return ApiResponse.error("Mật khẩu hiện tại không chính xác");
            }

            // Kiểm tra mật khẩu mới và xác nhận
            if (!request.getNewPassword().equals(request.getConfirmPassword())) {
                return ApiResponse.error("Mật khẩu mới và xác nhận mật khẩu không khớp");
            }

            // Cập nhật mật khẩu
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);

            return ApiResponse.success("Đổi mật khẩu thành công");
        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi đổi mật khẩu: " + e.getMessage());
        }
    }

    // Reset mật khẩu (Admin only)
    public ApiResponse<Void> resetPassword(Long userId, String newPassword) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + userId));

            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);

            return ApiResponse.success("Reset mật khẩu thành công");
        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi reset mật khẩu: " + e.getMessage());
        }
    }

    // Address Management

    // Lấy địa chỉ của người dùng
    public ApiResponse<List<AddressDTO>> getUserAddresses(Long userId) {
        try {
            List<Address> addresses = addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId);
            List<AddressDTO> addressDTOs = addresses.stream()
                    .map(this::convertAddressToDTO)
                    .collect(Collectors.toList());

            return ApiResponse.success("Lấy danh sách địa chỉ thành công", addressDTOs);
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lấy danh sách địa chỉ: " + e.getMessage());
        }
    }

    // Thêm địa chỉ mới
    public ApiResponse<AddressDTO> createAddress(Long userId, AddressRequest request) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + userId));

            Province province = provinceRepository.findById(request.getProvinceId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tỉnh/thành với ID: " + request.getProvinceId()));

            District district = districtRepository.findById(request.getDistrictId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy quận/huyện với ID: " + request.getDistrictId()));

            Ward ward = wardRepository.findById(request.getWardId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phường/xã với ID: " + request.getWardId()));

            // Nếu đây là địa chỉ mặc định đầu tiên hoặc được yêu cầu làm mặc định
            boolean isDefault = request.getIsDefault() || !addressRepository.existsByUserIdAndIsDefaultTrue(userId);

            if (isDefault) {
                // Xóa địa chỉ mặc định cũ
                addressRepository.clearDefaultAddress(userId);
            }

            Address address = new Address();
            address.setUser(user);
            address.setProvince(province);
            address.setDistrict(district);
            address.setWard(ward);
            address.setNote(request.getNote());
            address.setStreetAddress(request.getStreetAddress());
            address.setReceiverName(request.getReceiverName());
            address.setReceiverPhone(request.getReceiverPhone());
            address.setIsDefault(isDefault);

            Address savedAddress = addressRepository.save(address);
            AddressDTO addressDTO = convertAddressToDTO(savedAddress);

            return ApiResponse.success("Thêm địa chỉ thành công", addressDTO);
        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi thêm địa chỉ: " + e.getMessage());
        }
    }

    // Cập nhật địa chỉ
    public ApiResponse<AddressDTO> updateAddress(Long addressId, AddressRequest request, Long userId) {
        try {
            Address address = addressRepository.findById(addressId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy địa chỉ với ID: " + addressId));

            // Kiểm tra địa chỉ có thuộc về user không
            if (!address.getUser().getId().equals(userId)) {
                return ApiResponse.error("Bạn không có quyền chỉnh sửa địa chỉ này");
            }

            Province province = provinceRepository.findById(request.getProvinceId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tỉnh/thành với ID: " + request.getProvinceId()));

            District district = districtRepository.findById(request.getDistrictId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy quận/huyện với ID: " + request.getDistrictId()));

            Ward ward = wardRepository.findById(request.getWardId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phường/xã với ID: " + request.getWardId()));

            // Nếu được yêu cầu làm mặc định
            if (request.getIsDefault() && !address.getIsDefault()) {
                addressRepository.clearDefaultAddress(userId);
            }

            address.setProvince(province);
            address.setDistrict(district);
            address.setWard(ward);
            address.setNote(request.getNote());
            address.setStreetAddress(request.getStreetAddress());
            address.setReceiverName(request.getReceiverName());
            address.setReceiverPhone(request.getReceiverPhone());
            if (request.getIsDefault() != null) {
                address.setIsDefault(request.getIsDefault());
            }

            Address updatedAddress = addressRepository.save(address);
            AddressDTO addressDTO = convertAddressToDTO(updatedAddress);

            return ApiResponse.success("Cập nhật địa chỉ thành công", addressDTO);
        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi cập nhật địa chỉ: " + e.getMessage());
        }
    }

    // Xóa địa chỉ
    public ApiResponse<Void> deleteAddress(Long addressId, Long userId) {
        try {
            Address address = addressRepository.findById(addressId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy địa chỉ với ID: " + addressId));

            // Kiểm tra địa chỉ có thuộc về user không
            if (!address.getUser().getId().equals(userId)) {
                return ApiResponse.error("Bạn không có quyền xóa địa chỉ này");
            }

            addressRepository.delete(address);
            return ApiResponse.success("Xóa địa chỉ thành công");
        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi xóa địa chỉ: " + e.getMessage());
        }
    }

    // Đặt địa chỉ mặc định
    public ApiResponse<AddressDTO> setDefaultAddress(Long addressId, Long userId) {
        try {
            Address address = addressRepository.findById(addressId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy địa chỉ với ID: " + addressId));

            // Kiểm tra địa chỉ có thuộc về user không
            if (!address.getUser().getId().equals(userId)) {
                return ApiResponse.error("Bạn không có quyền thay đổi địa chỉ này");
            }

            // Xóa địa chỉ mặc định cũ
            addressRepository.clearDefaultAddress(userId);

            // Đặt địa chỉ mới làm mặc định
            address.setIsDefault(true);
            Address updatedAddress = addressRepository.save(address);
            AddressDTO addressDTO = convertAddressToDTO(updatedAddress);

            return ApiResponse.success("Đặt địa chỉ mặc định thành công", addressDTO);
        } catch (ResourceNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi đặt địa chỉ mặc định: " + e.getMessage());
        }
    }

    // Location Services

    // Lấy tất cả tỉnh/thành
    public ApiResponse<List<ProvinceDTO>> getAllProvinces() {
        try {
            List<Province> provinces = provinceRepository.findAllByOrderByProvinceNameAsc();
            List<ProvinceDTO> provinceDTOs = provinces.stream()
                    .map(this::convertProvinceToDTO)
                    .collect(Collectors.toList());

            return ApiResponse.success("Lấy danh sách tỉnh/thành thành công", provinceDTOs);
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lấy danh sách tỉnh/thành: " + e.getMessage());
        }
    }

    // Lấy quận/huyện theo tỉnh
    public ApiResponse<List<DistrictDTO>> getDistrictsByProvince(Long provinceId) {
        try {
            List<District> districts = districtRepository.findByProvinceIdOrderByDistrictNameAsc(provinceId);
            List<DistrictDTO> districtDTOs = districts.stream()
                    .map(this::convertDistrictToDTO)
                    .collect(Collectors.toList());

            return ApiResponse.success("Lấy danh sách quận/huyện thành công", districtDTOs);
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lấy danh sách quận/huyện: " + e.getMessage());
        }
    }

    // Lấy phường/xã theo quận
    public ApiResponse<List<WardDTO>> getWardsByDistrict(Long districtId) {
        try {
            List<Ward> wards = wardRepository.findByDistrictIdOrderByWardNameAsc(districtId);
            List<WardDTO> wardDTOs = wards.stream()
                    .map(this::convertWardToDTO)
                    .collect(Collectors.toList());

            return ApiResponse.success("Lấy danh sách phường/xã thành công", wardDTOs);
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lấy danh sách phường/xã: " + e.getMessage());
        }
    }

    // Converter methods

    private UserDTO convertUserToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setUsername(user.getUsername());
        dto.setCreatedDate(user.getCreatedDate());
        dto.setBirthDate(user.getBirthDate());
        dto.setGender(user.getGender());
        dto.setCitizenId(user.getCitizenId());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setStatus(user.getStatus());

        if (user.getRole() != null) {
            dto.setRoleId(user.getRole().getId());
            dto.setRoleName(user.getRole().getRoleName());
        }

        return dto;
    }

    private AddressDTO convertAddressToDTO(Address address) {
        AddressDTO dto = new AddressDTO();
        dto.setId(address.getId());
        dto.setNote(address.getNote());
        dto.setStreetAddress(address.getStreetAddress());
        dto.setReceiverName(address.getReceiverName());
        dto.setReceiverPhone(address.getReceiverPhone());
        dto.setIsDefault(address.getIsDefault());
        dto.setFullAddress(address.getFullAddress());

        if (address.getProvince() != null) {
            dto.setProvinceId(address.getProvince().getId());
            dto.setProvinceName(address.getProvince().getProvinceName());
        }

        if (address.getDistrict() != null) {
            dto.setDistrictId(address.getDistrict().getId());
            dto.setDistrictName(address.getDistrict().getDistrictName());
        }

        if (address.getWard() != null) {
            dto.setWardId(address.getWard().getId());
            dto.setWardName(address.getWard().getWardName());
        }

        return dto;
    }

    private ProvinceDTO convertProvinceToDTO(Province province) {
        return new ProvinceDTO(province.getId(), province.getProvinceName());
    }

    private DistrictDTO convertDistrictToDTO(District district) {
        return new DistrictDTO(
                district.getId(),
                district.getDistrictName(),
                district.getProvince().getId()
        );
    }

    private WardDTO convertWardToDTO(Ward ward) {
        return new WardDTO(
                ward.getId(),
                ward.getWardName(),
                ward.getDistrict().getId()
        );
    }
}