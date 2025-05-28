package com.petshop.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "don_hang")
public class Order extends BaseEntity {

    @Column(name = "ma_don_hang", unique = true, length = 50)
    private String orderCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_tai_khoan")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai")
    private OrderStatus status = OrderStatus.PENDING;

    @Column(name = "tong_gia_san_pham", precision = 12, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "phi_van_chuyen", precision = 10, scale = 2)
    private BigDecimal shippingFee = BigDecimal.ZERO;

    @Column(name = "giam_gia", precision = 10, scale = 2)
    private BigDecimal discount = BigDecimal.ZERO;

    @Column(name = "tong_thanh_toan", precision = 12, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "ma_giam_gia", length = 50)
    private String couponCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "phuong_thuc_thanh_toan")
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai_thanh_toan")
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Column(name = "ngay_dat_hang")
    private LocalDateTime orderDate;

    @Column(name = "ngay_xac_nhan")
    private LocalDateTime confirmedAt;

    @Column(name = "ngay_giao_hang")
    private LocalDateTime shippedAt;

    @Column(name = "ngay_hoan_thanh")
    private LocalDateTime completedAt;

    @Column(name = "ngay_huy")
    private LocalDateTime cancelledAt;

    @Size(max = 500)
    @Column(name = "ghi_chu", length = 500)
    private String notes;

    @Size(max = 1000)
    @Column(name = "ly_do_huy", length = 1000)
    private String cancellationReason;

    // Shipping Address
    @NotBlank
    @Size(max = 100)
    @Column(name = "ten_nguoi_nhan", length = 100)
    private String receiverName;

    @NotBlank
    @Size(max = 15)
    @Column(name = "sdt_nguoi_nhan", length = 15)
    private String receiverPhone;

    @NotBlank
    @Size(max = 500)
    @Column(name = "dia_chi_giao_hang", length = 500)
    private String shippingAddress;

    @Column(name = "ma_van_chuyen", length = 100)
    private String trackingNumber;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderItem> orderItems;

    // Constructors
    public Order() {
        this.orderDate = LocalDateTime.now();
        this.orderCode = generateOrderCode();
    }

    public Order(User user) {
        this();
        this.user = user;
    }

    // Getters and Setters
    public String getOrderCode() {
        return orderCode;
    }

    public void setOrderCode(String orderCode) {
        this.orderCode = orderCode;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
        updateStatusTimestamps();
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public BigDecimal getShippingFee() {
        return shippingFee;
    }

    public void setShippingFee(BigDecimal shippingFee) {
        this.shippingFee = shippingFee;
    }

    public BigDecimal getDiscount() {
        return discount;
    }

    public void setDiscount(BigDecimal discount) {
        this.discount = discount;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getCouponCode() {
        return couponCode;
    }

    public void setCouponCode(String couponCode) {
        this.couponCode = couponCode;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public LocalDateTime getConfirmedAt() {
        return confirmedAt;
    }

    public void setConfirmedAt(LocalDateTime confirmedAt) {
        this.confirmedAt = confirmedAt;
    }

    public LocalDateTime getShippedAt() {
        return shippedAt;
    }

    public void setShippedAt(LocalDateTime shippedAt) {
        this.shippedAt = shippedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public LocalDateTime getCancelledAt() {
        return cancelledAt;
    }

    public void setCancelledAt(LocalDateTime cancelledAt) {
        this.cancelledAt = cancelledAt;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getCancellationReason() {
        return cancellationReason;
    }

    public void setCancellationReason(String cancellationReason) {
        this.cancellationReason = cancellationReason;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public void setReceiverName(String receiverName) {
        this.receiverName = receiverName;
    }

    public String getReceiverPhone() {
        return receiverPhone;
    }

    public void setReceiverPhone(String receiverPhone) {
        this.receiverPhone = receiverPhone;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getTrackingNumber() {
        return trackingNumber;
    }

    public void setTrackingNumber(String trackingNumber) {
        this.trackingNumber = trackingNumber;
    }

    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    // Helper methods
    private String generateOrderCode() {
        return "DH" + System.currentTimeMillis();
    }

    private void updateStatusTimestamps() {
        LocalDateTime now = LocalDateTime.now();
        switch (status) {
            case CONFIRMED:
                if (confirmedAt == null) confirmedAt = now;
                break;
            case SHIPPING:
                if (shippedAt == null) shippedAt = now;
                break;
            case COMPLETED:
                if (completedAt == null) completedAt = now;
                break;
            case CANCELLED:
                if (cancelledAt == null) cancelledAt = now;
                break;
        }
    }

    public void calculateTotalAmount() {
        this.totalAmount = subtotal.add(shippingFee).subtract(discount);
    }

    public boolean canBeCancelled() {
        return status == OrderStatus.PENDING || status == OrderStatus.CONFIRMED;
    }

    public boolean canBeConfirmed() {
        return status == OrderStatus.PENDING;
    }

    public boolean canBeShipped() {
        return status == OrderStatus.CONFIRMED;
    }

    public boolean canBeCompleted() {
        return status == OrderStatus.SHIPPING;
    }

    // Enums
    public enum OrderStatus {
        PENDING("Chờ xác nhận"),
        CONFIRMED("Đã xác nhận"),
        SHIPPING("Đang giao hàng"),
        COMPLETED("Hoàn thành"),
        CANCELLED("Đã hủy");

        private final String displayName;

        OrderStatus(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    public enum PaymentMethod {
        COD("Thanh toán khi nhận hàng"),
        BANK_TRANSFER("Chuyển khoản ngân hàng"),
        CREDIT_CARD("Thẻ tín dụng"),
        E_WALLET("Ví điện tử");

        private final String displayName;

        PaymentMethod(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    public enum PaymentStatus {
        PENDING("Chờ thanh toán"),
        PAID("Đã thanh toán"),
        FAILED("Thanh toán thất bại"),
        REFUNDED("Đã hoàn tiền");

        private final String displayName;

        PaymentStatus(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }
}