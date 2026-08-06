package com.gymmanagement.repository;

import com.gymmanagement.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByUserId(Long userId);
    Optional<Member> findByMembershipNumber(String membershipNumber);
    Long countByStatus(String status);
    @org.springframework.data.jpa.repository.Query("SELECT YEAR(m.createdAt), MONTH(m.createdAt), COUNT(m) FROM Member m WHERE m.createdAt >= :startDate GROUP BY YEAR(m.createdAt), MONTH(m.createdAt) ORDER BY YEAR(m.createdAt), MONTH(m.createdAt)")
    java.util.List<Object[]> getMonthlyMemberGrowth(@org.springframework.data.repository.query.Param("startDate") java.time.LocalDateTime startDate);
    java.util.List<Member> findByAssignedTrainerId(Long trainerId);
}
