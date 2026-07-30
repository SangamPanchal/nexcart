package com.nexcart.service;

import com.nexcart.model.Cart;
import com.nexcart.model.CartItem;
import com.nexcart.model.Product;
import com.nexcart.model.User;
import com.nexcart.repository.CartItemRepository;
import com.nexcart.repository.CartRepository;
import com.nexcart.repository.ProductRepository;
import com.nexcart.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CartServiceImpl implements CartService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    public CartServiceImpl(UserRepository userRepository, ProductRepository productRepository, CartRepository cartRepository, CartItemRepository cartItemRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
    }

    @Override
    public Cart getCartForUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return cartRepository.findByUser_UserId(user.getUserId())
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
    }

    @Override
    public Cart addProductToCart(String username, Long productId, Integer quantity) {

        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero!");
        }

        Cart cart = getCartForUser(username);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<CartItem> existingItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getProductId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + quantity;

            // --- THE MISSING SECURITY CHECK ---
            if (newQuantity > product.getStockQuantity()) {
                throw new IllegalArgumentException("Not enough stock available. Only " + product.getStockQuantity() + " left in stock.");
            }

            item.setQuantity(newQuantity);
            item.setPrice(product.getProductPrice().multiply(java.math.BigDecimal.valueOf(item.getQuantity())));
        } else {
            // --- THE MISSING SECURITY CHECK ---
            if (quantity > product.getStockQuantity()) {
                throw new IllegalArgumentException("Not enough stock available. Only " + product.getStockQuantity() + " left in stock.");
            }

            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            newItem.setPrice(product.getProductPrice().multiply(java.math.BigDecimal.valueOf(quantity)));

            cart.getCartItems().add(newItem);
        }

        java.math.BigDecimal total = cart.getCartItems().stream()
                .map(CartItem::getPrice)
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);

        cart.setTotalPrice(total);

        return cartRepository.save(cart);
    }

    @Override
    public Cart removeProductFromCart(String username, Long productId) {
        Cart cart = getCartForUser(username);

        Optional<CartItem> itemToRemove = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getProductId().equals(productId))
                .findFirst();

        if (itemToRemove.isPresent()) {
            CartItem item = itemToRemove.get();
            cart.getCartItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            throw new RuntimeException("Product is not in the cart");
        }

        java.math.BigDecimal total = cart.getCartItems().stream()
                .map(CartItem::getPrice)
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);

        cart.setTotalPrice(total);

        return cartRepository.save(cart);
    }

    @Override
    public Cart updateProductQuantity(String username, Long productId, Integer quantity) {
        if (quantity <= 0) {
            return removeProductFromCart(username, productId);
        }

        Cart cart = getCartForUser(username);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // --- THE MISSING SECURITY CHECK ---
        if (quantity > product.getStockQuantity()) {
            throw new IllegalArgumentException("Not enough stock available. Only " + product.getStockQuantity() + " left in stock.");
        }

        Optional<CartItem> existingItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getProductId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(quantity);
            item.setPrice(product.getProductPrice().multiply(java.math.BigDecimal.valueOf(quantity)));
        } else {
            throw new RuntimeException("Product is not in the cart");
        }

        java.math.BigDecimal total = cart.getCartItems().stream()
                .map(CartItem::getPrice)
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);

        cart.setTotalPrice(total);

        return cartRepository.save(cart);
    }
}