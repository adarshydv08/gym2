package com.gymmanagement.controller;

import com.gymmanagement.dto.ApiResponse;
import com.gymmanagement.entity.WorkoutPlan;
import com.gymmanagement.dto.WorkoutPlanRequest;
import com.gymmanagement.service.WorkoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/workouts")
@RequiredArgsConstructor
public class WorkoutController {

    private final WorkoutService workoutService;

    @GetMapping("/member/{memberId}")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER', 'MEMBER')")
    public ResponseEntity<ApiResponse<List<WorkoutPlan>>> getMemberWorkouts(@PathVariable Long memberId) {
        return ResponseEntity.ok(ApiResponse.success(workoutService.getMemberWorkouts(memberId)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER')")
    public ResponseEntity<ApiResponse<List<WorkoutPlan>>> getAllWorkouts() {
        return ResponseEntity.ok(ApiResponse.success(workoutService.getAllWorkouts()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER')")
    public ResponseEntity<ApiResponse<WorkoutPlan>> getWorkoutById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(workoutService.getWorkoutById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER', 'TRAINER')")
    public ResponseEntity<ApiResponse<WorkoutPlan>> createWorkout(@RequestBody WorkoutPlanRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Workout plan created successfully", workoutService.createWorkout(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER', 'TRAINER')")
    public ResponseEntity<ApiResponse<WorkoutPlan>> updateWorkout(@PathVariable Long id, @RequestBody WorkoutPlanRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Workout plan updated successfully", workoutService.updateWorkout(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER', 'TRAINER')")
    public ResponseEntity<ApiResponse<Void>> deleteWorkout(@PathVariable Long id) {
        workoutService.deleteWorkout(id);
        return ResponseEntity.ok(ApiResponse.success("Workout plan deleted successfully", null));
    }
}
