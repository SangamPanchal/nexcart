package com.nexcart.controller;

import com.nexcart.dto.AdminSalesDTO;
import com.nexcart.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final OrderService orderService;

    public AdminController(OrderService orderService) {
        this.orderService = orderService;
    }

    // GET: Retrieve the global sales dashboard
    @GetMapping("/sales")
    public ResponseEntity<List<AdminSalesDTO>> getSalesDashboard() {
        List<AdminSalesDTO> salesData = orderService.getAdminSalesDashboard();
        return ResponseEntity.ok(salesData);
    }
}