package com.gymmanagement.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class WorkoutPlanRequest {
    private Long memberId;
    private Long trainerId;
    private String title;
    private String goal;
    private String notes;
    private List<WorkoutExerciseRequest> exercises;
}
