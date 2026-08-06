package com.gymmanagement.controller;

import com.gymmanagement.dto.ApiResponse;
import com.gymmanagement.entity.Complaint;
import com.gymmanagement.dto.CreateComplaintRequest;
import com.gymmanagement.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;

    @GetMapping
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER')")
    public ResponseEntity<ApiResponse<List<Complaint>>> getAllComplaints() {
        return ResponseEntity.ok(ApiResponse.success(complaintService.getAllComplaints()));
    }

    @GetMapping("/member/{memberId}")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER', 'MEMBER')")
    public ResponseEntity<ApiResponse<List<Complaint>>> getMemberComplaints(@PathVariable Long memberId) {
        return ResponseEntity.ok(ApiResponse.success(complaintService.getMemberComplaints(memberId)));
    }

    @PostMapping
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<ApiResponse<Complaint>> createComplaint(@RequestBody CreateComplaintRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Ticket raised successfully", complaintService.createComplaint(request.getMemberId(), request.getSubject(), request.getDescription(), request.getCategory(), request.getPriority())));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER')")
    public ResponseEntity<ApiResponse<Complaint>> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(ApiResponse.success(complaintService.updateComplaintStatus(id, status)));
    }
}
