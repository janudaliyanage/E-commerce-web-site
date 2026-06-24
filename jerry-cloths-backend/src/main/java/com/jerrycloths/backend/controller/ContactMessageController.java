package com.jerrycloths.backend.controller;

import com.jerrycloths.backend.model.ContactMessage;
import com.jerrycloths.backend.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001" })
public class ContactMessageController {

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @PostMapping
    public ContactMessage create(@RequestBody ContactMessage message) {
        message.setRead(false);
        return contactMessageRepository.save(message);
    }

    @GetMapping
    public List<ContactMessage> getAll() {
        return contactMessageRepository.findAllByOrderByCreatedAtDesc();
    }

    @PutMapping("/{id}/read")
    public ContactMessage markRead(@PathVariable Long id) {
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        message.setRead(true);
        return contactMessageRepository.save(message);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        contactMessageRepository.deleteById(id);
    }
}