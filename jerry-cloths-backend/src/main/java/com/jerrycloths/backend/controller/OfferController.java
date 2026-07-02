package com.jerrycloths.backend.controller;

import com.jerrycloths.backend.model.Offer;
import com.jerrycloths.backend.repository.OfferRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/offers")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001" })
public class OfferController {

    @Autowired
    private OfferRepository offerRepository;

    // Admin: all offers
    @GetMapping
    public List<Offer> getAll() {
        return offerRepository.findAllByOrderByCreatedAtDesc();
    }

    // Storefront popup: currently active offer based on date range
    @GetMapping("/active")
    public ResponseEntity<?> getActive() {
        List<Offer> active = offerRepository.findCurrentlyActive(LocalDateTime.now());
        if (active.isEmpty())
            return ResponseEntity.noContent().build();
        return ResponseEntity.ok(active.get(0));
    }

    @PostMapping
    public Offer create(@RequestBody Offer offer) {
        offer.setIsActive(false);
        return offerRepository.save(offer);
    }

    @PutMapping("/{id}")
    public Offer update(@PathVariable Long id, @RequestBody Offer payload) {
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offer not found"));
        offer.setTitle(payload.getTitle());
        offer.setImageUrl(payload.getImageUrl());
        offer.setStartDate(payload.getStartDate());
        offer.setEndDate(payload.getEndDate());
        return offerRepository.save(offer);
    }

    // The "Display" button — toggles isActive on/off
    @PutMapping("/{id}/toggle")
    public Offer toggle(@PathVariable Long id) {
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offer not found"));
        offer.setIsActive(!Boolean.TRUE.equals(offer.getIsActive()));
        return offerRepository.save(offer);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        offerRepository.deleteById(id);
    }
}