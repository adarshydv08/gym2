package com.gymmanagement.dto;

import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
public class WorkoutExerciseRequest {
    private String exerciseName;
    private Integer sets;
    private Integer reps;
    private BigDecimal weightKg;
    private Integer restSeconds;
    private String dayName;
}
