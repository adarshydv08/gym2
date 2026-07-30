package com.gymmanagement.repository;

import com.gymmanagement.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByMemberId(Long memberId);
    
    @Query("SELECT SUM(p.amountInr) FROM Payment p WHERE p.paymentStatus = 'SUCCESSFUL'")
    BigDecimal calculateTotalRevenue();
}
