package com.gymmanagement.service;

import com.gymmanagement.entity.TrainerFeedback;
import com.gymmanagement.repository.TrainerFeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TrainerFeedbackService {

    private final TrainerFeedbackRepository trainerFeedbackRepository;
    private final com.gymmanagement.repository.TrainerRepository trainerRepository;
    private final com.gymmanagement.repository.MemberRepository memberRepository;

    @Transactional
    public TrainerFeedback createFeedback(Long trainerId, Long memberId, String message, Integer rating) {
        var trainer = trainerRepository.findById(trainerId).orElseThrow(() -> new RuntimeException("Trainer not found"));
        var member = memberRepository.findById(memberId).orElseThrow(() -> new RuntimeException("Member not found"));
        TrainerFeedback fb = TrainerFeedback.builder().trainer(trainer).member(member).message(message).rating(rating).build();
        return trainerFeedbackRepository.save(fb);
    }

    @Transactional(readOnly = true)
    public List<TrainerFeedback> getFeedbacksForTrainer(Long trainerId) {
        return trainerFeedbackRepository.findByTrainerId(trainerId);
    }

    @Transactional(readOnly = true)
    public List<TrainerFeedback> getFeedbacksForMember(Long memberId) {
        return trainerFeedbackRepository.findByMemberId(memberId);
    }
}
