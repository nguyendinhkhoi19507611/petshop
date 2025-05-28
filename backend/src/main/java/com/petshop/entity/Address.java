package com.petshop.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "dia_chi")
public class Address extends BaseEntity {

    @Size(max = 500)
    @Column(name = "ghi_chu", length = 500)
    private String note;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_tai_khoan")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_tinh")
    private Province province;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_huyen")
    private District district;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_xa")
    private Ward ward;

    @Column(name = "is_default")
    private Boolean isDefault = false;

    @Size(max = 100)
    @Column(name = "street_address", length = 100)
    private String streetAddress;

    @Size(max = 50)
    @Column(name = "receiver_name", length = 50)
    private String receiverName;

    @Size(max = 15)
    @Column(name = "receiver_phone", length = 15)
    private String receiverPhone;

    // Constructors
    public Address() {}

    public Address(String note, User user, Province province, District district, Ward ward) {
        this.note = note;
        this.user = user;
        this.province = province;
        this.district = district;
        this.ward = ward;
    }

    // Getters and Setters
    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Province getProvince() {
        return province;
    }

    public void setProvince(Province province) {
        this.province = province;
    }

    public District getDistrict() {
        return district;
    }

    public void setDistrict(District district) {
        this.district = district;
    }

    public Ward getWard() {
        return ward;
    }

    public void setWard(Ward ward) {
        this.ward = ward;
    }

    public Boolean getIsDefault() {
        return isDefault;
    }

    public void setIsDefault(Boolean isDefault) {
        this.isDefault = isDefault;
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

    // Helper method to get full address
    public String getFullAddress() {
        StringBuilder fullAddress = new StringBuilder();

        if (streetAddress != null && !streetAddress.trim().isEmpty()) {
            fullAddress.append(streetAddress).append(", ");
        }

        if (note != null && !note.trim().isEmpty()) {
            fullAddress.append(note).append(", ");
        }

        if (ward != null) {
            fullAddress.append(ward.getWardName()).append(", ");
        }

        if (district != null) {
            fullAddress.append(district.getDistrictName()).append(", ");
        }

        if (province != null) {
            fullAddress.append(province.getProvinceName());
        }

        return fullAddress.toString().replaceAll(", $", "");
    }
}