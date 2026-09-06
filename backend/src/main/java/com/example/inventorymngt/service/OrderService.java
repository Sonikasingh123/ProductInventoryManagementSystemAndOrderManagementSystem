package com.example.inventorymngt.service;

import com.example.inventorymngt.dto.CreateOrderRequest;
import com.example.inventorymngt.dto.OrderResponse;
import com.example.inventorymngt.entity.OrderEntity;
import com.example.inventorymngt.entity.OrderRepo;
import com.example.inventorymngt.entity.OrderStatus;
import com.example.inventorymngt.entity.ProductEntitiy;
import com.example.inventorymngt.entity.ProductRepo;


import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepo orderRepo;
    private final ProductRepo productRepo;

    public OrderService(
            OrderRepo orderRepo,
            ProductRepo productRepo
    ) {
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
    }

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {

        if (request.userId() == null) {
            throw new IllegalArgumentException("User ID is required.");
        }

        if (request.productId() == null) {
            throw new IllegalArgumentException("Product ID is required.");
        }

        if (request.quantity() == null ||
                request.quantity() < 1 ||
                request.quantity() > 999) {
            throw new IllegalArgumentException(
                    "Quantity must be between 1 and 999."
            );
        }

       
        ProductEntitiy product = productRepo
                .findByIdForUpdate(request.productId())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Product not found."
                        )
                );

        int stock = product.getStock() == null
                ? 0
                : product.getStock();

        if (stock < request.quantity()) {
            throw new IllegalArgumentException(
                    "Insufficient stock."
            );
        }

        BigDecimal unitPrice = product.getPrice();

        BigDecimal totalAmount = unitPrice.multiply(
                BigDecimal.valueOf(request.quantity())
        );

        product.setStock(stock - request.quantity());

        productRepo.save(product);

        OrderEntity order = new OrderEntity();

        order.setStatus(OrderStatus.CREATED);
        order.setUserId(request.userId());
        order.setProductId(product.getId());
        order.setProductName(product.getName());
        order.setQuantity(request.quantity());
        order.setUnitPrice(unitPrice);
        order.setTotalAmount(totalAmount);

        OrderEntity saved = orderRepo.save(order);

        return toResponse(saved);
    }

    public List<OrderResponse> getOrdersForUser(Long userId) {
        return orderRepo
                .findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public OrderResponse getOrder(Long id, Long userId) {

        OrderEntity order = orderRepo.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Order not found."
                        )
                );

        if (!order.getUserId().equals(userId)) {
            throw new IllegalArgumentException(
                    "Order not found."
            );
        }

        return toResponse(order);
    }

    @Transactional
    public OrderResponse cancelOrder(Long id, Long userId) {

        OrderEntity order = orderRepo.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Order not found."
                        )
                );

        if (!order.getUserId().equals(userId)) {
            throw new IllegalArgumentException(
                    "Order not found."
            );
        }

        if (order.getStatus() != OrderStatus.CREATED) {
            throw new IllegalArgumentException(
                    "Only CREATED orders can be cancelled."
            );
        }

        ProductEntitiy product = productRepo
                .findById(order.getProductId())
                .orElse(null);

        /*
         * The product may have been deleted after the order.
         * The order itself remains intact.
         *
         * If it still exists, restore the inventory.
         */
        if (product != null) {

            int currentStock = product.getStock() == null
                    ? 0
                    : product.getStock();

            long restoredStock =
                    (long) currentStock + order.getQuantity();

            if (restoredStock > 999_999) {
                throw new IllegalStateException(
                        "Restored stock exceeds the maximum allowed stock."
                );
            }

            product.setStock((int) restoredStock);
            productRepo.save(product);
        }

        order.setStatus(OrderStatus.CANCELLED);

        return toResponse(orderRepo.save(order));
    }

    private OrderResponse toResponse(OrderEntity order) {
        return new OrderResponse(
                order.getId(),
                order.getStatus(),
                order.getUserId(),
                order.getProductId(),
                order.getProductName(),
                order.getQuantity(),
                order.getUnitPrice(),
                order.getTotalAmount(),
                order.getCreatedAt()
        );
    }
}
