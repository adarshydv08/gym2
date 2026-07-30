package com.gymmanagement.controller;

import com.gymmanagement.dto.ApiResponse;
import com.gymmanagement.entity.Notification;
import com.gymmanagement.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER', 'MEMBER')")
    public ResponseEntity<ApiResponse<List<Notification>>> getUserNotifications(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)));
    }

    @GetMapping("/user/{userId}/unread-count")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER', 'MEMBER')")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount(@PathVariable Long userId) {
        Long count = notificationRepository.countByUserIdAndIsReadFalse(userId);
        return ResponseEntity.ok(ApiResponse.success(Map.of("unreadCount", count)));
    }

    @PutMapping("/{id}/read")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER', 'MEMBER')")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setIsRead(true);
            notificationRepository.save(n);
        });
        return ResponseEntity.ok(ApiResponse.success("Marked as read", null));
    }
}
