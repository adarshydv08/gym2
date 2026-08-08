package com.gymmanagement.repository;

import com.gymmanagement.entity.ManagerFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ManagerFeedbackRepository extends JpaRepository<ManagerFeedback, Long> {
    List<ManagerFeedback> findByManagerId(Long managerId);
    List<ManagerFeedback> findByMemberId(Long memberId);
}
