package com.gymmanagement.controller;

import com.gymmanagement.dto.ApiResponse;
import com.gymmanagement.entity.WorkoutPlan;
import com.gymmanagement.repository.WorkoutPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/workouts")
@RequiredArgsConstructor
public class WorkoutController {

    private final WorkoutPlanRepository workoutPlanRepository;

    @GetMapping("/member/{memberId}")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER', 'MEMBER')")
    public ResponseEntity<ApiResponse<List<WorkoutPlan>>> getMemberWorkouts(@PathVariable Long memberId) {
        return ResponseEntity.ok(ApiResponse.success(workoutPlanRepository.findByMemberId(memberId)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER')")
    public ResponseEntity<ApiResponse<List<WorkoutPlan>>> getAllWorkouts() {
        return ResponseEntity.ok(ApiResponse.success(workoutPlanRepository.findAll()));
    }
}
