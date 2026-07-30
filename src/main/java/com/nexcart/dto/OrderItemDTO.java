package com.nexcart.dto;

import java.math.BigDecimal;

public class OrderItemDTO {
    private Long productId;
    private String productName;
    private Integer quantity;
    private BigDecimal itemPrice;

    public OrderItemDTO(Long productId, String productName, Integer quantity, BigDecimal itemPrice) {
        this.productId = productId;
        this.productName = productName;
        this.quantity = quantity;
        this.itemPrice = itemPrice;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getItemPrice() {
        return itemPrice;
    }

    public void setItemPrice(BigDecimal itemPrice) {
        this.itemPrice = itemPrice;
    }
}
