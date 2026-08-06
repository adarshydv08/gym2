package com.gymmanagement.controller;

import com.gymmanagement.dto.ApiResponse;
import com.gymmanagement.entity.GymClass;
import com.gymmanagement.entity.WorkoutPlan;
import com.gymmanagement.entity.Member;
import com.gymmanagement.entity.Trainer;
import com.gymmanagement.service.GymClassService;
import com.gymmanagement.service.WorkoutService;
import com.gymmanagement.service.MemberService;
import com.gymmanagement.service.TrainerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/trainers")
@RequiredArgsConstructor
public class TrainerController {

    private final TrainerService trainerService;
    private final WorkoutService workoutService;
    private final GymClassService gymClassService;
    private final MemberService memberService;

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

    @GetMapping("/{id}/classes")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER', 'TRAINER')")
    public ResponseEntity<ApiResponse<List<GymClass>>> getTrainerClasses(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(gymClassService.getClassesByTrainerId(id)));
    }

    @GetMapping("/{id}/workouts")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER', 'TRAINER')")
    public ResponseEntity<ApiResponse<List<WorkoutPlan>>> getTrainerWorkouts(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(workoutService.getTrainerWorkouts(id)));
    }

    @GetMapping("/{id}/members")
    @PreAuthorize("hasAnyRole('OWNER','MANAGER','TRAINER')")
    public ResponseEntity<ApiResponse<List<Member>>> getMembersForTrainer(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(memberService.getMembersByTrainer(id)));
    }

    @PutMapping("/{trainerId}/classes/{classId}")
    @PreAuthorize("hasAnyRole('OWNER','MANAGER')")
    public ResponseEntity<ApiResponse<GymClass>> assignTrainerToClass(@PathVariable Long trainerId, @PathVariable Long classId) {
        return ResponseEntity.ok(ApiResponse.success("Trainer assigned to class successfully", trainerService.assignTrainerToClass(trainerId, classId)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER')")
    public ResponseEntity<ApiResponse<Trainer>> createTrainer(@RequestBody com.gymmanagement.dto.CreateTrainerRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Trainer created successfully", trainerService.createTrainer(request, userRepository, roleRepository, passwordEncoder)));
    }
}
