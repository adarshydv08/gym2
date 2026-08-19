package com.gymmanagement.controller;

import com.gymmanagement.dto.ApiResponse;
import com.gymmanagement.dto.GymSettingRequest;
import com.gymmanagement.entity.GymSetting;
import com.gymmanagement.repository.GymSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class GymSettingController {

    private final GymSettingRepository gymSettingRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<GymSetting>> getSettings() {
        List<GymSetting> settings = gymSettingRepository.findAll();
        GymSetting setting = settings.isEmpty() ? new GymSetting() : settings.get(0);
        return ResponseEntity.ok(ApiResponse.success(setting));
    }

    @PutMapping
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<GymSetting>> updateSettings(@RequestBody GymSettingRequest request) {
        List<GymSetting> settings = gymSettingRepository.findAll();
        GymSetting setting = settings.isEmpty() ? new GymSetting() : settings.get(0);
        setting.setGymName(request.getGymName());
        setting.setLogoUrl(request.getLogoUrl());
        setting.setAddress(request.getAddress());
        setting.setPhone(request.getPhone());
        setting.setEmail(request.getEmail());
        setting.setOpeningHours(request.getOpeningHours());
        setting.setHolidays(request.getHolidays());
        setting.setUpiId(request.getUpiId());
        GymSetting saved = gymSettingRepository.save(setting);
        return ResponseEntity.ok(ApiResponse.success(saved));
    }
}
