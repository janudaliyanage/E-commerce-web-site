package com.jerrycloths.backend.controller;

import com.jerrycloths.backend.model.User;
import com.jerrycloths.backend.repository.UserRepository;
import com.jerrycloths.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001" })
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        try {
            if (userRepository.existsByEmail(request.getEmail())) {
                return new AuthResponse(false, null, null, "Email already registered");
            }

            if (request.getEmail() == null || request.getPassword() == null ||
                    request.getFirstName() == null || request.getLastName() == null) {
                return new AuthResponse(false, null, null, "Missing required fields");
            }

            User user = new User();
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setPhone(request.getPhone() != null ? request.getPhone() : "");
            user.setAddress(request.getAddress() != null ? request.getAddress() : "");
            user.setCity(request.getCity() != null ? request.getCity() : "");
            user.setZipCode(request.getZipCode() != null ? request.getZipCode() : "");

            User savedUser = userRepository.save(user);
            String token = jwtUtil.generateToken(savedUser.getId(), savedUser.getEmail());

            return new AuthResponse(true, token, savedUser.getId(), "Registration successful");
        } catch (Exception e) {
            return new AuthResponse(false, null, null, "Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        try {
            Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

            if (userOpt.isEmpty()) {
                return new AuthResponse(false, null, null, "Email not found");
            }

            User user = userOpt.get();

            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return new AuthResponse(false, null, null, "Invalid password");
            }

            String token = jwtUtil.generateToken(user.getId(), user.getEmail());

            return new AuthResponse(true, token, user.getId(), "Login successful");
        } catch (Exception e) {
            return new AuthResponse(false, null, null, "Login failed: " + e.getMessage());
        }
    }

    public static class AuthResponse {
        public boolean success;
        public String token;
        public Long userId;
        public String message;

        public AuthResponse(boolean success, String token, Long userId, String message) {
            this.success = success;
            this.token = token;
            this.userId = userId;
            this.message = message;
        }
    }

    public static class RegisterRequest {
        public String email;
        public String password;
        public String firstName;
        public String lastName;
        public String phone;
        public String address;
        public String city;
        public String zipCode;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public String getCity() {
            return city;
        }

        public void setCity(String city) {
            this.city = city;
        }

        public String getZipCode() {
            return zipCode;
        }

        public void setZipCode(String zipCode) {
            this.zipCode = zipCode;
        }
    }

    public static class LoginRequest {
        public String email;
        public String password;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}