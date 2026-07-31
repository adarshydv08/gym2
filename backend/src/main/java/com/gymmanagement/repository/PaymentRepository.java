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

    @Query("SELECT SUM(p.amountInr) FROM Payment p WHERE p.paymentStatus = 'SUCCESSFUL' AND YEAR(p.paymentDate) = YEAR(CURRENT_DATE) AND MONTH(p.paymentDate) = MONTH(CURRENT_DATE)")
    BigDecimal calculateMonthlyRevenue();

    @Query("SELECT YEAR(p.paymentDate), MONTH(p.paymentDate), SUM(p.amountInr) FROM Payment p WHERE p.paymentStatus = 'SUCCESSFUL' AND p.paymentDate >= :startDate GROUP BY YEAR(p.paymentDate), MONTH(p.paymentDate) ORDER BY YEAR(p.paymentDate), MONTH(p.paymentDate)")
    List<Object[]> getMonthlyRevenueTrend(@org.springframework.data.repository.query.Param("startDate") java.time.LocalDate startDate);

    @Query("SELECT mp.title, COUNT(ms) FROM Membership ms JOIN ms.plan mp GROUP BY mp.title ORDER BY COUNT(ms) DESC")
    List<Object[]> getPlanDistribution();
}
