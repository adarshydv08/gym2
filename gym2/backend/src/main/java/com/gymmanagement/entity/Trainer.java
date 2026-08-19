package com.gymmanagement.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "trainers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Trainer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(length = 100)
    private String specialization;

    @Builder.Default
    @Column(name = "experience_years")
    private Integer experienceYears = 3;

    @Column(length = 255)
    private String certifications;

    @Builder.Default
    private Double rating = 4.8;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Builder.Default
    @Column(name = "monthly_rate", precision = 10, scale = 2)
    private BigDecimal monthlyRate = new BigDecimal("2999.00");

    @Column(name = "photo_url")
    private String photoUrl;

    @Builder.Default
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
