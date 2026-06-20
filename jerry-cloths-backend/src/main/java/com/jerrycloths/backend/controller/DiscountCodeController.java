package com.jerrycloths.backend.controller;

import com.jerrycloths.backend.model.DiscountCode;
import com.jerrycloths.backend.repository.DiscountCodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/discount-codes")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001" })
public class DiscountCodeController {

    @Autowired
    private DiscountCodeRepository discountCodeRepository;

    @PostMapping("/generate")
    public DiscountCode generate(@RequestBody Map<String, Object> body) {
        DiscountCode dc = new DiscountCode();
        dc.setCode("REVIEW" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        dc.setPercentOff(15);
        dc.setReason("review_with_photo");
        if (body.get("userId") != null) {
            dc.setUserId(Long.valueOf(body.get("userId").toString()));
        }
        return discountCodeRepository.save(dc);
    }

    @GetMapping("/validate/{code}")
    public Map<String, Object> validate(@PathVariable String code) {
        Optional<DiscountCode> found = discountCodeRepository.findByCode(code);
        if (found.isEmpty()) {
            return Map.of("valid", false, "message", "Invalid code");
        }
        DiscountCode dc = found.get();
        if (dc.getUsed()) {
            return Map.of("valid", false, "message", "Code already used");
        }
        if (dc.getExpiresAt().isBefore(java.time.LocalDateTime.now())) {
            return Map.of("valid", false, "message", "Code expired");
        }
        return Map.of("valid", true, "percentOff", dc.getPercentOff());
    }
}