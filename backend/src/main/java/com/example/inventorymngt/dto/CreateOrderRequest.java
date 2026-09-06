package com.example.inventorymngt.dto;


import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

public record CreateOrderRequest(
        @NotNull 
        Long userId,
        @NotNull
        Long productId,
         @NotNull
        @Min(1)
        @Max(999)
        Integer quantity
) {
}
