package com.example.inventorymngt.dto;

import java.math.BigDecimal;

import com.example.inventorymngt.entity.ProductCategory;

public record StoreProductResponse(
        Long id,
        String name,
        String description,
        ProductCategory category,
        BigDecimal price,
        boolean inStock
) {
}
