package com.petshop.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.petshop.entity.Promotion;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
public class PromotionRequest {
    @NotBlank(message = "Tên khuyến mãi không được để trống")
    @Size(max = 100, message = "Tên khuyến mãi không được vượt quá 100 ký tự")
    private String promotionName;

    @Size(max = 1000, message = "Mô tả không được vượt quá 1000 ký tự")
    private String description;

    @NotBlank(message = "Mã giảm giá không được để trống")
    @Size(max = 50, message = "Mã giảm giá không được vượt quá 50 ký tự")
    private String couponCode;

    @NotNull(message = "Loại giảm giá không được để trống")
    private Promotion.DiscountType discountType;

    @NotNull(message = "Giá trị giảm giá không được để trống")
    @DecimalMin(value = "0.0", message = "Giá trị giảm giá phải lớn hơn 0")
    private BigDecimal discountValue;

    @DecimalMin(value = "0.0", message = "Giá trị giảm tối đa phải lớn hơn 0")
    private BigDecimal maxDiscountAmount;

    @DecimalMin(value = "0.0", message = "Giá trị đơn hàng tối thiểu phải lớn hơn hoặc bằng 0")
    private BigDecimal minOrderAmount = BigDecimal.ZERO;

    @Min(value = 1, message = "Số lượng sử dụng tối đa phải lớn hơn 0")
    private Integer maxUsageCount;

    @Min(value = 1, message = "Giới hạn sử dụng cho mỗi khách hàng phải lớn hơn 0")
    private Integer limitPerCustomer = 1;

    @NotNull(message = "Ngày bắt đầu không được để trống")
    @Future(message = "Ngày bắt đầu phải sau thời điểm hiện tại")
    private LocalDateTime startDate;

    @NotNull(message = "Ngày kết thúc không được để trống")
    @Future(message = "Ngày kết thúc phải sau thời điểm hiện tại")
    private LocalDateTime endDate;

    private Boolean status = true;

    private Promotion.ApplicableType applicableType = Promotion.ApplicableType.ALL;

    private Boolean forNewCustomersOnly = false;

    private List<Long> applicableProductIds;

    private List<Long> applicableCategoryIds;

    // Constructors
    public PromotionRequest() {}

    // Getters and Setters
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

    // Validation method
    @AssertTrue(message = "Ngày kết thúc phải sau ngày bắt đầu")
    private boolean isEndDateAfterStartDate() {
        return endDate == null || startDate == null || endDate.isAfter(startDate);
    }

    @AssertTrue(message = "Với giảm giá theo phần trăm, giá trị phải từ 1-100")
    private boolean isValidPercentage() {
        if (discountType == Promotion.DiscountType.PERCENTAGE) {
            return discountValue != null &&
                    discountValue.compareTo(BigDecimal.ONE) >= 0 &&
                    discountValue.compareTo(BigDecimal.valueOf(100)) <= 0;
        }
        return true;
    }
}

