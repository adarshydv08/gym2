package com.gymmanagement.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateTrainerRequest {
    private String name;
    private String email;
    private String phone;
    private String specialization;
    private Integer experienceYears;
    private String certifications;
    private String bio;
}
