package com.gymmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class PendingApprovalResponse {
    private Long userId;
    private Long profileId;
    private String name;
    private String email;
    private String phone;
    private String requestedRole;
    private String status;
    private String registrationDate;
}
