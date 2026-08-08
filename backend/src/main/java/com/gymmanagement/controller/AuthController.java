package com.gymmanagement.controller;

import com.gymmanagement.dto.ApiResponse;
import com.gymmanagement.dto.AuthRequest;
import com.gymmanagement.dto.AuthResponse;
import com.gymmanagement.dto.RegisterRequest;
import com.gymmanagement.entity.User;
import com.gymmanagement.repository.UserRepository;
import com.gymmanagement.security.UserPrincipal;
import com.gymmanagement.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.success("Registration successful", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse>> me() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal() == null) {
            return ResponseEntity.status(401).body(ApiResponse.failure("Unauthorized", null));
        }

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(ApiResponse.success("User session restored", authService.buildAuthResponse(user)));
    }
}
