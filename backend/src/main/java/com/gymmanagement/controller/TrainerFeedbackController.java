package com.gymmanagement.controller;

import com.gymmanagement.dto.ApiResponse;
import com.gymmanagement.entity.TrainerFeedback;
import com.gymmanagement.service.TrainerFeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/trainers")
@RequiredArgsConstructor
public class TrainerFeedbackController {

    private final TrainerFeedbackService feedbackService;

    @GetMapping("/{trainerId}/feedbacks")
    @PreAuthorize("hasAnyRole('OWNER','MANAGER','TRAINER')")
    public ResponseEntity<ApiResponse<List<TrainerFeedback>>> listForTrainer(@PathVariable Long trainerId) {
        return ResponseEntity.ok(ApiResponse.success(feedbackService.getFeedbacksForTrainer(trainerId)));
    }

    @PostMapping("/{trainerId}/feedbacks")
    @PreAuthorize("hasAnyRole('OWNER','MANAGER','TRAINER')")
    public ResponseEntity<ApiResponse<TrainerFeedback>> createForTrainer(@PathVariable Long trainerId, @RequestBody java.util.Map<String, Object> body) {
        Long memberId = Long.valueOf(String.valueOf(body.get("memberId")));
        String message = String.valueOf(body.getOrDefault("message", ""));
        Integer rating = body.get("rating") != null ? Integer.valueOf(String.valueOf(body.get("rating"))) : null;
        return ResponseEntity.ok(ApiResponse.success(feedbackService.createFeedback(trainerId, memberId, message, rating)));
    }

    @GetMapping("/member/{memberId}/trainer-feedbacks")
    @PreAuthorize("hasAnyRole('OWNER','MANAGER','MEMBER')")
    public ResponseEntity<ApiResponse<List<TrainerFeedback>>> listForMember(@PathVariable Long memberId) {
        return ResponseEntity.ok(ApiResponse.success(feedbackService.getFeedbacksForMember(memberId)));
    }
}
