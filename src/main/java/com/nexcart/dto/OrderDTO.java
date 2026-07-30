package com.nexcart.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderDTO {
    private Long orderId;
    private LocalDateTime orderDate;
    private BigDecimal orderTotal;
    private String orderStatus;
    private List<OrderItemDTO> items;

    public OrderDTO(Long orderId, LocalDateTime orderDate, BigDecimal orderTotal, String orderStatus, List<OrderItemDTO> items) {
        this.orderId = orderId;
        this.orderDate = orderDate;
        this.orderTotal = orderTotal;
        this.orderStatus = orderStatus;
        this.items = items;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public BigDecimal getOrderTotal() {
        return orderTotal;
    }

    public void setOrderTotal(BigDecimal orderTotal) {
        this.orderTotal = orderTotal;
    }

    public String getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }

    public List<OrderItemDTO> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDTO> items) {
        this.items = items;
    }
}
