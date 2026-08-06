package com.gymmanagement.repository;

import com.gymmanagement.entity.AppointmentRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AppointmentRequestRepository extends JpaRepository<AppointmentRequest, Long> {
}
