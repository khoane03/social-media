package com.dev.social.dto.response;

import com.dev.social.entity.Chat;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatResponseDTO {
    String id;
    String sender;
    String recipient;
    String content;
    LocalDateTime createdAt;

    public ChatResponseDTO(Chat chat) {
        if (chat != null) {
            this.id = chat.getId();
            this.sender = chat.getSender().getUsername();
            this.recipient = chat.getRecipient().getUsername();
            this.content = chat.getContents();
            this.createdAt = chat.getCreatedAt();
        }
    }
}
