package com.gymmanagement.controller;

import com.gymmanagement.dto.ApiResponse;
import com.gymmanagement.entity.Trainer;
import com.gymmanagement.service.TrainerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/trainers")
@RequiredArgsConstructor
public class TrainerController {

    private final TrainerService trainerService;

    private final com.gymmanagement.repository.UserRepository userRepository;
    private final com.gymmanagement.repository.RoleRepository roleRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Trainer>>> getAllTrainers() {
        return ResponseEntity.ok(ApiResponse.success(trainerService.getAllTrainers()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Trainer>> getTrainerById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(trainerService.getTrainerById(id)));
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('OWNER', 'MANAGER')")
    public ResponseEntity<ApiResponse<Trainer>> createTrainer(@RequestBody com.gymmanagement.dto.CreateTrainerRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Trainer created successfully", trainerService.createTrainer(request, userRepository, roleRepository, passwordEncoder)));
    }
}
