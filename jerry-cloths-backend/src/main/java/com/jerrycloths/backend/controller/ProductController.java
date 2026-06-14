package com.jerrycloths.backend.controller;

import com.jerrycloths.backend.model.Product;
import com.jerrycloths.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001" })
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productRepository.findById(id).orElse(null);
    }

    @GetMapping("/category/{category}")
    public List<Product> getByCategory(@PathVariable String category) {
        return productRepository.findByCategory(category);
    }

    @GetMapping("/category/{category}/sub/{subcategory}")
    public List<Product> getByCategoryAndSub(@PathVariable String category, @PathVariable String subcategory) {
        return productRepository.findByCategoryAndSubcategory(category, subcategory);
    }

    @GetMapping("/new-arrivals")
    public List<Product> getNewArrivals() {
        return productRepository.findByIsNewArrivalTrue();
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product product) {
        product.setId(id);
        return productRepository.save(product);
    }

    @PatchMapping("/{id}/new-arrival")
    public Product toggleNewArrival(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        Product product = productRepository.findById(id).orElseThrow();
        product.setIsNewArrival(body.get("isNewArrival"));
        return productRepository.save(product);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
    }
}