package com.gymmanagement.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "membership_id")
    private Membership membership;

    @Column(name = "amount_inr", nullable = false, precision = 10, scale = 2)
    private BigDecimal amountInr;

    @Builder.Default
    @Column(name = "payment_method", length = 50)
    private String paymentMethod = "UPI"; // UPI, CREDIT_CARD, DEBIT_CARD, NET_BANKING, CASH

    @Builder.Default
    @Column(name = "payment_status", length = 20)
    private String paymentStatus = "SUCCESSFUL"; // PENDING, PROCESSING, SUCCESSFUL, FAILED, REFUNDED

    @Column(name = "transaction_id", nullable = false, unique = true, length = 100)
    private String transactionId;

    @Builder.Default
    @Column(name = "payment_date", updatable = false)
    private LocalDateTime paymentDate = LocalDateTime.now();
}
