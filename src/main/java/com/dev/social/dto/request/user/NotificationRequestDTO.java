package com.dev.social.dto.request.user;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PACKAGE)
@Builder
public class NotificationRequestDTO {

    String userId;
    String content;
    String status;

}
