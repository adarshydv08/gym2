package com.gymmanagement.controller;

import com.gymmanagement.dto.ApiResponse;
import com.gymmanagement.entity.Manager;
import com.gymmanagement.service.ManagerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/managers")
@RequiredArgsConstructor
public class ManagerController {

    private final ManagerService managerService;

    @GetMapping
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<List<Manager>>> getAllManagers() {
        return ResponseEntity.ok(ApiResponse.success(managerService.getAllManagers()));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<Manager>> approveManager(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(managerService.approveManager(id)));
    }
}
