package com.gymmanagement.repository;

import com.gymmanagement.entity.GymClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GymClassRepository extends JpaRepository<GymClass, Long> {
    List<GymClass> findByIsActiveTrue();
    List<GymClass> findByTrainerId(Long trainerId);
}
