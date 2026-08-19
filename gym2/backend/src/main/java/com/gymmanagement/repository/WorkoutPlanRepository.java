package com.gymmanagement.repository;

import com.gymmanagement.entity.WorkoutPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WorkoutPlanRepository extends JpaRepository<WorkoutPlan, Long> {
    List<WorkoutPlan> findByMemberId(Long memberId);
    List<WorkoutPlan> findByTrainerId(Long trainerId);
    java.util.Optional<WorkoutPlan> findFirstByMemberIdOrderByCreatedAtDesc(Long memberId);
}
