package com.gymmanagement.controller;

import com.gymmanagement.dto.ApiResponse;
import com.gymmanagement.entity.ClassBooking;
import com.gymmanagement.entity.GymClass;
import com.gymmanagement.service.GymClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
public class ClassController {

    private final GymClassService gymClassService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<GymClass>>> getAllClasses() {
        return ResponseEntity.ok(ApiResponse.success(gymClassService.getAllClasses()));
    }

    @PostMapping("/{id}/book")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<ApiResponse<ClassBooking>> bookClass(
            @PathVariable Long id,
            @RequestParam Long memberId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(ApiResponse.success("Class booked successfully", gymClassService.bookClass(id, memberId, date)));
    }

    @GetMapping("/bookings/member/{memberId}")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER', 'MEMBER')")
    public ResponseEntity<ApiResponse<List<ClassBooking>>> getMemberBookings(@PathVariable Long memberId) {
        return ResponseEntity.ok(ApiResponse.success(gymClassService.getMemberBookings(memberId)));
    }
}
