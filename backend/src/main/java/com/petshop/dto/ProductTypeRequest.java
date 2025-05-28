package com.petshop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ProductTypeRequest {
    @NotBlank(message = "Tên loại sản phẩm không được để trống")
    @Size(min = 2, max = 50, message = "Tên loại sản phẩm phải từ 2-50 ký tự")
    private String productTypeName;

    private Integer type;

    @NotNull(message = "Danh mục không được để trống")
    private Long categoryId;

    @Size(max = 500, message = "Mô tả không được vượt quá 500 ký tự")
    private String description;

    private Boolean status = true;

    // Constructors
    public ProductTypeRequest() {}

    public ProductTypeRequest(String productTypeName, Long categoryId) {
        this.productTypeName = productTypeName;
        this.categoryId = categoryId;
        this.status = true;
    }

    // Getters and Setters
    public String getProductTypeName() {
        return productTypeName;
    }

    public void setProductTypeName(String productTypeName) {
        this.productTypeName = productTypeName;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }
}