package com.petshop.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Entity
@Table(name = "chi_tiet_don_hang")
public class OrderItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_don_hang")
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_san_pham")
    private Product product;

    @NotNull
    @Min(value = 1, message = "Số lượng phải lớn hơn 0")
    @Column(name = "so_luong")
    private Integer quantity;

    @NotNull
    @Column(name = "gia_tai_thoi_diem", precision = 10, scale = 2)
    private BigDecimal priceAtTime;

    @Column(name = "gia_khuyen_mai_tai_thoi_diem", precision = 10, scale = 2)
    private BigDecimal salePriceAtTime;

    @NotNull
    @Column(name = "thanh_tien", precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "ten_san_pham_tai_thoi_diem", length = 500)
    private String productNameAtTime;

    @Column(name = "sku_tai_thoi_diem", length = 100)
    private String skuAtTime;

    @Column(name = "hinh_anh_tai_thoi_diem", length = 200)
    private String imageAtTime;

    // Constructors
    public OrderItem() {}

    public OrderItem(Order order, Product product, Integer quantity) {
        this.order = order;
        this.product = product;
        this.quantity = quantity;
        this.priceAtTime = product.getPrice();
        this.salePriceAtTime = product.getSalePrice();
        this.productNameAtTime = product.getProductName();
        this.skuAtTime = product.getSku();
        this.imageAtTime = product.getImage();
        calculateSubtotal();
    }

    // Getters and Setters
    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
        calculateSubtotal();
    }

    public BigDecimal getPriceAtTime() {
        return priceAtTime;
    }

    public void setPriceAtTime(BigDecimal priceAtTime) {
        this.priceAtTime = priceAtTime;
        calculateSubtotal();
    }

    public BigDecimal getSalePriceAtTime() {
        return salePriceAtTime;
    }

    public void setSalePriceAtTime(BigDecimal salePriceAtTime) {
        this.salePriceAtTime = salePriceAtTime;
        calculateSubtotal();
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public String getProductNameAtTime() {
        return productNameAtTime;
    }

    public void setProductNameAtTime(String productNameAtTime) {
        this.productNameAtTime = productNameAtTime;
    }

    public String getSkuAtTime() {
        return skuAtTime;
    }

    public void setSkuAtTime(String skuAtTime) {
        this.skuAtTime = skuAtTime;
    }

    public String getImageAtTime() {
        return imageAtTime;
    }

    public void setImageAtTime(String imageAtTime) {
        this.imageAtTime = imageAtTime;
    }

    // Helper methods
    public BigDecimal getEffectivePriceAtTime() {
        return salePriceAtTime != null && salePriceAtTime.compareTo(BigDecimal.ZERO) > 0
                ? salePriceAtTime : priceAtTime;
    }

    public void calculateSubtotal() {
        if (quantity != null && getEffectivePriceAtTime() != null) {
            this.subtotal = getEffectivePriceAtTime().multiply(BigDecimal.valueOf(quantity));
        }
    }

    public BigDecimal getSavings() {
        if (salePriceAtTime != null && salePriceAtTime.compareTo(BigDecimal.ZERO) > 0
                && priceAtTime.compareTo(salePriceAtTime) > 0) {
            return priceAtTime.subtract(salePriceAtTime).multiply(BigDecimal.valueOf(quantity));
        }
        return BigDecimal.ZERO;
    }
}