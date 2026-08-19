package com.gymmanagement.controller;

import com.gymmanagement.dto.ApiResponse;
import com.gymmanagement.entity.*;
import com.gymmanagement.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@ConditionalOnProperty(name = "app.disable-membership-controller", havingValue = "false", matchIfMissing = true)
@RequestMapping("/api/memberships")
@RequiredArgsConstructor
public class MembershipController {

    private final MembershipRepository membershipRepository;
    private final MemberRepository memberRepository;
    private final MembershipPlanRepository membershipPlanRepository;
    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;

    /**
     * GET /api/memberships/member/{memberId}/active
     * Returns the active (or most recent) membership for a member.
     * Returns null data (not an error) if the member has no membership — this is the
     * "new user" state that tells the frontend to show the "Buy Membership" CTA.
     */
    @GetMapping("/member/{memberId}/active")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER', 'MEMBER')")
    public ResponseEntity<ApiResponse<Membership>> getActiveMembership(@PathVariable Long memberId) {
        Optional<Membership> activeMembership = membershipRepository
                .findFirstByMemberIdAndStatus(memberId, "ACTIVE");

        if (activeMembership.isPresent()) {
            return ResponseEntity.ok(ApiResponse.success(activeMembership.get()));
        }

        // Also check for EXPIRING_SOON as it is still valid
        Optional<Membership> expiringSoon = membershipRepository
                .findFirstByMemberIdAndStatus(memberId, "EXPIRING_SOON");

        return ResponseEntity.ok(ApiResponse.success(expiringSoon.orElse(null)));
    }

    /**
     * GET /api/memberships/member/{memberId}
     * Returns all memberships (history) for a member.
     */
    @GetMapping("/member/{memberId}")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER', 'MEMBER')")
    public ResponseEntity<ApiResponse<List<Membership>>> getMemberMemberships(@PathVariable Long memberId) {
        return ResponseEntity.ok(ApiResponse.success(membershipRepository.findByMemberId(memberId)));
    }

    /**
     * POST /api/memberships/purchase
     * Purchases a membership plan for a member.
     * Creates: Membership record + Payment record + Invoice record.
     */
    @PostMapping("/purchase")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER', 'MEMBER')")
    @Transactional
    public ResponseEntity<ApiResponse<Membership>> purchaseMembership(
            @RequestParam Long memberId,
            @RequestParam Long planId,
            @RequestParam(required = false, defaultValue = "UPI") String paymentMethod) {

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found with id: " + memberId));

        MembershipPlan plan = membershipPlanRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Membership plan not found with id: " + planId));

        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusMonths(plan.getDurationMonths());

        Membership membership = Membership.builder()
                .member(member)
                .plan(plan)
                .startDate(startDate)
                .endDate(endDate)
                .status("ACTIVE")
                .amountPaid(plan.getPriceInr())
                .autoRenew(false)
                .build();

        Membership savedMembership = membershipRepository.save(membership);

        // Create payment record
        String txnId = "TXN-" + paymentMethod.toUpperCase().replace(" ", "") + "-" + System.currentTimeMillis();
        Payment payment = Payment.builder()
                .member(member)
                .membership(savedMembership)
                .amountInr(plan.getPriceInr())
                .paymentMethod(paymentMethod)
                .paymentStatus("SUCCESSFUL")
                .transactionId(txnId)
                .paymentDate(LocalDateTime.now())
                .build();
        Payment savedPayment = paymentRepository.save(payment);

        // Generate invoice
        Invoice invoice = Invoice.builder()
                .payment(savedPayment)
                .invoiceNumber("INV-" + LocalDate.now().getYear() + "-" + String.format("%04d", savedPayment.getId()))
                .pdfUrl("/invoices/INV-" + LocalDate.now().getYear() + "-" + String.format("%04d", savedPayment.getId()) + ".pdf")
                .build();
        invoiceRepository.save(invoice);

        return ResponseEntity.ok(ApiResponse.success("Membership purchased successfully!", savedMembership));
    }
}
