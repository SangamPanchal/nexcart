package com.nexcart.repository;

import com.nexcart.dto.AdminSalesDTO;
import com.nexcart.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser_UserId(Long userId);

    // NEW ADMIN DASHBOARD QUERY
    @Query("SELECT new com.nexcart.dto.AdminSalesDTO(u.username, p.productName, oi.quantity, o.orderDate, o.orderStatus, u.userEmail) " +
            "FROM Order o " +
            "JOIN o.user u " +
            "JOIN o.orderItems oi " +
            "JOIN oi.product p " +
            "ORDER BY o.orderDate DESC")
    List<AdminSalesDTO> getAdminSalesDashboard();

}
