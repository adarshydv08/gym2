package com.gymmanagement.controller;

import com.gymmanagement.dto.ApiResponse;
import com.gymmanagement.dto.CreateNotificationRequest;
import com.gymmanagement.entity.Notification;
import com.gymmanagement.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final com.gymmanagement.repository.UserRepository userRepository;

        private static final List<String> APPROVAL_NOTIFICATION_TYPES = List.of("APPROVAL", "REJECTION");

        private boolean hidesApprovalNotifications(Long userId) {
        return userRepository.findById(userId)
            .map(user -> user.getRoles().stream()
                .map(role -> role.getName())
                .anyMatch(Set.of("ROLE_MEMBER", "ROLE_TRAINER")::contains))
            .orElse(false);
        }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER', 'TRAINER', 'MEMBER')")
    public ResponseEntity<ApiResponse<List<Notification>>> getUserNotifications(@PathVariable Long userId) {
        List<Notification> notifications = hidesApprovalNotifications(userId)
            ? notificationRepository.findByUserIdAndTypeNotInOrderByCreatedAtDesc(userId, APPROVAL_NOTIFICATION_TYPES)
            : notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return ResponseEntity.ok(ApiResponse.success(notifications));
    }

    @GetMapping("/user/{userId}/unread-count")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER', 'TRAINER', 'MEMBER')")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount(@PathVariable Long userId) {
        Long count = hidesApprovalNotifications(userId)
            ? notificationRepository.countByUserIdAndIsReadFalseAndTypeNotIn(userId, APPROVAL_NOTIFICATION_TYPES)
            : notificationRepository.countByUserIdAndIsReadFalse(userId);
        return ResponseEntity.ok(ApiResponse.success(Map.of("unreadCount", count)));
    }

    @PutMapping("/{id}/read")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER', 'TRAINER', 'MEMBER')")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setIsRead(true);
            notificationRepository.save(n);
        });
        return ResponseEntity.ok(ApiResponse.success("Marked as read", null));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER', 'TRAINER', 'MEMBER')")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(@PathVariable Long id) {
        notificationRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Notification removed", null));
    }

    @PostMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('OWNER','MANAGER','TRAINER','MEMBER')")
    public ResponseEntity<ApiResponse<Void>> createNotification(
            @PathVariable Long userId,
            @Valid @RequestBody CreateNotificationRequest request) {

        var user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Notification n = Notification.builder()
                .user(user)
                .title(request.getTitle())
                .message(request.getMessage())
                .type(request.getType() != null ? request.getType() : "GENERAL")
                .isRead(false)
                .build();
        notificationRepository.save(n);
        return ResponseEntity.ok(ApiResponse.success("Notification created", null));
    }
}

