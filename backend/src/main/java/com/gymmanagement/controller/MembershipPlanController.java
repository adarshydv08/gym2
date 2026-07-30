package com.gymmanagement.controller;

import com.gymmanagement.dto.ApiResponse;
import com.gymmanagement.entity.MembershipPlan;
import com.gymmanagement.repository.MembershipPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/membership-plans")
@RequiredArgsConstructor
public class MembershipPlanController {

    private final MembershipPlanRepository membershipPlanRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<MembershipPlan>>> getAllPlans() {
        return ResponseEntity.ok(ApiResponse.success(membershipPlanRepository.findByIsActiveTrue()));
    }
}
