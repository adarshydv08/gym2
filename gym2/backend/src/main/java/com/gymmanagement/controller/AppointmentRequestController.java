package com.gymmanagement.controller;

import com.gymmanagement.dto.ApiResponse;
import com.gymmanagement.dto.CreateAppointmentRequest;
import com.gymmanagement.entity.AppointmentRequest;
import com.gymmanagement.service.AppointmentRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentRequestController {

    private final AppointmentRequestService appointmentRequestService;

    @PostMapping
    public ResponseEntity<ApiResponse<AppointmentRequest>> createAppointmentRequest(
            @Valid @RequestBody CreateAppointmentRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Appointment request submitted successfully", appointmentRequestService.createRequest(request)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER')")
    public ResponseEntity<ApiResponse<List<AppointmentRequest>>> getAllRequests() {
        return ResponseEntity.ok(ApiResponse.success(appointmentRequestService.getAllRequests()));
    }

    @PutMapping("/{id}/contacted")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER')")
    public ResponseEntity<ApiResponse<AppointmentRequest>> markContacted(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Appointment request marked as contacted", appointmentRequestService.markContacted(id)));
    }

    @PostMapping("/{id}/reply")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER')")
    public ResponseEntity<ApiResponse<AppointmentRequest>> replyToRequester(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        String message = body.getOrDefault("message", "");
        String by = body.getOrDefault("contactedBy", "Admin");
        return ResponseEntity.ok(ApiResponse.success("Appointment request replied", appointmentRequestService.replyToRequester(id, message, by)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER')")
    public ResponseEntity<ApiResponse<Void>> deleteRequest(@PathVariable Long id) {
        appointmentRequestService.deleteRequest(id);
        return ResponseEntity.ok(ApiResponse.success("Appointment request deleted successfully", null));
    }
}
