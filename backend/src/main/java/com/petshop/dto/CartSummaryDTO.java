package com.petshop.dto;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
public class CartSummaryDTO {
    private Integer totalItems;
    private BigDecimal subtotal;
    private BigDecimal discount;
    private BigDecimal shipping;
    private BigDecimal total;
    private String couponCode;
    private boolean hasOutOfStockItems;

    // Constructors
    public CartSummaryDTO() {}

    // Getters and Setters
    public Integer getTotalItems() { return totalItems; }
    public void setTotalItems(Integer totalItems) { this.totalItems = totalItems; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public BigDecimal getDiscount() { return discount; }
    public void setDiscount(BigDecimal discount) { this.discount = discount; }

    public BigDecimal getShipping() { return shipping; }
    public void setShipping(BigDecimal shipping) { this.shipping = shipping; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }

    public String getCouponCode() { return couponCode; }
    public void setCouponCode(String couponCode) { this.couponCode = couponCode; }

    public boolean isHasOutOfStockItems() { return hasOutOfStockItems; }
    public void setHasOutOfStockItems(boolean hasOutOfStockItems) { this.hasOutOfStockItems = hasOutOfStockItems; }
}

