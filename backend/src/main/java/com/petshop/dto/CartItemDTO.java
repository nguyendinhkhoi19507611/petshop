package com.petshop.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class CartItemDTO {
    private Long id;
    private Long cartId;
    private Long productId;
    private String productName;
    private String productImage;
    private String sku;
    private Integer quantity;
    private BigDecimal priceAtTime;
    private BigDecimal salePriceAtTime;
    private BigDecimal subtotal;
    private Integer availableStock;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime addedAt;

    // Constructors
    public CartItemDTO() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCartId() { return cartId; }
    public void setCartId(Long cartId) { this.cartId = cartId; }

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

    public Integer getAvailableStock() { return availableStock; }
    public void setAvailableStock(Integer availableStock) { this.availableStock = availableStock; }

    public LocalDateTime getAddedAt() { return addedAt; }
    public void setAddedAt(LocalDateTime addedAt) { this.addedAt = addedAt; }

    public BigDecimal getEffectivePrice() {
        return salePriceAtTime != null && salePriceAtTime.compareTo(BigDecimal.ZERO) > 0
                ? salePriceAtTime : priceAtTime;
    }

    public boolean isInStock() {
        return availableStock != null && availableStock >= quantity;
    }
}
