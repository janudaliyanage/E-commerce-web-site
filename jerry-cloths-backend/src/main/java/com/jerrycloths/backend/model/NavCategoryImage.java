package com.jerrycloths.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "nav_category_images")
public class NavCategoryImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Matches the nav label exactly, e.g. "FOR HIM", "FOR HER", "NEW DROP",
    // "COLLABS"
    @Column(unique = true, nullable = false, length = 100)
    private String category;

    @Column(length = 1000)
    private String imageUrl;

    @Column(length = 200)
    private String caption;

    public NavCategoryImage() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getCaption() {
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }
}