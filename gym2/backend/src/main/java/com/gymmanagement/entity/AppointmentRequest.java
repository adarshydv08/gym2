package com.gymmanagement.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointment_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(nullable = false, length = 20)
    private String phone;

    @Column(name = "preferred_service", length = 150)
    private String preferredService;

    @Column(name = "preferred_date", length = 50)
    private String preferredDate;

    @Column(name = "preferred_time", length = 50)
    private String preferredTime;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(name = "reply_message", columnDefinition = "TEXT")
    private String replyMessage;

    @Column(name = "contacted_by", length = 100)
    private String contactedBy;

    @Column(name = "contacted_at")
    private LocalDateTime contactedAt;

    @Builder.Default
    @Column(length = 20)
    private String status = "NEW";

    @Builder.Default
    @Column(name = "is_contacted")
    private Boolean contacted = false;

    @Builder.Default
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
