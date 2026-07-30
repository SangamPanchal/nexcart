package com.nexcart.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
@Entity
@Table(name = "products")
public class Product{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;
    @Column(nullable = false)
    private String productName;
    @Column(length = 1000)
    private String productDescription;
    @Column(nullable = false)
    private BigDecimal productPrice;
    @Column(nullable = false)
    private Integer stockQuantity;

    private String productCategory;

    public Product(Long productId, String productName, String productDescription, BigDecimal productPrice, Integer stockQuantity, String productCategory) {
        this.productId = productId;
        this.productName = productName;
        this.productDescription = productDescription;
        this.productPrice = productPrice;
        this.stockQuantity = stockQuantity;
        this.productCategory = productCategory;
    }

    public Product() {
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

    public String getProductDescription() {
        return productDescription;
    }

    public void setProductDescription(String productDescription) {
        this.productDescription = productDescription;
    }

    public BigDecimal getProductPrice() {
        return productPrice;
    }

    public void setProductPrice(BigDecimal productPrice) {
        this.productPrice = productPrice;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public String getProductCategory() {
        return productCategory;
    }

    public void setProductCategory(String productCategory) {
        this.productCategory = productCategory;
    }

    @Override
    public String toString() {
        return "Product{" +
                "productId=" + productId +
                ", productName='" + productName + '\'' +
                ", productDescription='" + productDescription + '\'' +
                ", productPrice=" + productPrice +
                ", stockQuantity=" + stockQuantity +
                ", productCategory='" + productCategory + '\'' +
                '}';
    }
}
