package com.gymmanagement.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class OtpService {

    private final Map<String, String> otpStorage = new ConcurrentHashMap<>();

    public String generateOtp(String identifier) {
        // Development default OTP: 123456
        String otp = "123456";
        otpStorage.put(identifier, otp);
        log.info("[MOCK OTP SERVICE] Generated OTP for {}: {}", identifier, otp);
        return otp;
    }

    public boolean verifyOtp(String identifier, String inputOtp) {
        String storedOtp = otpStorage.get(identifier);
        if (storedOtp != null && (storedOtp.equals(inputOtp) || "123456".equals(inputOtp))) {
            otpStorage.remove(identifier);
            return true;
        }
        return false;
    }
}
