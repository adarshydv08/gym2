package com.gymmanagement.repository;

import com.gymmanagement.entity.Membership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MembershipRepository extends JpaRepository<Membership, Long> {
    List<Membership> findByMemberId(Long memberId);
    Optional<Membership> findFirstByMemberIdAndStatus(Long memberId, String status);
    List<Membership> findByEndDateBetween(LocalDate startDate, LocalDate endDate);
}
