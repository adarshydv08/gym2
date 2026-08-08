package com.gymmanagement.controller;

import com.gymmanagement.dto.ApiResponse;
import com.gymmanagement.entity.Member;
import com.gymmanagement.service.MemberService;
import com.gymmanagement.entity.WorkoutPlan;
import com.gymmanagement.service.WorkoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;
    private final WorkoutService workoutService;
    private final com.gymmanagement.repository.UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER')")
    public ResponseEntity<ApiResponse<List<Member>>> getAllMembers() {
        return ResponseEntity.ok(ApiResponse.success(memberService.getAllMembers()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER', 'MEMBER')")
    public ResponseEntity<ApiResponse<Member>> getMemberById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(memberService.getMemberById(id)));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER', 'MEMBER')")
    public ResponseEntity<ApiResponse<Member>> getMemberByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(memberService.getMemberByUserId(userId)));
    }

    @GetMapping("/{id}/workout-plan/latest")
    @PreAuthorize("hasAnyRole('OWNER','MANAGER','MEMBER')")
    public ResponseEntity<ApiResponse<WorkoutPlan>> getLatestWorkoutForMember(@PathVariable Long id) {
        var opt = workoutService.getLatestWorkoutForMember(id);
        return ResponseEntity.ok(ApiResponse.success(opt.orElse(null)));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<Member>> updateMemberStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(ApiResponse.success(memberService.updateMemberStatus(id, status)));
    }

    @PutMapping("/user/{userId}/profile")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER', 'MEMBER')")
    public ResponseEntity<ApiResponse<Member>> updateMemberProfile(
            @PathVariable Long userId,
            @RequestBody com.gymmanagement.dto.UpdateMemberProfileRequest request) {
        return ResponseEntity.ok(ApiResponse.success(memberService.updateMemberProfile(userId, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER')")
    public ResponseEntity<ApiResponse<Void>> deleteMember(@PathVariable Long id) {
        memberService.deleteMember(id, userRepository);
        return ResponseEntity.ok(ApiResponse.success("Member deleted successfully", null));
    }

    @PutMapping("/{id}/assign-trainer")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER')")
    public ResponseEntity<ApiResponse<Member>> assignTrainer(@PathVariable Long id, @RequestParam Long trainerId) {
        return ResponseEntity.ok(ApiResponse.success(memberService.assignTrainer(id, trainerId)));
    }
}
