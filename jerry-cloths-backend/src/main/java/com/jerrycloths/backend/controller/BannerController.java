package com.jerrycloths.backend.controller;

import com.jerrycloths.backend.model.Banner;
import com.jerrycloths.backend.repository.BannerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/banners")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001" })
public class BannerController {

    @Autowired
    private BannerRepository bannerRepository;

    @GetMapping
    public List<Banner> getAllBanners() {
        return bannerRepository.findAllByOrderByDisplayOrderAsc();
    }

    @PostMapping
    public Banner createBanner(@RequestBody Banner banner) {
        if (banner.getDisplayOrder() == null) {
            banner.setDisplayOrder((int) bannerRepository.count());
        }
        return bannerRepository.save(banner);
    }

    @PutMapping("/{id}")
    public Banner updateBanner(@PathVariable Long id, @RequestBody Banner banner) {
        banner.setId(id);
        return bannerRepository.save(banner);
    }

    @DeleteMapping("/{id}")
    public void deleteBanner(@PathVariable Long id) {
        bannerRepository.deleteById(id);
    }
}