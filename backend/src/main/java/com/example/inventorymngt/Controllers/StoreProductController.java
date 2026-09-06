package com.example.inventorymngt.Controllers;

import com.example.inventorymngt.dto.StoreProductResponse;
import com.example.inventorymngt.entity.ProductEntitiy;
import com.example.inventorymngt.entity.ProductRepo;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/store/products")
@CrossOrigin(origins = "*")
public class StoreProductController {

    private final ProductRepo productRepo;

    public StoreProductController(ProductRepo productRepo) {
        this.productRepo = productRepo;
    }

    @GetMapping
    public List<StoreProductResponse> list() {
        return productRepo.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public StoreProductResponse get(@PathVariable Long id) {
        ProductEntitiy product = productRepo.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Product not found."
                        )
                );

        return toResponse(product);
    }

    private StoreProductResponse toResponse(ProductEntitiy product) {
        return new StoreProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getCategory(),
                product.getPrice(),
                product.getStock() != null && product.getStock() > 0
        );
    }
}
