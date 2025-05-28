package com.petshop.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.petshop.entity.Promotion;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

// PromotionDTO.java
public class PromotionDTO {
    private Long id;
    private String promotionName;
    private String description;
    private String couponCode;
    private Promotion.DiscountType discountType;
    private BigDecimal discountValue;
    private BigDecimal maxDiscountAmount;
    private BigDecimal minOrderAmount;
    private Integer maxUsageCount;
    private Integer usedCount;
    private Integer limitPerCustomer;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startDate;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endDate;

    private Boolean status;
    private Promotion.ApplicableType applicableType;
    private Boolean forNewCustomersOnly;
    private List<Long> applicableProductIds;
    private List<Long> applicableCategoryIds;

    // Constructors
    public PromotionDTO() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPromotionName() { return promotionName; }
    public void setPromotionName(String promotionName) { this.promotionName = promotionName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCouponCode() { return couponCode; }
    public void setCouponCode(String couponCode) { this.couponCode = couponCode; }

    public Promotion.DiscountType getDiscountType() { return discountType; }
    public void setDiscountType(Promotion.DiscountType discountType) { this.discountType = discountType; }

    public BigDecimal getDiscountValue() { return discountValue; }
    public void setDiscountValue(BigDecimal discountValue) { this.discountValue = discountValue; }

    public BigDecimal getMaxDiscountAmount() { return maxDiscountAmount; }
    public void setMaxDiscountAmount(BigDecimal maxDiscountAmount) { this.maxDiscountAmount = maxDiscountAmount; }

    public BigDecimal getMinOrderAmount() { return minOrderAmount; }
    public void setMinOrderAmount(BigDecimal minOrderAmount) { this.minOrderAmount = minOrderAmount; }

    public Integer getMaxUsageCount() { return maxUsageCount; }
    public void setMaxUsageCount(Integer maxUsageCount) { this.maxUsageCount = maxUsageCount; }

    public Integer getUsedCount() { return usedCount; }
    public void setUsedCount(Integer usedCount) { this.usedCount = usedCount; }

    public Integer getLimitPerCustomer() { return limitPerCustomer; }
    public void setLimitPerCustomer(Integer limitPerCustomer) { this.limitPerCustomer = limitPerCustomer; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

    public Boolean getStatus() { return status; }
    public void setStatus(Boolean status) { this.status = status; }

    public Promotion.ApplicableType getApplicableType() { return applicableType; }
    public void setApplicableType(Promotion.ApplicableType applicableType) { this.applicableType = applicableType; }

    public Boolean getForNewCustomersOnly() { return forNewCustomersOnly; }
    public void setForNewCustomersOnly(Boolean forNewCustomersOnly) { this.forNewCustomersOnly = forNewCustomersOnly; }

    public List<Long> getApplicableProductIds() { return applicableProductIds; }
    public void setApplicableProductIds(List<Long> applicableProductIds) { this.applicableProductIds = applicableProductIds; }

    public List<Long> getApplicableCategoryIds() { return applicableCategoryIds; }
    public void setApplicableCategoryIds(List<Long> applicableCategoryIds) { this.applicableCategoryIds = applicableCategoryIds; }

    // Helper methods
    public boolean isActive() {
        LocalDateTime now = LocalDateTime.now();
        return status && now.isAfter(startDate) && now.isBefore(endDate);
    }

    public boolean isAvailable() {
        return isActive() && (maxUsageCount == null || usedCount < maxUsageCount);
    }

    public Integer getRemainingUsage() {
        if (maxUsageCount == null) return null;
        return Math.max(0, maxUsageCount - usedCount);
    }
}