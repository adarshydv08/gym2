package com.gymmanagement.controller;

import com.gymmanagement.dto.ApiResponse;
import com.gymmanagement.entity.Attendance;
import com.gymmanagement.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/check-in")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER', 'MEMBER')")
    public ResponseEntity<ApiResponse<Attendance>> checkIn(
            @RequestParam Long memberId,
            @RequestParam(required = false) String deviceId,
            @RequestParam(required = false) String gymBranch) {
        return ResponseEntity.ok(ApiResponse.success("Check-in recorded", attendanceService.checkIn(memberId, deviceId, gymBranch)));
    }

    @PostMapping("/check-out")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER', 'MEMBER')")
    public ResponseEntity<ApiResponse<Attendance>> checkOut(@RequestParam Long memberId) {
        return ResponseEntity.ok(ApiResponse.success("Check-out recorded", attendanceService.checkOut(memberId)));
    }

    @GetMapping("/member/{memberId}")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER', 'MEMBER')")
    public ResponseEntity<ApiResponse<List<Attendance>>> getMemberAttendance(@PathVariable Long memberId) {
        return ResponseEntity.ok(ApiResponse.success(attendanceService.getMemberAttendance(memberId)));
    }

    @GetMapping("/today")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER')")
    public ResponseEntity<ApiResponse<List<Attendance>>> getTodayAttendance() {
        return ResponseEntity.ok(ApiResponse.success(attendanceService.getTodayAttendance()));
    }
}
