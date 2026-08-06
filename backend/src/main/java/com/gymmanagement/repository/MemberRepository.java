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
    java.util.List<Member> findByAssignedTrainerId(Long trainerId);
}
