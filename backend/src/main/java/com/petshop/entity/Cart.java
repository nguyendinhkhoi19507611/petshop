package com.petshop.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "gio_hang")
public class Cart extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_tai_khoan")
    private User user;

    @Column(name = "tong_gia", precision = 10, scale = 2)
    private BigDecimal totalPrice = BigDecimal.ZERO;

    @Column(name = "tong_so_luong")
    private Integer totalQuantity = 0;

    @Column(name = "giam_gia", precision = 10, scale = 2)
    private BigDecimal discount = BigDecimal.ZERO;

    @Column(name = "ma_giam_gia", length = 50)
    private String couponCode;

    @Column(name = "ngay_cap_nhat")
    private LocalDateTime lastUpdated;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CartItem> cartItems;

    // Constructors
    public Cart() {
        this.lastUpdated = LocalDateTime.now();
    }

    public Cart(User user) {
        this();
        this.user = user;
    }

    // Getters and Setters
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public Integer getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(Integer totalQuantity) {
        this.totalQuantity = totalQuantity;
    }

    public BigDecimal getDiscount() {
        return discount;
    }

    public void setDiscount(BigDecimal discount) {
        this.discount = discount;
    }

    public String getCouponCode() {
        return couponCode;
    }

    public void setCouponCode(String couponCode) {
        this.couponCode = couponCode;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public List<CartItem> getCartItems() {
        return cartItems;
    }

    public void setCartItems(List<CartItem> cartItems) {
        this.cartItems = cartItems;
    }

    // Helper methods
    public BigDecimal getFinalPrice() {
        return totalPrice.subtract(discount);
    }

    public void updateTotals() {
        if (cartItems == null || cartItems.isEmpty()) {
            this.totalPrice = BigDecimal.ZERO;
            this.totalQuantity = 0;
            return;
        }

        this.totalPrice = cartItems.stream()
                .map(CartItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        this.totalQuantity = cartItems.stream()
                .mapToInt(CartItem::getQuantity)
                .sum();

        this.lastUpdated = LocalDateTime.now();
    }
}