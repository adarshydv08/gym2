package com.gymmanagement.controller;

import com.gymmanagement.dto.ApiResponse;
import com.gymmanagement.entity.Announcement;
import com.gymmanagement.repository.AnnouncementRepository;
import com.gymmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/announcements")
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementRepository announcementRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Announcement>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(announcementRepository.findAllByOrderByCreatedAtDesc()));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER')")
    public ResponseEntity<ApiResponse<Announcement>> create(
            @RequestParam String title,
            @RequestParam String content,
            @RequestParam(required = false, defaultValue = "ALL") String targetRole,
            @RequestParam Long createdByUserId) {
        var user = userRepository.findById(createdByUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Announcement a = Announcement.builder()
                .title(title).content(content).targetRole(targetRole).createdByUser(user).build();
        return ResponseEntity.ok(ApiResponse.success("Announcement posted", announcementRepository.save(a)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        announcementRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Announcement deleted", null));
    }
}
