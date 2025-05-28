package com.petshop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ProductTypeDTO {
    private Long id;

    @NotBlank(message = "Tên loại sản phẩm không được để trống")
    @Size(max = 50, message = "Tên loại sản phẩm không được vượt quá 50 ký tự")
    private String productTypeName;

    private Integer type;
    private Long categoryId;
    private String categoryName;

    @Size(max = 500, message = "Mô tả không được vượt quá 500 ký tự")
    private String description;

    private Boolean status;
    private Long productCount;

    // Constructors
    public ProductTypeDTO() {}

    public ProductTypeDTO(Long id, String productTypeName, Integer type, String categoryName, Boolean status) {
        this.id = id;
        this.productTypeName = productTypeName;
        this.type = type;
        this.categoryName = categoryName;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
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

    public Long getProductCount() {
        return productCount;
    }

    public void setProductCount(Long productCount) {
        this.productCount = productCount;
    }
}
