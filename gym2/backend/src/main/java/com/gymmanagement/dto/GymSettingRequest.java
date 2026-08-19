package com.gymmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GymSettingRequest {
    private String gymName;
    private String logoUrl;
    private String address;
    private String phone;
    private String email;
    private String openingHours;
    private String holidays;
    private String upiId;
}
