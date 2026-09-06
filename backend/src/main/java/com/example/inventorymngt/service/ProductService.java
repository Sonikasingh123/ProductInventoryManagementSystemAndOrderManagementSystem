package com.example.inventorymngt.service;

import com.example.inventorymngt.entity.ProductEntitiy;
import com.example.inventorymngt.entity.ProductRepo;
import com.example.inventorymngt.exception.ProductNotFoundException;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepo productRepo;

    public ProductService(ProductRepo productRepo) {
        this.productRepo = productRepo;
    }

    public List<ProductEntitiy> getProducts() {
        return productRepo.findAll();
    }

    public ProductEntitiy getProduct(Long id) {
        return productRepo.findById(id).orElseThrow();
    }

    public ProductEntitiy addProduct(ProductEntitiy product) {
          product.setStock(0);
        return productRepo.save(product);
    }

    public ProductEntitiy updateProduct(Long id, ProductEntitiy product) {
        ProductEntitiy existing = productRepo.findById(id).orElseThrow(() -> new ProductNotFoundException("Product Not Found"));
        existing.setName(product.getName());
        existing.setDescription(product.getDescription());
        existing.setCategory(product.getCategory());
        existing.setPrice(product.getPrice());
        return productRepo.save(existing);
    }

    public void deleteProduct(Long id) {
           if (!productRepo.existsById(id)) {
        throw new IllegalArgumentException(
            "Product not found."
        );
    }
        productRepo.deleteById(id);
    }

    public ProductEntitiy adjustStock(Long id, Integer amount) {
        ProductEntitiy product = productRepo.findById(id).orElseThrow(() -> new ProductNotFoundException("Product Not Found"));
        
        int currentStock = product.getStock();

    long newStock = (long) currentStock + amount;

    if (newStock < 0) {
        throw new IllegalArgumentException(
            "Stock cannot go below zero."
        );
    }

    if (newStock > 999999) {
        throw new IllegalArgumentException(
            "Stock cannot exceed 999999."
        );
    }

    product.setStock((int) newStock);
        return productRepo.save(product);
    }
}
