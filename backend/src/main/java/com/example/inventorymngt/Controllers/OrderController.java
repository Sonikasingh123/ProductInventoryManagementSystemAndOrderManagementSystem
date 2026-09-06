package com.example.inventorymngt.Controllers;

import com.example.inventorymngt.dto.CreateOrderRequest;
import com.example.inventorymngt.dto.OrderResponse;
import com.example.inventorymngt.service.OrderService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public OrderResponse create(@Valid @RequestBody CreateOrderRequest request) {
        return orderService.createOrder(request);
    }

    @GetMapping
    public List<OrderResponse> list(
            @RequestParam Long userId
    ) {
        return orderService.getOrdersForUser(userId);
    }

    @GetMapping("/{id}")
    public OrderResponse get(
            @PathVariable Long id,
            @RequestParam Long userId
    ) {
        return orderService.getOrder(id, userId);
    }

    @PatchMapping("/{id}/cancel")
    public OrderResponse cancel(
            @PathVariable Long id,
            @RequestParam Long userId
    ) {
        return orderService.cancelOrder(id, userId);
    }
}
