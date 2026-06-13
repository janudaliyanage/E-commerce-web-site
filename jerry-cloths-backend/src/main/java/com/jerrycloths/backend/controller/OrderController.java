package com.jerrycloths.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jerrycloths.backend.model.Order;
import com.jerrycloths.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001" })
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUser(@PathVariable Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @PostMapping
    public Order createOrder(@RequestBody Map<String, Object> body) {
        try {
            Order order = new Order();
            order.setUserId(body.get("userId") != null ? Long.valueOf(body.get("userId").toString()) : null);
            order.setEmail(body.get("email") != null ? body.get("email").toString() : null);
            order.setShippingAddress(
                    body.get("shippingAddress") != null ? body.get("shippingAddress").toString() : null);
            order.setTotal(body.get("total") != null ? Double.valueOf(body.get("total").toString()) : 0.0);
            order.setStatus("pending");
            ObjectMapper mapper = new ObjectMapper();
            order.setItems(mapper.writeValueAsString(body.get("items")));
            return orderRepository.save(order);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create order: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    public Order updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Order order = orderRepository.findById(id).orElseThrow();
        order.setStatus(body.get("status"));
        return orderRepository.save(order);
    }
}