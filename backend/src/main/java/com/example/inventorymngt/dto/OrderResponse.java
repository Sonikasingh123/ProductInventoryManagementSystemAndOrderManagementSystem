package com.example.inventorymngt.dto;

import com.example.inventorymngt.entity.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record OrderResponse(
        Long id,
        OrderStatus status,
        Long userId,
        Long productId,
        String productName,
        Integer quantity,
        BigDecimal unitPrice,
        BigDecimal totalAmount,
        LocalDateTime createdAt
) {
}
