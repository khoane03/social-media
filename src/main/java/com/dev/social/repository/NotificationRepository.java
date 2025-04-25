package com.dev.social.repository;

import com.dev.social.entity.Notifications;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notifications, String> {
    List<Notifications> findByUserIdOrderByCreatedAtDesc(String userId);
}
