package com.nexcart.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;
    @Column(nullable = false)
    private LocalDateTime orderDate;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @Column(nullable = false)
    private BigDecimal orderTotal;
    @Column(nullable = false)
    private String orderStatus;
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true )
    private List<OrderItem> orderItems = new ArrayList<>();

    public Order() {
    }


    public Order(Long orderId, LocalDateTime orderDate, User user, BigDecimal orderTotal, String orderStatus, List<OrderItem> orderItems) {
        this.orderId = orderId;
        this.orderDate = orderDate;
        this.user = user;
        this.orderTotal = orderTotal;
        this.orderStatus = orderStatus;
        this.orderItems = orderItems;
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    @Override
    public String toString() {
        return "Order{" +
                "orderId=" + orderId +
                ", orderDate=" + orderDate +
                ", orderTotal=" + orderTotal +
                ", orderStatus='" + orderStatus + '\'' +
                ", orderItems=" + orderItems +
                '}';
    }
}
