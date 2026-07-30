package com.nexcart.service;

import com.nexcart.model.Cart;

public interface CartService {
    Cart getCartForUser(String username);

    Cart addProductToCart(String username, Long productId, Integer quantity);

    Cart removeProductFromCart(String username, Long productId);

    Cart updateProductQuantity(String username, Long productId, Integer quantity);

}
