package com.gymmanagement.repository;

import com.gymmanagement.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByMemberId(Long memberId);
    List<Attendance> findByDate(LocalDate date);
    Optional<Attendance> findByMemberIdAndDateAndCheckOutTimeIsNull(Long memberId, LocalDate date);
    Long countByDate(LocalDate date);
}
