package com.petshop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

public class SizeRequest {
    @NotBlank(message = "Tên kích cỡ không được để trống")
    @Size(min = 1, max = 50, message = "Tên kích cỡ phải từ 1-50 ký tự")
    private String sizeName;

    @Size(max = 500, message = "Mô tả không được vượt quá 500 ký tự")
    private String description;

    @Size(max = 20, message = "Giá trị không được vượt quá 20 ký tự")
    private String value;

    @Size(max = 10, message = "Đơn vị không được vượt quá 10 ký tự")
    private String unit;

    @Min(value = 0, message = "Thứ tự hiển thị phải >= 0")
    @Max(value = 999, message = "Thứ tự hiển thị phải <= 999")
    private Integer displayOrder;

    private Boolean status = true;

    // Constructors
    public SizeRequest() {}

    public SizeRequest(String sizeName) {
        this.sizeName = sizeName;
        this.status = true;
    }

    // Getters and Setters
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