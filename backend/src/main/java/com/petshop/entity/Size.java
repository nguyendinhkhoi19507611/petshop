package com.petshop.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "kich_co")
public class Size {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_kich_co")
    private Long id;

    @NotBlank(message = "Tên kích cỡ không được để trống")
    @jakarta.validation.constraints.Size(max = 50, message = "Tên kích cỡ không được vượt quá 50 ký tự")
    @Column(name = "ten_kich_co", length = 50, unique = true)
    private String sizeName;

    @jakarta.validation.constraints.Size(max = 500, message = "Mô tả không được vượt quá 500 ký tự")
    @Column(name = "mo_ta", length = 500)
    private String description;

    @Column(name = "gia_tri", length = 20)
    private String value; // Giá trị kích cỡ (S, M, L, XL, 100g, 500g, etc.)

    @Column(name = "don_vi", length = 10)
    private String unit; // Đơn vị (size, weight, volume, etc.)

    @Column(name = "thu_tu")
    private Integer displayOrder; // Thứ tự hiển thị

    @Column(name = "trang_thai")
    private Boolean status = true;

    // Constructors
    public Size() {}

    public Size(String sizeName) {
        this.sizeName = sizeName;
        this.status = true;
    }

    public Size(String sizeName, String value, String unit) {
        this.sizeName = sizeName;
        this.value = value;
        this.unit = unit;
        this.status = true;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSizeName() {
        return sizeName;
    }

    public void setSizeName(String sizeName) {
        this.sizeName = sizeName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }
}