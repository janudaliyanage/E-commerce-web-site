package com.jerrycloths.backend.controller;

import com.jerrycloths.backend.model.NewsletterCampaign;
import com.jerrycloths.backend.model.NewsletterSubscriber;
import com.jerrycloths.backend.model.Product;
import com.jerrycloths.backend.repository.NewsletterCampaignRepository;
import com.jerrycloths.backend.repository.NewsletterSubscriberRepository;
import com.jerrycloths.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/newsletter")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001" })
public class NewsletterController {

    @Autowired
    private NewsletterSubscriberRepository subscriberRepository;

    @Autowired
    private NewsletterCampaignRepository campaignRepository;

    @Autowired
    private ProductRepository productRepository;

    // --- Storefront: subscribe via the footer form ---
    @PostMapping("/subscribe")
    public Map<String, Object> subscribe(@RequestBody Map<String, String> payload) {
        String email = payload.getOrDefault("email", "").trim().toLowerCase();
        if (email.isEmpty() || !email.contains("@")) {
            return Map.of("success", false, "message", "Please enter a valid email address.");
        }
        Optional<NewsletterSubscriber> existing = subscriberRepository.findByEmail(email);
        if (existing.isPresent()) {
            return Map.of("success", true, "message", "You're already subscribed!");
        }
        NewsletterSubscriber subscriber = new NewsletterSubscriber();
        subscriber.setEmail(email);
        subscriberRepository.save(subscriber);
        return Map.of("success", true, "message", "Subscribed!");
    }

    // --- Admin: subscriber list ---
    @GetMapping("/subscribers")
    public List<NewsletterSubscriber> getSubscribers() {
        return subscriberRepository.findAll();
    }

    // --- Admin: campaign history ---
    @GetMapping("/campaigns")
    public List<NewsletterCampaign> getCampaigns() {
        return campaignRepository.findAllByOrderBySentAtDesc();
    }

    // --- Admin: compose and "send" a letter ---
    // Saves the campaign record every time. Actual email delivery requires
    // adding spring-boot-starter-mail to pom.xml and configuring SMTP
    // credentials in application.properties — until then campaigns are saved
    // with delivered=false so nothing is lost.
    @PostMapping("/send")
    public NewsletterCampaign send(@RequestBody Map<String, Object> payload) {
        String subject = String.valueOf(payload.getOrDefault("subject", "")).trim();
        String body = String.valueOf(payload.getOrDefault("body", "")).trim();
        Long productId = payload.get("productId") != null
                ? Long.valueOf(String.valueOf(payload.get("productId")))
                : null;

        List<String> emails = subscriberRepository.findAll().stream()
                .map(NewsletterSubscriber::getEmail)
                .collect(Collectors.toList());

        // Optionally append a featured product blurb
        String finalBody = body;
        if (productId != null) {
            Optional<Product> product = productRepository.findById(productId);
            if (product.isPresent()) {
                Product p = product.get();
                finalBody += "\n\n---\nFeaturing: " + p.getName()
                        + " — $" + p.getPrice()
                        + "\nhttp://localhost:3000/products/" + p.getId();
            }
        }

        NewsletterCampaign campaign = new NewsletterCampaign();
        campaign.setSubject(subject);
        campaign.setBody(finalBody);
        campaign.setProductId(productId);
        campaign.setRecipientCount(emails.size());
        campaign.setDelivered(false);
        campaign.setFailureReason(
                "Email sending not yet configured. To enable it: " +
                        "add spring-boot-starter-mail to pom.xml, then set " +
                        "spring.mail.host / spring.mail.username / spring.mail.password " +
                        "in application.properties.");

        return campaignRepository.save(campaign);
    }
}