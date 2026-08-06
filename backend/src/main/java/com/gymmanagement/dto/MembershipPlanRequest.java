package com.gymmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MembershipPlanRequest {
    private String title;
    private String description;
    private Integer durationMonths;
    private BigDecimal priceInr;
    private String benefits;
    private Boolean isPopular;
    private Boolean isActive;
}
