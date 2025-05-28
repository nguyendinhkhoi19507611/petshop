package com.petshop.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.petshop.entity.Order;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
public class OrderStatusHistoryDTO {
    private Order.OrderStatus status;
    private String statusName;
    private LocalDateTime timestamp;
    private String description;

    // Constructors
    public OrderStatusHistoryDTO() {}

    public OrderStatusHistoryDTO(Order.OrderStatus status, LocalDateTime timestamp, String description) {
        this.status = status;
        this.statusName = status.getDisplayName();
        this.timestamp = timestamp;
        this.description = description;
    }

    // Getters and Setters
    public Order.OrderStatus getStatus() { return status; }
    public void setStatus(Order.OrderStatus status) { this.status = status; }

    public String getStatusName() { return statusName; }
    public void setStatusName(String statusName) { this.statusName = statusName; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
