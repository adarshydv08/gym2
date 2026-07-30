package com.gymmanagement.service;

import com.gymmanagement.entity.ClassBooking;
import com.gymmanagement.entity.GymClass;
import com.gymmanagement.entity.Member;
import com.gymmanagement.repository.ClassBookingRepository;
import com.gymmanagement.repository.GymClassRepository;
import com.gymmanagement.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GymClassService {

    private final GymClassRepository gymClassRepository;
    private final ClassBookingRepository classBookingRepository;
    private final MemberRepository memberRepository;

    @Transactional(readOnly = true)
    public List<GymClass> getAllClasses() {
        return gymClassRepository.findByIsActiveTrue();
    }

    @Transactional(readOnly = true)
    public GymClass getClassById(Long id) {
        return gymClassRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Class not found with id: " + id));
    }

    @Transactional
    public ClassBooking bookClass(Long classId, Long memberId, LocalDate date) {
        GymClass gymClass = getClassById(classId);
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found with id: " + memberId));

        LocalDate bookingDate = (date != null) ? date : LocalDate.now();

        // Check if already booked
        if (classBookingRepository.findByGymClassIdAndMemberIdAndBookingDate(classId, memberId, bookingDate).isPresent()) {
            throw new RuntimeException("Member is already booked for this class on " + bookingDate);
        }

        // Check capacity
        Long confirmedBookings = classBookingRepository.countByGymClassIdAndBookingDateAndStatus(classId, bookingDate, "CONFIRMED");
        if (confirmedBookings >= gymClass.getCapacity()) {
            throw new RuntimeException("Class capacity reached (" + gymClass.getCapacity() + " seats)");
        }

        ClassBooking booking = ClassBooking.builder()
                .gymClass(gymClass)
                .member(member)
                .bookingDate(bookingDate)
                .status("CONFIRMED")
                .build();

        return classBookingRepository.save(booking);
    }

    @Transactional(readOnly = true)
    public List<ClassBooking> getMemberBookings(Long memberId) {
        return classBookingRepository.findByMemberId(memberId);
    }
}
