package com.gymmanagement.service;

import com.gymmanagement.entity.Invoice;
import com.gymmanagement.entity.Member;
import com.gymmanagement.entity.Payment;
import com.gymmanagement.repository.InvoiceRepository;
import com.gymmanagement.repository.MemberRepository;
import com.gymmanagement.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;
    private final MemberRepository memberRepository;

    @Transactional(readOnly = true)
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Payment> getMemberPayments(Long memberId) {
        return paymentRepository.findByMemberId(memberId);
    }

    @Transactional
    public Payment processPayment(Long memberId, BigDecimal amount, String method) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found with id: " + memberId));

        String txnId = "TXN-" + ((method != null) ? method.toUpperCase() : "UPI") + "-" + System.currentTimeMillis();

        Payment payment = Payment.builder()
                .member(member)
                .amountInr(amount)
                .paymentMethod((method != null) ? method : "UPI")
                .paymentStatus("SUCCESSFUL")
                .transactionId(txnId)
                .paymentDate(LocalDateTime.now())
                .build();

        Payment savedPayment = paymentRepository.save(payment);

        // Generate Invoice
        Invoice invoice = Invoice.builder()
                .payment(savedPayment)
                .invoiceNumber("INV-2026-" + String.format("%04d", savedPayment.getId()))
                .pdfUrl("/invoices/INV-2026-" + String.format("%04d", savedPayment.getId()) + ".pdf")
                .build();
        invoiceRepository.save(invoice);

        return savedPayment;
    }
}
