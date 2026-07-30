package com.nexcart.service;

import com.nexcart.model.*;
import com.nexcart.repository.CartRepository;
import com.nexcart.repository.OrderRepository;
import com.nexcart.repository.ProductRepository;
import com.nexcart.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Service
public class OrderServiceImpl implements OrderService{

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public OrderServiceImpl(UserRepository userRepository, CartRepository cartRepository, ProductRepository productRepository, OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }


    @Override
    @Transactional
    public com.nexcart.dto.OrderDTO checkout(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUser_UserId(user.getUserId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cart.getCartItems().isEmpty()) {
            throw new RuntimeException("Cannot checkout an empty cart!");
        }


        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setOrderStatus("PLACED");
        order.setOrderTotal(cart.getTotalPrice());

        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : cart.getCartItems()) {
            Product product = cartItem.getProduct();


            // Last minute stock check
            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Not enough stock for " + product.getProductName());
            }

            // Deduct the items from the inventory
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);


            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setItemPrice(cartItem.getPrice()); // Lock in the price they paid

            orderItems.add(orderItem);
        }


        order.setOrderItems(orderItems);
        Order savedOrder = orderRepository.save(order);

        cart.getCartItems().clear();
        cart.setTotalPrice(java.math.BigDecimal.ZERO);
        cartRepository.save(cart);


        return mapToDTO(savedOrder);
    }

    @Override
    public List<com.nexcart.dto.OrderDTO> getUserOrders(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Order> rawOrders = orderRepository.findByUser_UserId(user.getUserId());
        
        return rawOrders.stream().map(this::mapToDTO).toList();
    }





    // Helper Method: Translates raw database Order into a clean DTO
    private com.nexcart.dto.OrderDTO mapToDTO(Order order) {
        List<com.nexcart.dto.OrderItemDTO> itemDTOs = order.getOrderItems().stream()
                .map(item -> new com.nexcart.dto.OrderItemDTO(
                        item.getProduct().getProductId(),
                        item.getProduct().getProductName(),
                        item.getQuantity(),
                        item.getItemPrice()
                ))
                .toList();

        return new com.nexcart.dto.OrderDTO(
                order.getOrderId(),
                order.getOrderDate(),
                order.getOrderTotal(),
                order.getOrderStatus(),
                itemDTOs
        );
    }




    @Override
    public List<com.nexcart.dto.AdminSalesDTO> getAdminSalesDashboard() {
       // NO NEED TO TRANSLATE METHOD HERE BECAUSE OF THE CUSTOM @QUERY
        return orderRepository.getAdminSalesDashboard();
    }


}
