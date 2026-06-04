package com.jerrycloths.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001" })
public class FileUploadController {

    private static final String UPLOAD_DIR = "uploads/";

    @PostMapping("/image")
    public UploadResponse uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

            Path filePath = Paths.get(UPLOAD_DIR + uniqueFilename);
            Files.write(filePath, file.getBytes());

            String imageUrl = "http://localhost:8080/uploads/" + uniqueFilename;

            return new UploadResponse(true, imageUrl, "File uploaded successfully");
        } catch (Exception e) {
            return new UploadResponse(false, null, "Error uploading file: " + e.getMessage());
        }
    }

    public static class UploadResponse {
        public boolean success;
        public String imageUrl;
        public String message;

        public UploadResponse(boolean success, String imageUrl, String message) {
            this.success = success;
            this.imageUrl = imageUrl;
            this.message = message;
        }
    }
}