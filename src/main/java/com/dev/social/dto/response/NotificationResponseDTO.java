package com.dev.social.dto.response;

import com.dev.social.entity.Notifications;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationResponseDTO {
    String id;
    String userId;
    String userName;
    String content;
    String status;
    String createdAt;
    String updatedAt;

    public NotificationResponseDTO(Notifications notifications){
        this.setId(notifications.getId());
        this.setUserId(notifications.getUser().getId());
        this.setUserName(notifications.getUser().getName());
        this.setContent(notifications.getContents());
        this.setStatus(notifications.getStatus().name());
        this.setCreatedAt(notifications.getCreatedAt().toString());
        this.setUpdatedAt(notifications.getUpdatedAt().toString());
    }
}
