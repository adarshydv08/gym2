package com.gymmanagement.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateAnnouncementRequest {
    private String title;
    private String content;
    private String targetRole = "ALL";
}
