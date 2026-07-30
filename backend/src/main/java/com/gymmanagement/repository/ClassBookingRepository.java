package com.gymmanagement.repository;

import com.gymmanagement.entity.ClassBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClassBookingRepository extends JpaRepository<ClassBooking, Long> {
    List<ClassBooking> findByMemberId(Long memberId);
    List<ClassBooking> findByGymClassId(Long gymClassId);
    Optional<ClassBooking> findByGymClassIdAndMemberIdAndBookingDate(Long classId, Long memberId, LocalDate bookingDate);
    Long countByGymClassIdAndBookingDateAndStatus(Long classId, LocalDate bookingDate, String status);
}
