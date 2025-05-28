package com.petshop.dto;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
public class ApplyCouponRequest {
    @NotNull(message = "Mã giảm giá không được để trống")
    private String couponCode;

    // Constructors
    public ApplyCouponRequest() {}

    public ApplyCouponRequest(String couponCode) {
        this.couponCode = couponCode;
    }

    // Getters and Setters
    public String getCouponCode() { return couponCode; }
    public void setCouponCode(String couponCode) { this.couponCode = couponCode; }
}
