package com.petshop.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "loai_san_pham")
public class ProductType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_loai")
    private Long id;

    @NotBlank(message = "Tên loại sản phẩm không được để trống")
    @Size(max = 50, message = "Tên loại sản phẩm không được vượt quá 50 ký tự")
    @Column(name = "ten_loai_san_pham", length = 50)
    private String productTypeName;

    @Column(name = "loai")
    private Integer type; // Phân loại (11: thức ăn khô, 12: thức ăn ướt, 6: phụ kiện, etc.)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_danh_muc")
    private Category category;

    @Size(max = 500, message = "Mô tả không được vượt quá 500 ký tự")
    @Column(name = "mo_ta", length = 500)
    private String description;

    @Column(name = "trang_thai")
    private Boolean status = true;

    // Constructors
    public ProductType() {}

    public ProductType(String productTypeName, Integer type, Category category) {
        this.productTypeName = productTypeName;
        this.type = type;
        this.category = category;
        this.status = true;
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

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
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