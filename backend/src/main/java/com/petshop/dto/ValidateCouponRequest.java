package com.petshop.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.petshop.entity.Promotion;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
public class ValidateCouponRequest {
    @NotBlank(message = "Mã giảm giá không được để trống")
    private String couponCode;

    @NotNull(message = "Giá trị đơn hàng không được để trống")
    @DecimalMin(value = "0.0", message = "Giá trị đơn hàng phải lớn hơn 0")
    private BigDecimal orderAmount;

    private Long userId;

    // Constructors
    public ValidateCouponRequest() {}

    // Getters and Setters
    public String getCouponCode() { return couponCode; }
    public void setCouponCode(String couponCode) { this.couponCode = couponCode; }

    public BigDecimal getOrderAmount() { return orderAmount; }
    public void setOrderAmount(BigDecimal orderAmount) { this.orderAmount = orderAmount; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
