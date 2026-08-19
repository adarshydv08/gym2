package com.gymmanagement.controller;

import com.gymmanagement.dto.ApiResponse;
import com.gymmanagement.dto.MembershipPlanRequest;
import com.gymmanagement.entity.MembershipPlan;
import com.gymmanagement.repository.MembershipPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<MembershipPlan>> updatePlan(
            @PathVariable Long id,
            @RequestBody MembershipPlanRequest request) {
        MembershipPlan plan = membershipPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Membership plan not found with id: " + id));
        plan.setTitle(request.getTitle());
        plan.setDescription(request.getDescription());
        plan.setDurationMonths(request.getDurationMonths());
        plan.setPriceInr(request.getPriceInr());
        plan.setBenefits(request.getBenefits());
        plan.setIsPopular(request.getIsPopular() != null ? request.getIsPopular() : plan.getIsPopular());
        plan.setIsActive(request.getIsActive() != null ? request.getIsActive() : plan.getIsActive());
        return ResponseEntity.ok(ApiResponse.success(membershipPlanRepository.save(plan)));
    }
}
