package com.gymmanagement.service;

import com.gymmanagement.dto.WorkoutExerciseRequest;
import com.gymmanagement.dto.WorkoutPlanRequest;
import com.gymmanagement.entity.Member;
import com.gymmanagement.entity.Trainer;
import com.gymmanagement.entity.WorkoutExercise;
import com.gymmanagement.entity.WorkoutPlan;
import com.gymmanagement.repository.MemberRepository;
import com.gymmanagement.repository.TrainerRepository;
import com.gymmanagement.repository.WorkoutPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkoutService {

    private final WorkoutPlanRepository workoutPlanRepository;
    private final MemberRepository memberRepository;
    private final TrainerRepository trainerRepository;

    @Transactional(readOnly = true)
    public List<WorkoutPlan> getAllWorkouts() {
        return workoutPlanRepository.findAll();
    }

    @Transactional(readOnly = true)
    public WorkoutPlan getWorkoutById(Long id) {
        return workoutPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workout plan not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<WorkoutPlan> getMemberWorkouts(Long memberId) {
        return workoutPlanRepository.findByMemberId(memberId);
    }

    @Transactional(readOnly = true)
    public List<WorkoutPlan> getTrainerWorkouts(Long trainerId) {
        return workoutPlanRepository.findByTrainerId(trainerId);
    }

    @Transactional(readOnly = true)
    public java.util.Optional<WorkoutPlan> getLatestWorkoutForMember(Long memberId) {
        return workoutPlanRepository.findFirstByMemberIdOrderByCreatedAtDesc(memberId);
    }

    @Transactional
    public WorkoutPlan createWorkout(WorkoutPlanRequest request) {
        Member member = memberRepository.findById(request.getMemberId())
                .orElseThrow(() -> new RuntimeException("Member not found with id: " + request.getMemberId()));

        Trainer trainer = null;
        if (request.getTrainerId() != null) {
            trainer = trainerRepository.findById(request.getTrainerId())
                    .orElseThrow(() -> new RuntimeException("Trainer not found with id: " + request.getTrainerId()));
        }

        WorkoutPlan workoutPlan = WorkoutPlan.builder()
                .member(member)
                .trainer(trainer)
                .title(request.getTitle())
                .goal(request.getGoal())
                .notes(request.getNotes())
                .build();

        if (request.getExercises() != null) {
            List<WorkoutExercise> exercises = buildExercises(workoutPlan, request.getExercises());
            workoutPlan.setExercises(exercises);
        }

        return workoutPlanRepository.save(workoutPlan);
    }

    @Transactional
    public WorkoutPlan updateWorkout(Long id, WorkoutPlanRequest request) {
        WorkoutPlan workoutPlan = getWorkoutById(id);

        if (request.getMemberId() != null) {
            Member member = memberRepository.findById(request.getMemberId())
                    .orElseThrow(() -> new RuntimeException("Member not found with id: " + request.getMemberId()));
            workoutPlan.setMember(member);
        }

        if (request.getTrainerId() != null) {
            Trainer trainer = trainerRepository.findById(request.getTrainerId())
                    .orElseThrow(() -> new RuntimeException("Trainer not found with id: " + request.getTrainerId()));
            workoutPlan.setTrainer(trainer);
        }

        if (request.getTitle() != null) workoutPlan.setTitle(request.getTitle());
        if (request.getGoal() != null) workoutPlan.setGoal(request.getGoal());
        if (request.getNotes() != null) workoutPlan.setNotes(request.getNotes());

        if (request.getExercises() != null) {
            workoutPlan.getExercises().clear();
            workoutPlan.getExercises().addAll(buildExercises(workoutPlan, request.getExercises()));
        }

        return workoutPlanRepository.save(workoutPlan);
    }

    @Transactional
    public void deleteWorkout(Long id) {
        WorkoutPlan workoutPlan = getWorkoutById(id);
        workoutPlanRepository.delete(workoutPlan);
    }

    private List<WorkoutExercise> buildExercises(WorkoutPlan workoutPlan, List<WorkoutExerciseRequest> requests) {
        List<WorkoutExercise> exercises = new ArrayList<>();
        for (WorkoutExerciseRequest exerciseRequest : requests) {
            WorkoutExercise exercise = WorkoutExercise.builder()
                    .workoutPlan(workoutPlan)
                    .exerciseName(exerciseRequest.getExerciseName())
                    .sets(exerciseRequest.getSets() != null ? exerciseRequest.getSets() : 3)
                    .reps(exerciseRequest.getReps() != null ? exerciseRequest.getReps() : 10)
                    .weightKg(exerciseRequest.getWeightKg() != null ? exerciseRequest.getWeightKg() : null)
                    .restSeconds(exerciseRequest.getRestSeconds() != null ? exerciseRequest.getRestSeconds() : 60)
                    .dayName(exerciseRequest.getDayName() != null ? exerciseRequest.getDayName() : "Day 1")
                    .build();
            exercises.add(exercise);
        }
        return exercises;
    }
}
