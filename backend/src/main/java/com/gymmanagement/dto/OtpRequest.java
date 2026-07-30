package com.gymmanagement.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpRequest {
    private String phone;
    private String email;
    private String otp;
}
