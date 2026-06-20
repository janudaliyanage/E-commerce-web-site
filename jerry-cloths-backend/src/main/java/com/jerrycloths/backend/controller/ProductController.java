package com.jerrycloths.backend.controller;

import com.jerrycloths.backend.model.Product;
import com.jerrycloths.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

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

    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam String q) {
        if (q == null || q.trim().isEmpty())
            return productRepository.findAll();
        String query = q.trim();

        // 1. Try exact/partial match first (fast path)
        List<Product> exactResults = productRepository.searchProducts(query);
        if (!exactResults.isEmpty()) {
            return exactResults;
        }

        // 2. No exact matches -> fall back to fuzzy matching (typo tolerance)
        return fuzzySearch(query);
    }

    /**
     * Fuzzy search using Levenshtein distance.
     * Compares the query against each word in product
     * name/category/subcategory/description.
     * Returns products whose best-matching word is within an acceptable
     * edit-distance threshold.
     */
    private List<Product> fuzzySearch(String query) {
        List<Product> allProducts = productRepository.findAll();
        String normalizedQuery = query.toLowerCase();

        // Allow more typo tolerance for longer words
        int maxDistance = normalizedQuery.length() <= 4 ? 1 : (normalizedQuery.length() <= 7 ? 2 : 3);

        List<ScoredProduct> scored = new ArrayList<>();

        for (Product p : allProducts) {
            int bestDistance = Integer.MAX_VALUE;

            bestDistance = Math.min(bestDistance, bestWordDistance(normalizedQuery, p.getName()));
            bestDistance = Math.min(bestDistance, bestWordDistance(normalizedQuery, p.getCategory()));
            bestDistance = Math.min(bestDistance, bestWordDistance(normalizedQuery, p.getSubcategory()));
            bestDistance = Math.min(bestDistance, bestWordDistance(normalizedQuery, stripHtml(p.getDescription())));

            if (bestDistance <= maxDistance) {
                scored.add(new ScoredProduct(p, bestDistance));
            }
        }

        // Sort by closest match first
        scored.sort(Comparator.comparingInt(s -> s.distance));

        return scored.stream().map(s -> s.product).collect(Collectors.toList());
    }

    /**
     * Finds the smallest Levenshtein distance between the query and any word in the
     * given text.
     */
    private int bestWordDistance(String query, String text) {
        if (text == null || text.isEmpty())
            return Integer.MAX_VALUE;
        String[] words = text.toLowerCase().split("[^a-z0-9]+");
        int best = Integer.MAX_VALUE;
        for (String word : words) {
            if (word.isEmpty())
                continue;
            int dist = levenshtein(query, word);
            if (dist < best)
                best = dist;
        }
        return best;
    }

    private String stripHtml(String html) {
        if (html == null)
            return "";
        return html.replaceAll("<[^>]*>", " ");
    }

    /** Classic Levenshtein edit-distance algorithm. */
    private int levenshtein(String a, String b) {
        int[][] dp = new int[a.length() + 1][b.length() + 1];
        for (int i = 0; i <= a.length(); i++)
            dp[i][0] = i;
        for (int j = 0; j <= b.length(); j++)
            dp[0][j] = j;

        for (int i = 1; i <= a.length(); i++) {
            for (int j = 1; j <= b.length(); j++) {
                int cost = a.charAt(i - 1) == b.charAt(j - 1) ? 0 : 1;
                dp[i][j] = Math.min(
                        Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1),
                        dp[i - 1][j - 1] + cost);
            }
        }
        return dp[a.length()][b.length()];
    }

    private static class ScoredProduct {
        Product product;
        int distance;

        ScoredProduct(Product product, int distance) {
            this.product = product;
            this.distance = distance;
        }
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