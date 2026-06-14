package com.jerrycloths.backend.repository;

import com.jerrycloths.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(String category);

    List<Product> findByCategoryAndSubcategory(String category, String subcategory);

    List<Product> findByIsNewArrivalTrue();

    List<Product> findBySubcategory(String subcategory);
}