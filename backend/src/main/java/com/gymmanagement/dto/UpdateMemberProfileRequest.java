package com.gymmanagement.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateMemberProfileRequest {
    private Double weightKg;
    private Double heightCm;
    private String bloodGroup;
    private String address;
    private String emergencyContact;
    private String fitnessGoal;
}
