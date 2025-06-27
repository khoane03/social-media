package com.dev.social.service.user.impl;

import com.dev.social.dto.request.user.NotificationRequestDTO;
import com.dev.social.dto.response.NotificationResponseDTO;
import com.dev.social.entity.Notifications;
import com.dev.social.repository.NotificationRepository;
import com.dev.social.repository.UserRepository;
import com.dev.social.service.user.NotificationService;
import com.dev.social.utils.constants.AppConst;
import com.dev.social.utils.enums.NotificationEnum;
import com.dev.social.utils.exception.AppException;
import com.dev.social.utils.exception.ErrorMessage;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    final NotificationRepository notificationRepository;
    final UserRepository userRepository;
    final SimpMessagingTemplate simpMessagingTemplate;

    @Override
    @Transactional
    public void createNotification(NotificationRequestDTO req) {
        var user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new AppException(ErrorMessage.USER_NOT_FOUND));
        var notification = Notifications.builder()
                .user(user)
                .contents(req.getContent())
                .status(NotificationEnum.UNREAD)
                .build();
        notificationRepository.saveAndFlush(notification);
        sendNotification(user.getUsername(), new NotificationResponseDTO(notification));
    }

    @Override
    public void markAsRead(String notificationId) {
        notificationRepository.findById(notificationId)
                .ifPresentOrElse(notification -> {
                            notification.setStatus(NotificationEnum.READ);
                            notificationRepository.save(notification);
                        },
                        () -> {
                            throw new AppException(ErrorMessage.NOTIFICATION_NOT_FOUND);
                        });
    }

    @Override
    public void deleteNotification(String notificationId) {
        notificationRepository.findById(notificationId)
                .ifPresentOrElse(notificationRepository::delete,
                        () -> {
                            throw new AppException(ErrorMessage.NOTIFICATION_NOT_FOUND);
                        });
    }

    @Override
    public List<NotificationResponseDTO> getNotificationsByUserId(String userId) {
        List<Notifications> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return notifications.stream()
                .map(NotificationResponseDTO::new)
                .toList();
    }

    @Override
    public void sendNotification(String user, Object payload) {
        if (user == null || user.isEmpty()) {
            simpMessagingTemplate.convertAndSend(AppConst.WS_PUBLIC_NOTIFICATION, payload);
        } else {
            simpMessagingTemplate.convertAndSendToUser(user, AppConst.WS_PRIVATE_NOTIFICATION, payload);
        }
    }
}
