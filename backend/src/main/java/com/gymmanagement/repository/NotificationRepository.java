package com.gymmanagement.repository;

import com.gymmanagement.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Notification> findByUserIdAndTypeNotInOrderByCreatedAtDesc(Long userId, List<String> types);
    Long countByUserIdAndIsReadFalse(Long userId);
    Long countByUserIdAndIsReadFalseAndTypeNotIn(Long userId, List<String> types);
}
