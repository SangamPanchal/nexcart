package com.nexcart.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "cart_items")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cartItemId;

    // Many CartItems belong to One Cart
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    // Many CartItems can feature the same Product
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private Integer quantity;
    private BigDecimal price = BigDecimal.ZERO; // Price of product * quantity


    public CartItem() {}

    public Long getCartItemId() { return cartItemId; }
    public void setCartItemId(Long cartItemId) { this.cartItemId = cartItemId; }

    public Cart getCart() { return cart; }
    public void setCart(Cart cart) { this.cart = cart; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}