package com.gymmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthRequest {
    
    @NotBlank(message = "Username/Email/Phone is required")
    private String identifier; // Email or Mobile Number

    @NotBlank(message = "Password is required")
    private String password;

    private String selectedRole; // ROLE_OWNER, ROLE_MANAGER, ROLE_MEMBER
}
