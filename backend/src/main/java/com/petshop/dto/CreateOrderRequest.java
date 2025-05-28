package com.petshop.dto;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.petshop.entity.Order;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
public class CreateOrderRequest {
    @NotBlank(message = "Tên người nhận không được để trống")
    @Size(max = 100, message = "Tên người nhận không được vượt quá 100 ký tự")
    private String receiverName;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Size(max = 15, message = "Số điện thoại không được vượt quá 15 ký tự")
    private String receiverPhone;

    @NotBlank(message = "Địa chỉ giao hàng không được để trống")
    @Size(max = 500, message = "Địa chỉ giao hàng không được vượt quá 500 ký tự")
    private String shippingAddress;

    @NotNull(message = "Phương thức thanh toán không được để trống")
    private Order.PaymentMethod paymentMethod;

    @Size(max = 500, message = "Ghi chú không được vượt quá 500 ký tự")
    private String notes;

    private String couponCode;

    private Long addressId; // ID địa chỉ có sẵn của user

    // Constructors
    public CreateOrderRequest() {}

    // Getters and Setters
    public String getReceiverName() { return receiverName; }
    public void setReceiverName(String receiverName) { this.receiverName = receiverName; }

    public String getReceiverPhone() { return receiverPhone; }
    public void setReceiverPhone(String receiverPhone) { this.receiverPhone = receiverPhone; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public Order.PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(Order.PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getCouponCode() { return couponCode; }
    public void setCouponCode(String couponCode) { this.couponCode = couponCode; }

    public Long getAddressId() { return addressId; }
    public void setAddressId(Long addressId) { this.addressId = addressId; }
}

