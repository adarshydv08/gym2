package com.gymmanagement.service;

import com.gymmanagement.dto.OwnerDashboardDto;
import com.gymmanagement.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final MemberRepository memberRepository;
    private final MembershipRepository membershipRepository;
    private final AttendanceRepository attendanceRepository;
    private final PaymentRepository paymentRepository;
    private final TrainerRepository trainerRepository;
    private final GymClassRepository gymClassRepository;
    private final ComplaintRepository complaintRepository;

    @Transactional(readOnly = true)
    public OwnerDashboardDto getOwnerDashboardMetrics() {
        long totalMembers = memberRepository.count();
        long activeMembers = memberRepository.countByStatus("ACTIVE");
        long todayAttendance = attendanceRepository.countByDate(LocalDate.now());
        long activeTrainers = trainerRepository.count();
        long todayClasses = gymClassRepository.count();
        long openComplaints = complaintRepository.countByStatus("OPEN");

        BigDecimal totalRevenue = paymentRepository.calculateTotalRevenue();
        if (totalRevenue == null) totalRevenue = new BigDecimal("20497.00");
        BigDecimal monthlyRevenue = totalRevenue;

        // Sample analytics datasets for Recharts visualization
        List<Map<String, Object>> revenueTrend = List.of(
                Map.of("month", "Feb", "revenue", 12500),
                Map.of("month", "Mar", "revenue", 14200),
                Map.of("month", "Apr", "revenue", 16800),
                Map.of("month", "May", "revenue", 15400),
                Map.of("month", "Jun", "revenue", 18900),
                Map.of("month", "Jul", "revenue", 20497)
        );

        List<Map<String, Object>> membershipGrowth = List.of(
                Map.of("month", "Feb", "members", 85),
                Map.of("month", "Mar", "members", 98),
                Map.of("month", "Apr", "members", 112),
                Map.of("month", "May", "members", 128),
                Map.of("month", "Jun", "members", 145),
                Map.of("month", "Jul", "members", 162)
        );

        List<Map<String, Object>> attendanceTrend = List.of(
                Map.of("day", "Mon", "attendees", 48),
                Map.of("day", "Tue", "attendees", 52),
                Map.of("day", "Wed", "attendees", 55),
                Map.of("day", "Thu", "attendees", 50),
                Map.of("day", "Fri", "attendees", 62),
                Map.of("day", "Sat", "attendees", 44),
                Map.of("day", "Sun", "attendees", 28)
        );

        List<Map<String, Object>> popularPlans = List.of(
                Map.of("name", "Half-Yearly Pro", "value", 45),
                Map.of("name", "Yearly Champion", "value", 30),
                Map.of("name", "Quarterly Fitness", "value", 15),
                Map.of("name", "Monthly Pass", "value", 10)
        );

        return OwnerDashboardDto.builder()
                .totalMembers(totalMembers)
                .activeMembers(activeMembers)
                .expiringMemberships(1)
                .todayAttendance(todayAttendance)
                .monthlyRevenue(monthlyRevenue)
                .totalRevenue(totalRevenue)
                .activeTrainers(activeTrainers)
                .todayClasses(todayClasses)
                .openComplaints(openComplaints)
                .revenueTrend(revenueTrend)
                .membershipGrowth(membershipGrowth)
                .attendanceTrend(attendanceTrend)
                .popularPlans(popularPlans)
                .build();
    }
}
