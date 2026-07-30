package com.gymmanagement.controller;

import com.gymmanagement.dto.ApiResponse;
import com.gymmanagement.entity.Payment;
import com.gymmanagement.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER')")
    public ResponseEntity<ApiResponse<List<Payment>>> getAllPayments() {
        return ResponseEntity.ok(ApiResponse.success(paymentService.getAllPayments()));
    }

    @GetMapping("/member/{memberId}")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER', 'MEMBER')")
    public ResponseEntity<ApiResponse<List<Payment>>> getMemberPayments(@PathVariable Long memberId) {
        return ResponseEntity.ok(ApiResponse.success(paymentService.getMemberPayments(memberId)));
    }

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER', 'MEMBER')")
    public ResponseEntity<ApiResponse<Payment>> processPayment(
            @RequestParam Long memberId,
            @RequestParam BigDecimal amount,
            @RequestParam(required = false) String paymentMethod) {
        return ResponseEntity.ok(ApiResponse.success("Payment processed successfully", paymentService.processPayment(memberId, amount, paymentMethod)));
    }
}
