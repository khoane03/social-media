package com.dev.social.service.user;

import com.dev.social.dto.request.user.NotificationRequestDTO;
import com.dev.social.dto.response.NotificationResponseDTO;
import com.dev.social.entity.Notifications;

import java.util.List;

public interface NotificationService {

    void sendNotification(String user, Object payload);

    void createNotification(NotificationRequestDTO req);

    void markAsRead(String notificationId);

    void deleteNotification(String notificationId);

    List<NotificationResponseDTO> getNotificationsByUserId(String userId);

}
