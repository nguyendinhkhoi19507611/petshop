package com.petshop.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class AddressRequest {
    @Size(max = 500, message = "Ghi chú không được vượt quá 500 ký tự")
    private String note;

    @Size(max = 100, message = "Địa chỉ đường không được vượt quá 100 ký tự")
    private String streetAddress;

    @Size(max = 50, message = "Tên người nhận không được vượt quá 50 ký tự")
    private String receiverName;

    @Size(max = 15, message = "Số điện thoại người nhận không được vượt quá 15 ký tự")
    private String receiverPhone;

    @NotNull(message = "Tỉnh/thành phố không được để trống")
    private Long provinceId;

    @NotNull(message = "Quận/huyện không được để trống")
    private Long districtId;

    @NotNull(message = "Phường/xã không được để trống")
    private Long wardId;

    // Add the missing fields that have getters/setters
    private String provinceName;
    private String districtName;
    private String wardName;
    private String fullAddress;

    private Boolean isDefault = false;

    // Constructors
    public AddressRequest() {}

    // Getters and Setters
    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getStreetAddress() {
        return streetAddress;
    }

    public void setStreetAddress(String streetAddress) {
        this.streetAddress = streetAddress;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public void setReceiverName(String receiverName) {
        this.receiverName = receiverName;
    }

    public String getReceiverPhone() {
        return receiverPhone;
    }

    public void setReceiverPhone(String receiverPhone) {
        this.receiverPhone = receiverPhone;
    }

    public Long getProvinceId() {
        return provinceId;
    }

    public void setProvinceId(Long provinceId) {
        this.provinceId = provinceId;
    }

    public String getProvinceName() {
        return provinceName;
    }

    public void setProvinceName(String provinceName) {
        this.provinceName = provinceName;
    }

    public Long getDistrictId() {
        return districtId;
    }

    public void setDistrictId(Long districtId) {
        this.districtId = districtId;
    }

    public String getDistrictName() {
        return districtName;
    }

    public void setDistrictName(String districtName) {
        this.districtName = districtName;
    }

    public Long getWardId() {
        return wardId;
    }

    public void setWardId(Long wardId) {
        this.wardId = wardId;
    }

    public String getWardName() {
        return wardName;
    }

    public void setWardName(String wardName) {
        this.wardName = wardName;
    }

    public Boolean getIsDefault() {
        return isDefault;
    }

    public void setIsDefault(Boolean isDefault) {
        this.isDefault = isDefault;
    }

    public String getFullAddress() {
        return fullAddress;
    }

    public void setFullAddress(String fullAddress) {
        this.fullAddress = fullAddress;
    }
}