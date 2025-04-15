package com.dev.social.dto.request.user;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DeleteChatRequestDTO {
    String id;
    String recipientId;
    String senderId;
    String type;
}
