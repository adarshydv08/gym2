package com.gymmanagement.service;

import com.gymmanagement.entity.Attendance;
import com.gymmanagement.entity.Member;
import com.gymmanagement.repository.AttendanceRepository;
import com.gymmanagement.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public Attendance checkIn(Long memberId, String deviceId, String gymBranch) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found with id: " + memberId));

        LocalDate today = LocalDate.now();

        // Check if active check-in exists
        return attendanceRepository.findByMemberIdAndDateAndCheckOutTimeIsNull(memberId, today)
                .orElseGet(() -> {
                    Attendance attendance = Attendance.builder()
                            .member(member)
                            .date(today)
                            .checkInTime(LocalDateTime.now())
                            .deviceId((deviceId != null) ? deviceId : "GATE_01")
                            .gymBranch((gymBranch != null) ? gymBranch : "Roorkee Main Branch")
                            .build();
                    return attendanceRepository.save(attendance);
                });
    }

    @Transactional
    public Attendance checkOut(Long memberId) {
        LocalDate today = LocalDate.now();
        Attendance attendance = attendanceRepository.findByMemberIdAndDateAndCheckOutTimeIsNull(memberId, today)
                .orElseThrow(() -> new RuntimeException("No active check-in record found for today"));

        attendance.setCheckOutTime(LocalDateTime.now());
        return attendanceRepository.save(attendance);
    }

    @Transactional(readOnly = true)
    public List<Attendance> getMemberAttendance(Long memberId) {
        return attendanceRepository.findByMemberId(memberId);
    }

    @Transactional(readOnly = true)
    public List<Attendance> getTodayAttendance() {
        return attendanceRepository.findByDate(LocalDate.now());
    }
}
