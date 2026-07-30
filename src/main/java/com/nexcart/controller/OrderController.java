package com.nexcart.controller;

import com.nexcart.dto.OrderDTO;
import com.nexcart.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<OrderDTO> checkout(Principal principal) {
        OrderDTO finalizedOrder = orderService.checkout(principal.getName());
        return ResponseEntity.ok(finalizedOrder);
    }

    @GetMapping
    public ResponseEntity<List<OrderDTO>> getMyOrders(Principal principal) {
        List<OrderDTO> myOrders = orderService.getUserOrders(principal.getName());
        return ResponseEntity.ok(myOrders);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleCheckoutErrors(RuntimeException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
}