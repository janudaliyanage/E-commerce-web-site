package com.jerrycloths.backend.controller;

import com.jerrycloths.backend.model.NavCategoryImage;
import com.jerrycloths.backend.repository.NavCategoryImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nav-images")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001" })
public class NavCategoryImageController {

    @Autowired
    private NavCategoryImageRepository navCategoryImageRepository;

    @GetMapping
    public List<NavCategoryImage> getAll() {
        return navCategoryImageRepository.findAll();
    }

    // Upsert: creates the row if this category has never been set before,
    // otherwise updates the existing one. Category is the natural key
    // (e.g. "FOR HIM"), so the admin panel never needs to know a numeric id.
    @PutMapping("/{category}")
    public NavCategoryImage upsert(@PathVariable String category, @RequestBody NavCategoryImage payload) {
        NavCategoryImage entity = navCategoryImageRepository.findByCategory(category)
                .orElseGet(NavCategoryImage::new);
        entity.setCategory(category);
        entity.setImageUrl(payload.getImageUrl());
        entity.setCaption(payload.getCaption());
        return navCategoryImageRepository.save(entity);
    }
}