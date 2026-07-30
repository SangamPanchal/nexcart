package com.nexcart.controller;

import com.nexcart.model.Cart;
import com.nexcart.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // fetch current user shopping cart
    @GetMapping
    public ResponseEntity<Cart> getCart(Principal principal){
        Cart cart = cartService.getCartForUser(principal.getName());
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/add")
    public ResponseEntity<Cart> addProductToCart(
            Principal principal, @RequestParam Long productId, @RequestParam Integer quantity){
        Cart updatedCart = cartService.addProductToCart(principal.getName(), productId, quantity);
        return ResponseEntity.ok(updatedCart);
    }


    @DeleteMapping("/remove")
    public ResponseEntity<Cart> removeProductFromCart(
            Principal principal,
            @RequestParam Long productId) {

        Cart updatedCart = cartService.removeProductFromCart(principal.getName(), productId);
        return ResponseEntity.ok(updatedCart);
    }



    @PutMapping("/update")
    public ResponseEntity<Cart> updateProductQuantity(
            Principal principal,
            @RequestParam Long productId,
            @RequestParam Integer quantity) {

        Cart updatedCart = cartService.updateProductQuantity(principal.getName(), productId, quantity);
        return ResponseEntity.ok(updatedCart);
    }



    @org.springframework.web.bind.annotation.ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleInvalidInput(IllegalArgumentException ex) {
        // This catches the exception and returns a clean 400 Bad Request
        // along with your custom message ("Quantity must be greater than zero!")
        return ResponseEntity.badRequest().body(ex.getMessage());
    }


}
