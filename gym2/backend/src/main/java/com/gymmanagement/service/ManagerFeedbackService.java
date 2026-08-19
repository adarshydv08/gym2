package com.gymmanagement.service;

import com.gymmanagement.entity.ManagerFeedback;
import com.gymmanagement.repository.ManagerFeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ManagerFeedbackService {

    private final ManagerFeedbackRepository managerFeedbackRepository;
    private final com.gymmanagement.repository.ManagerRepository managerRepository;
    private final com.gymmanagement.repository.MemberRepository memberRepository;

    @Transactional
    public ManagerFeedback createFeedback(Long managerId, Long memberId, String message) {
        var manager = managerRepository.findById(managerId).orElseThrow(() -> new RuntimeException("Manager not found"));
        var member = memberRepository.findById(memberId).orElseThrow(() -> new RuntimeException("Member not found"));
        ManagerFeedback fb = ManagerFeedback.builder().manager(manager).member(member).message(message).build();
        return managerFeedbackRepository.save(fb);
    }

    @Transactional(readOnly = true)
    public List<ManagerFeedback> getFeedbacksForManager(Long managerId) {
        return managerFeedbackRepository.findByManagerId(managerId);
    }

    @Transactional(readOnly = true)
    public List<ManagerFeedback> getFeedbacksForMember(Long memberId) {
        return managerFeedbackRepository.findByMemberId(memberId);
    }
}
