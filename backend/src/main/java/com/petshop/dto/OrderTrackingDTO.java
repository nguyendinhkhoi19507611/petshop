package com.petshop.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.petshop.entity.Order;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
public class OrderTrackingDTO {
    private String orderCode;
    private Order.OrderStatus currentStatus;
    private String trackingNumber;
    private List<OrderStatusHistoryDTO> statusHistory;

    // Constructors
    public OrderTrackingDTO() {}

    // Getters and Setters
    public String getOrderCode() { return orderCode; }
    public void setOrderCode(String orderCode) { this.orderCode = orderCode; }

    public Order.OrderStatus getCurrentStatus() { return currentStatus; }
    public void setCurrentStatus(Order.OrderStatus currentStatus) { this.currentStatus = currentStatus; }

    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }

    public List<OrderStatusHistoryDTO> getStatusHistory() { return statusHistory; }
    public void setStatusHistory(List<OrderStatusHistoryDTO> statusHistory) { this.statusHistory = statusHistory; }
}