package com.gymmanagement.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "workout_exercises")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutExercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_plan_id", nullable = false)
    @JsonIgnore
    private WorkoutPlan workoutPlan;

    @Column(name = "exercise_name", nullable = false, length = 100)
    private String exerciseName;

    @Column(nullable = false)
    private Integer sets;

    @Column(nullable = false)
    private Integer reps;

    @Builder.Default
    @Column(name = "weight_kg", precision = 5, scale = 2)
    private BigDecimal weightKg = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "rest_seconds")
    private Integer restSeconds = 60;

    @Builder.Default
    @Column(name = "day_name", length = 20)
    private String dayName = "Day 1";
}
