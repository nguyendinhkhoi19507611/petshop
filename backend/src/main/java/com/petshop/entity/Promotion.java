package com.petshop.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.chrono.ChronoLocalDate;
import java.util.List;

@Entity
@Table(name = "khuyen_mai")
public class Promotion extends BaseEntity {

    @NotBlank
    @Column(name = "ten_khuyen_mai", length = 100, nullable = false)
    private String promotionName;

    @Column(name = "mo_ta", length = 1000)
    private String description;

    @NotBlank
    @Column(name = "ma_giam_gia", unique = true, length = 50, nullable = false)
    private String couponCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai_giam_gia")
    private DiscountType discountType;

    @DecimalMin(value = "0.0", message = "Giá trị giảm giá phải lớn hơn hoặc bằng 0")
    @Column(name = "gia_tri_giam_gia", precision = 10, scale = 2)
    private BigDecimal discountValue;

    @DecimalMin(value = "0.0", message = "Giá trị giảm tối đa phải lớn hơn hoặc bằng 0")
    @Column(name = "giam_toi_da", precision = 10, scale = 2)
    private BigDecimal maxDiscountAmount;

    @DecimalMin(value = "0.0", message = "Giá trị đơn hàng tối thiểu phải lớn hơn hoặc bằng 0")
    @Column(name = "don_hang_toi_thieu", precision = 10, scale = 2)
    private BigDecimal minOrderAmount = BigDecimal.ZERO;

    @Min(value = 0, message = "Số lượng sử dụng tối đa phải lớn hơn hoặc bằng 0")
    @Column(name = "so_luong_toi_da")
    private Integer maxUsageCount;

    @Min(value = 0, message = "Số lượng đã sử dụng phải lớn hơn hoặc bằng 0")
    @Column(name = "so_luong_da_su_dung")
    private Integer usedCount = 0;

    @Min(value = 0, message = "Giới hạn sử dụng cho mỗi khách hàng phải lớn hơn hoặc bằng 0")
    @Column(name = "gioi_han_moi_khach_hang")
    private Integer limitPerCustomer = 1;

    @NotNull
    @Column(name = "ngay_bat_dau")
    private LocalDateTime startDate;

    @NotNull
    @Column(name = "ngay_ket_thuc")
    private LocalDateTime endDate;

    @Column(name = "trang_thai")
    private Boolean status = true;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai_ap_dung")
    private ApplicableType applicableType = ApplicableType.ALL;

    @Column(name = "ap_dung_cho_khach_hang_moi")
    private Boolean forNewCustomersOnly = false;

    @ManyToMany
    @JoinTable(
            name = "khuyen_mai_san_pham",
            joinColumns = @JoinColumn(name = "ma_khuyen_mai"),
            inverseJoinColumns = @JoinColumn(name = "ma_san_pham")
    )
    private List<Product> applicableProducts;

    @ManyToMany
    @JoinTable(
            name = "khuyen_mai_danh_muc",
            joinColumns = @JoinColumn(name = "ma_khuyen_mai"),
            inverseJoinColumns = @JoinColumn(name = "ma_danh_muc")
    )
    private List<Category> applicableCategories;

    @OneToMany(mappedBy = "promotion", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PromotionUsage> promotionUsages;

    // Constructors
    public Promotion() {}

    public Promotion(String promotionName, String couponCode, DiscountType discountType, BigDecimal discountValue) {
        this.promotionName = promotionName;
        this.couponCode = couponCode;
        this.discountType = discountType;
        this.discountValue = discountValue;
    }

    // Getters and Setters
    public String getPromotionName() {
        return promotionName;
    }

    public void setPromotionName(String promotionName) {
        this.promotionName = promotionName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCouponCode() {
        return couponCode;
    }

    public void setCouponCode(String couponCode) {
        this.couponCode = couponCode;
    }

    public DiscountType getDiscountType() {
        return discountType;
    }

    public void setDiscountType(DiscountType discountType) {
        this.discountType = discountType;
    }

    public BigDecimal getDiscountValue() {
        return discountValue;
    }

    public void setDiscountValue(BigDecimal discountValue) {
        this.discountValue = discountValue;
    }

    public BigDecimal getMaxDiscountAmount() {
        return maxDiscountAmount;
    }

    public void setMaxDiscountAmount(BigDecimal maxDiscountAmount) {
        this.maxDiscountAmount = maxDiscountAmount;
    }

    public BigDecimal getMinOrderAmount() {
        return minOrderAmount;
    }

    public void setMinOrderAmount(BigDecimal minOrderAmount) {
        this.minOrderAmount = minOrderAmount;
    }

    public Integer getMaxUsageCount() {
        return maxUsageCount;
    }

    public void setMaxUsageCount(Integer maxUsageCount) {
        this.maxUsageCount = maxUsageCount;
    }

    public Integer getUsedCount() {
        return usedCount;
    }

    public void setUsedCount(Integer usedCount) {
        this.usedCount = usedCount;
    }

    public Integer getLimitPerCustomer() {
        return limitPerCustomer;
    }

    public void setLimitPerCustomer(Integer limitPerCustomer) {
        this.limitPerCustomer = limitPerCustomer;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public ApplicableType getApplicableType() {
        return applicableType;
    }

    public void setApplicableType(ApplicableType applicableType) {
        this.applicableType = applicableType;
    }

    public Boolean getForNewCustomersOnly() {
        return forNewCustomersOnly;
    }

    public void setForNewCustomersOnly(Boolean forNewCustomersOnly) {
        this.forNewCustomersOnly = forNewCustomersOnly;
    }

    public List<Product> getApplicableProducts() {
        return applicableProducts;
    }

    public void setApplicableProducts(List<Product> applicableProducts) {
        this.applicableProducts = applicableProducts;
    }

    public List<Category> getApplicableCategories() {
        return applicableCategories;
    }

    public void setApplicableCategories(List<Category> applicableCategories) {
        this.applicableCategories = applicableCategories;
    }

    public List<PromotionUsage> getPromotionUsages() {
        return promotionUsages;
    }

    public void setPromotionUsages(List<PromotionUsage> promotionUsages) {
        this.promotionUsages = promotionUsages;
    }

    // Helper methods
    public boolean isActive() {
        LocalDateTime now = LocalDateTime.now();
        return status && now.isAfter(startDate) && now.isBefore(endDate);
    }

    public boolean isAvailable() {
        return isActive() && (maxUsageCount == null || usedCount < maxUsageCount);
    }

    public boolean canBeUsedBy(User user) {
        if (!isAvailable()) return false;

        if (forNewCustomersOnly && !isNewCustomer(user)) return false;

        if (limitPerCustomer != null) {
            long userUsageCount = promotionUsages.stream()
                    .filter(usage -> usage.getUser().getId().equals(user.getId()))
                    .count();
            return userUsageCount < limitPerCustomer;
        }

        return true;
    }

    private boolean isNewCustomer(User user) {
        // Logic to check if user is a new customer
        // Could be based on registration date, first order, etc.
        return user.getCreatedDate().isAfter(ChronoLocalDate.from(LocalDateTime.now().minusDays(30)));
    }

    public BigDecimal calculateDiscount(BigDecimal orderAmount) {
        if (!isAvailable() || orderAmount.compareTo(minOrderAmount) < 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal discount;
        switch (discountType) {
            case PERCENTAGE:
                discount = orderAmount.multiply(discountValue).divide(BigDecimal.valueOf(100));
                if (maxDiscountAmount != null && discount.compareTo(maxDiscountAmount) > 0) {
                    discount = maxDiscountAmount;
                }
                break;
            case FIXED_AMOUNT:
                discount = discountValue;
                break;
            default:
                discount = BigDecimal.ZERO;
        }

        return discount.min(orderAmount); // Discount cannot exceed order amount
    }

    public void incrementUsageCount() {
        this.usedCount++;
    }

    // Validation methods for business logic
    @PrePersist
    @PreUpdate
    private void validateData() {
        if (promotionName != null && promotionName.length() > 100) {
            throw new IllegalArgumentException("Tên khuyến mãi không được vượt quá 100 ký tự");
        }

        if (description != null && description.length() > 1000) {
            throw new IllegalArgumentException("Mô tả không được vượt quá 1000 ký tự");
        }

        if (couponCode != null && couponCode.length() > 50) {
            throw new IllegalArgumentException("Mã giảm giá không được vượt quá 50 ký tự");
        }
    }

    // Enums
    public enum DiscountType {
        PERCENTAGE("Giảm theo phần trăm"),
        FIXED_AMOUNT("Giảm số tiền cố định");

        private final String displayName;

        DiscountType(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    public enum ApplicableType {
        ALL("Tất cả sản phẩm"),
        SPECIFIC_PRODUCTS("Sản phẩm cụ thể"),
        SPECIFIC_CATEGORIES("Danh mục cụ thể");

        private final String displayName;

        ApplicableType(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }
}