package com.petshop.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;


import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "san_pham")
public class Product extends BaseEntity {

    @NotBlank(message = "Tên sản phẩm không được để trống")
    @jakarta.validation.constraints.Size(max = 500, message = "Tên sản phẩm không được vượt quá 500 ký tự")
    @Column(name = "ten_san_pham", length = 500)
    private String productName;

    @Column(name = "mo_ta", columnDefinition = "TEXT")
    private String description;

    @Column(name = "hinh_anh", length = 200)
    private String image;

    @Column(name = "ngay_tao")
    private LocalDateTime createdDate;

    @DecimalMin(value = "0.0", message = "Giá sản phẩm phải lớn hơn 0")
    @Column(name = "gia_san_pham", precision = 10, scale = 2)
    private BigDecimal price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_loai")
    private ProductType productType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_kich_co")
    private Size size;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_thuong_hieu")
    private Brand brand;

    @Min(value = 0, message = "Tồn kho phải lớn hơn hoặc bằng 0")
    @Column(name = "ton_kho")
    private Integer stock = 0;

    @Column(name = "sku", length = 100, unique = true)
    private String sku;

    @Column(name = "trang_thai")
    private Boolean status = true;

    @Column(name = "featured")
    private Boolean featured = false;

    @Column(name = "sale_price", precision = 10, scale = 2)
    private BigDecimal salePrice;

    @Column(name = "weight", precision = 8, scale = 2)
    private BigDecimal weight;

    @Column(name = "dimensions", length = 100)
    private String dimensions;

    @jakarta.validation.constraints.Size(max = 255, message = "Meta title không được vượt quá 255 ký tự")
    @Column(name = "meta_title", length = 255)
    private String metaTitle;

    @jakarta.validation.constraints.Size(max = 500, message = "Meta description không được vượt quá 500 ký tự")
    @Column(name = "meta_description", length = 500)
    private String metaDescription;

    @jakarta.validation.constraints.Size(max = 500, message = "Tags không được vượt quá 500 ký tự")
    @Column(name = "tags", length = 500)
    private String tags;

    @Min(value = 0, message = "Số lượng đã bán phải lớn hơn hoặc bằng 0")
    @Column(name = "sold_quantity")
    private Integer soldQuantity = 0;

    @Column(name = "low_stock_threshold")
    private Integer lowStockThreshold = 10;

    // Constructors
    public Product() {
        this.createdDate = LocalDateTime.now();
    }

    public Product(String productName, BigDecimal price) {
        this();
        this.productName = productName;
        this.price = price;
    }

    // Getters and Setters
    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public ProductType getProductType() {
        return productType;
    }

    public void setProductType(ProductType productType) {
        this.productType = productType;
    }

    public Size getSize() {
        return size;
    }

    public void setSize(Size size) {
        this.size = size;
    }

    public Brand getBrand() {
        return brand;
    }

    public void setBrand(Brand brand) {
        this.brand = brand;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public Boolean getFeatured() {
        return featured;
    }

    public void setFeatured(Boolean featured) {
        this.featured = featured;
    }

    public BigDecimal getSalePrice() {
        return salePrice;
    }

    public void setSalePrice(BigDecimal salePrice) {
        this.salePrice = salePrice;
    }

    public BigDecimal getWeight() {
        return weight;
    }

    public void setWeight(BigDecimal weight) {
        this.weight = weight;
    }

    public String getDimensions() {
        return dimensions;
    }

    public void setDimensions(String dimensions) {
        this.dimensions = dimensions;
    }

    public String getMetaTitle() {
        return metaTitle;
    }

    public void setMetaTitle(String metaTitle) {
        this.metaTitle = metaTitle;
    }

    public String getMetaDescription() {
        return metaDescription;
    }

    public void setMetaDescription(String metaDescription) {
        this.metaDescription = metaDescription;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public Integer getSoldQuantity() {
        return soldQuantity;
    }

    public void setSoldQuantity(Integer soldQuantity) {
        this.soldQuantity = soldQuantity;
    }

    public Integer getLowStockThreshold() {
        return lowStockThreshold;
    }

    public void setLowStockThreshold(Integer lowStockThreshold) {
        this.lowStockThreshold = lowStockThreshold;
    }

    // Helper methods
    public boolean isLowStock() {
        return stock != null && stock <= lowStockThreshold;
    }

    public boolean isOutOfStock() {
        return stock == null || stock <= 0;
    }

    public BigDecimal getEffectivePrice() {
        return salePrice != null && salePrice.compareTo(BigDecimal.ZERO) > 0 ? salePrice : price;
    }

    public boolean isOnSale() {
        return salePrice != null && salePrice.compareTo(BigDecimal.ZERO) > 0 &&
                price != null && salePrice.compareTo(price) < 0;
    }

    public BigDecimal getDiscountPercentage() {
        if (!isOnSale()) {
            return BigDecimal.ZERO;
        }
        BigDecimal discount = price.subtract(salePrice);
        return discount.divide(price, 4, BigDecimal.ROUND_HALF_UP)
                .multiply(BigDecimal.valueOf(100));
    }
}