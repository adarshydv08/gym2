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

    @org.springframework.data.jpa.repository.Query("SELECT DAYOFWEEK(a.date), COUNT(a) FROM Attendance a WHERE a.date >= :startDate GROUP BY DAYOFWEEK(a.date) ORDER BY DAYOFWEEK(a.date)")
    List<Object[]> getWeeklyAttendanceTrend(@org.springframework.data.repository.query.Param("startDate") LocalDate startDate);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(a) FROM Attendance a WHERE YEAR(a.date) = YEAR(CURRENT_DATE) AND MONTH(a.date) = :month")
    Long countByMonth(@org.springframework.data.repository.query.Param("month") int month);
}
