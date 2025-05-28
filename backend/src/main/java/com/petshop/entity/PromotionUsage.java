package com.petshop.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "su_dung_khuyen_mai")
public class PromotionUsage extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_khuyen_mai")
    private Promotion promotion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_tai_khoan")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_don_hang")
    private Order order;

    @Column(name = "ngay_su_dung")
    private LocalDateTime usedAt;

    @Column(name = "gia_tri_giam_gia", precision = 10, scale = 2)
    private BigDecimal discountAmount;

    @Column(name = "gia_tri_don_hang", precision = 12, scale = 2)
    private BigDecimal orderAmount;

    // Constructors
    public PromotionUsage() {
        this.usedAt = LocalDateTime.now();
    }

    public PromotionUsage(Promotion promotion, User user, Order order, BigDecimal discountAmount, BigDecimal orderAmount) {
        this();
        this.promotion = promotion;
        this.user = user;
        this.order = order;
        this.discountAmount = discountAmount;
        this.orderAmount = orderAmount;
    }

    // Getters and Setters
    public Promotion getPromotion() {
        return promotion;
    }

    public void setPromotion(Promotion promotion) {
        this.promotion = promotion;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public LocalDateTime getUsedAt() {
        return usedAt;
    }

    public void setUsedAt(LocalDateTime usedAt) {
        this.usedAt = usedAt;
    }

    public BigDecimal getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(BigDecimal discountAmount) {
        this.discountAmount = discountAmount;
    }

    public BigDecimal getOrderAmount() {
        return orderAmount;
    }

    public void setOrderAmount(BigDecimal orderAmount) {
        this.orderAmount = orderAmount;
    }
}