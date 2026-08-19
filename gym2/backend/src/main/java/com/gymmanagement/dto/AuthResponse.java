package com.gymmanagement.dto;

import lombok.*;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    @Builder.Default
    private String tokenType = "Bearer";
    private Long userId;
    private String name;
    private String email;
    private String phone;
    private Set<String> roles;
    private String activeRole;
    private Long memberId;
    private Long managerId;
    private Long trainerId;
}
