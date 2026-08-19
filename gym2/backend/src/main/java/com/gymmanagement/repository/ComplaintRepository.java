package com.gymmanagement.repository;

import com.gymmanagement.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByMemberId(Long memberId);
    List<Complaint> findByAssignedManagerId(Long managerId);
    Long countByStatus(String status);
}
