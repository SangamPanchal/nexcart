package com.nexcart.dto;

import java.time.LocalDateTime;

public class AdminSalesDTO {
    private String username;
    private String productName;
    private Integer quantity;
    private LocalDateTime orderDate;
    private String orderStatus;
    private String userEmail;



    public AdminSalesDTO(String username, String productName, Integer quantity, LocalDateTime orderDate, String orderStatus,String userEmail) {
        this.username = username;
        this.productName = productName;
        this.quantity = quantity;
        this.orderDate = orderDate;
        this.orderStatus = orderStatus;
        this.userEmail = userEmail;
    }


    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public String getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }
}
