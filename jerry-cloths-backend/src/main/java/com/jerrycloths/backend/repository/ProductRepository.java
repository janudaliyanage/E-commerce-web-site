package com.jerrycloths.backend.repository;

import com.jerrycloths.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}