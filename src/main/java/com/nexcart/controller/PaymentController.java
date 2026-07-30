package com.nexcart.controller;

import com.nexcart.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-session")
    public ResponseEntity<String> createTestSession(
            @RequestParam Double amount,
            @RequestParam String description) {

        try {
            String checkoutUrl = paymentService.createCheckoutSession(amount, description);

            return ResponseEntity.ok(checkoutUrl); // this return the url back to postman

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
}