package com.petshop.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "chi_tiet_gio_hang")
public class CartItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_gio_hang")
    private Cart cart;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_san_pham")
    private Product product;

    @Min(value = 1, message = "Số lượng phải lớn hơn 0")
    @Column(name = "so_luong")
    private Integer quantity;

    @Column(name = "gia_tai_thoi_diem", precision = 10, scale = 2)
    private BigDecimal priceAtTime;

    @Column(name = "gia_khuyen_mai_tai_thoi_diem", precision = 10, scale = 2)
    private BigDecimal salePriceAtTime;

    @Column(name = "thanh_tien", precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "ngay_them")
    private LocalDateTime addedAt;

    // Constructors
    public CartItem() {
        this.addedAt = LocalDateTime.now();
    }

    public CartItem(Cart cart, Product product, Integer quantity) {
        this();
        this.cart = cart;
        this.product = product;
        this.quantity = quantity;
        this.priceAtTime = product.getPrice();
        this.salePriceAtTime = product.getSalePrice();
        calculateSubtotal();
    }

    // Getters and Setters
    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
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

    public LocalDateTime getAddedAt() {
        return addedAt;
    }

    public void setAddedAt(LocalDateTime addedAt) {
        this.addedAt = addedAt;
    }

    // Helper methods
    public BigDecimal getEffectivePrice() {
        return salePriceAtTime != null && salePriceAtTime.compareTo(BigDecimal.ZERO) > 0
                ? salePriceAtTime : priceAtTime;
    }

    public void calculateSubtotal() {
        if (quantity != null && getEffectivePrice() != null) {
            this.subtotal = getEffectivePrice().multiply(BigDecimal.valueOf(quantity));
        }
    }

    public void updatePrices() {
        if (product != null) {
            this.priceAtTime = product.getPrice();
            this.salePriceAtTime = product.getSalePrice();
            calculateSubtotal();
        }
    }
}