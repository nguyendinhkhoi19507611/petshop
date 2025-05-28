package com.petshop.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.petshop.entity.Order;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
public class OrderItemDTO {
    private Long id;
    private Long orderId;
    private Long productId;
    private String productName;
    private String productImage;
    private String sku;
    private Integer quantity;
    private BigDecimal priceAtTime;
    private BigDecimal salePriceAtTime;
    private BigDecimal subtotal;

    // Constructors
    public OrderItemDTO() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductImage() { return productImage; }
    public void setProductImage(String productImage) { this.productImage = productImage; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getPriceAtTime() { return priceAtTime; }
    public void setPriceAtTime(BigDecimal priceAtTime) { this.priceAtTime = priceAtTime; }

    public BigDecimal getSalePriceAtTime() { return salePriceAtTime; }
    public void setSalePriceAtTime(BigDecimal salePriceAtTime) { this.salePriceAtTime = salePriceAtTime; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public BigDecimal getEffectivePrice() {
        return salePriceAtTime != null && salePriceAtTime.compareTo(BigDecimal.ZERO) > 0
                ? salePriceAtTime : priceAtTime;
    }
}

