package com.gymmanagement.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OwnerDashboardDto {
    private long totalMembers;
    private long activeMembers;
    private long expiringMemberships;
    private long todayAttendance;
    private BigDecimal monthlyRevenue;
    private BigDecimal totalRevenue;
    private long activeTrainers;
    private long todayClasses;
    private long openComplaints;

    private List<Map<String, Object>> revenueTrend;
    private List<Map<String, Object>> membershipGrowth;
    private List<Map<String, Object>> attendanceTrend;
    private List<Map<String, Object>> popularPlans;
}
