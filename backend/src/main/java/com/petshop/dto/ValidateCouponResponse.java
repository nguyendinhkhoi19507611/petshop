package com.petshop.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.petshop.entity.Promotion;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
public class ValidateCouponResponse {
    private boolean valid;
    private String message;
    private BigDecimal discountAmount;
    private String couponCode;
    private String promotionName;

    // Constructors
    public ValidateCouponResponse() {}

    public ValidateCouponResponse(boolean valid, String message) {
        this.valid = valid;
        this.message = message;
    }

    public ValidateCouponResponse(boolean valid, String message, BigDecimal discountAmount,
                                  String couponCode, String promotionName) {
        this.valid = valid;
        this.message = message;
        this.discountAmount = discountAmount;
        this.couponCode = couponCode;
        this.promotionName = promotionName;
    }

    // Getters and Setters
    public boolean isValid() { return valid; }
    public void setValid(boolean valid) { this.valid = valid; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

    public String getCouponCode() { return couponCode; }
    public void setCouponCode(String couponCode) { this.couponCode = couponCode; }

    public String getPromotionName() { return promotionName; }
    public void setPromotionName(String promotionName) { this.promotionName = promotionName; }
}