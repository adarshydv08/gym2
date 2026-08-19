package com.gymmanagement.repository;

import com.gymmanagement.entity.GymSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GymSettingRepository extends JpaRepository<GymSetting, Long> {
}
