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
        if (totalRevenue == null) totalRevenue = BigDecimal.ZERO;

        BigDecimal monthlyRevenue = paymentRepository.calculateMonthlyRevenue();
        if (monthlyRevenue == null) monthlyRevenue = totalRevenue;

        // ─── Live Revenue Trend: last 6 months ──────────────────────────
        String[] MONTH_LABELS = {"Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"};
        LocalDate sixMonthsAgo = LocalDate.now().minusMonths(5).withDayOfMonth(1);
        List<Object[]> revenueRows = paymentRepository.getMonthlyRevenueTrend(sixMonthsAgo.atStartOfDay());
        List<Map<String, Object>> revenueTrend = new ArrayList<>();
        // Pre-fill last 6 months with 0
        for (int i = 5; i >= 0; i--) {
            LocalDate m = LocalDate.now().minusMonths(i);
            revenueTrend.add(new java.util.LinkedHashMap<>(Map.of("month", MONTH_LABELS[m.getMonthValue() - 1], "revenue", 0)));
        }
        for (Object[] row : revenueRows) {
            int yr = ((Number) row[0]).intValue();
            int mo = ((Number) row[1]).intValue();
            Number rev = (Number) row[2];
            for (Map<String, Object> entry : revenueTrend) {
                if (entry.get("month").equals(MONTH_LABELS[mo - 1])) {
                    entry.put("revenue", rev.longValue());
                }
            }
        }

        // ─── Live Weekly Attendance: last 4 weeks ─────────────────────────
        String[] DAY_LABELS = {"","Sun","Mon","Tue","Wed","Thu","Fri","Sat"};
        LocalDate fourWeeksAgo = LocalDate.now().minusWeeks(4);
        List<Object[]> attendanceRows = attendanceRepository.getWeeklyAttendanceTrend(fourWeeksAgo);
        Map<Integer, Long> dayMap = new java.util.LinkedHashMap<>();
        for (int d = 2; d <= 7; d++) dayMap.put(d, 0L); // Mon-Sat
        dayMap.put(1, 0L); // Sun
        for (Object[] row : attendanceRows) {
            int dayNum = ((Number) row[0]).intValue();
            long cnt = ((Number) row[1]).longValue();
            dayMap.put(dayNum, cnt);
        }
        List<Map<String, Object>> attendanceTrend = new ArrayList<>();
        int[] dayOrder = {2, 3, 4, 5, 6, 7, 1}; // Mon to Sun
        for (int d : dayOrder) {
            attendanceTrend.add(Map.of("day", DAY_LABELS[d], "attendees", dayMap.getOrDefault(d, 0L)));
        }

        // ─── Live Plan Distribution ──────────────────────────────────────
        List<Object[]> planRows = paymentRepository.getPlanDistribution();
        List<Map<String, Object>> popularPlans = new ArrayList<>();
        long planTotal = planRows.stream().mapToLong(r -> ((Number) r[1]).longValue()).sum();
        if (planTotal == 0) planTotal = 1;
        for (Object[] row : planRows) {
            String planName = (String) row[0];
            long count = ((Number) row[1]).longValue();
            long pct = Math.round((count * 100.0) / planTotal);
            popularPlans.add(Map.of("name", planName, "value", pct));
        }
        if (popularPlans.isEmpty()) {
            popularPlans = List.of(
                Map.of("name", "No data yet", "value", 100)
            );
        }

        // ─── Membership Growth (last 6 months by join date) ──────────────
        LocalDate memberGrowthStart = LocalDate.now().minusMonths(5).withDayOfMonth(1);
        List<Object[]> growthRows = memberRepository.getMonthlyMemberGrowth(memberGrowthStart.atStartOfDay());
        Map<String, Long> growthMap = new LinkedHashMap<>();
        for (int i = 5; i >= 0; i--) {
            LocalDate month = LocalDate.now().minusMonths(i);
            growthMap.put(MONTH_LABELS[month.getMonthValue() - 1], 0L);
        }
        for (Object[] row : growthRows) {
            int year = ((Number) row[0]).intValue();
            int month = ((Number) row[1]).intValue();
            long count = ((Number) row[2]).longValue();
            String monthLabel = MONTH_LABELS[month - 1];
            if (growthMap.containsKey(monthLabel)) {
                growthMap.put(monthLabel, count);
            }
        }
        List<Map<String, Object>> membershipGrowth = new ArrayList<>();
        for (Map.Entry<String, Long> entry : growthMap.entrySet()) {
            membershipGrowth.add(Map.of("month", entry.getKey(), "members", entry.getValue()));
        }

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
