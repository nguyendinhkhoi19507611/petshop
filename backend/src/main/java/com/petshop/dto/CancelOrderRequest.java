package com.petshop.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.petshop.entity.Order;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
public class CancelOrderRequest {
    @NotBlank(message = "Lý do hủy không được để trống")
    @Size(max = 1000, message = "Lý do hủy không được vượt quá 1000 ký tự")
    private String cancellationReason;

    // Constructors
    public CancelOrderRequest() {}

    public CancelOrderRequest(String cancellationReason) {
        this.cancellationReason = cancellationReason;
    }

    // Getters and Setters
    public String getCancellationReason() { return cancellationReason; }
    public void setCancellationReason(String cancellationReason) { this.cancellationReason = cancellationReason; }
}
