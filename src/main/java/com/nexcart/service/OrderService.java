package com.nexcart.service;

import com.nexcart.dto.OrderDTO;

import java.util.List;

public interface OrderService {
    OrderDTO checkout(String username);

    List<OrderDTO> getUserOrders(String username);


    // For Admin Dashboard
    List<com.nexcart.dto.AdminSalesDTO> getAdminSalesDashboard();



}
