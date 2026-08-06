package com.gymmanagement.controller;

import com.gymmanagement.dto.ApiResponse;
import com.gymmanagement.entity.ManagerFeedback;
import com.gymmanagement.service.ManagerFeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/managers")
@RequiredArgsConstructor
public class ManagerFeedbackController {

    private final ManagerFeedbackService feedbackService;

    @GetMapping("/{managerId}/feedbacks")
    @PreAuthorize("hasAnyRole('OWNER','MANAGER')")
    public ResponseEntity<ApiResponse<List<ManagerFeedback>>> listForManager(@PathVariable Long managerId) {
        return ResponseEntity.ok(ApiResponse.success(feedbackService.getFeedbacksForManager(managerId)));
    }

    @PostMapping("/{managerId}/feedbacks")
    @PreAuthorize("hasAnyRole('OWNER','MANAGER')")
    public ResponseEntity<ApiResponse<ManagerFeedback>> createForManager(@PathVariable Long managerId, @RequestBody java.util.Map<String, Object> body) {
        Long memberId = Long.valueOf(String.valueOf(body.get("memberId")));
        String message = String.valueOf(body.getOrDefault("message", ""));
        return ResponseEntity.ok(ApiResponse.success(feedbackService.createFeedback(managerId, memberId, message)));
    }

    @GetMapping("/member/{memberId}/manager-feedbacks")
    @PreAuthorize("hasAnyRole('OWNER','MANAGER','MEMBER')")
    public ResponseEntity<ApiResponse<List<ManagerFeedback>>> listForMember(@PathVariable Long memberId) {
        return ResponseEntity.ok(ApiResponse.success(feedbackService.getFeedbacksForMember(memberId)));
    }
}
