package com.gymmanagement.repository;

import com.gymmanagement.entity.TrainerFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TrainerFeedbackRepository extends JpaRepository<TrainerFeedback, Long> {
    List<TrainerFeedback> findByTrainerId(Long trainerId);
    List<TrainerFeedback> findByMemberId(Long memberId);
}
