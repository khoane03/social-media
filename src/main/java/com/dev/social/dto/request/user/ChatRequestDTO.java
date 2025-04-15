package com.dev.social.dto.request.user;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatRequestDTO {
    @NotBlank(message = "Sender cannot be blank")
    String sender;

    @NotBlank(message = "Recipient cannot be blank")
    String recipient;

    @NotBlank(message = "Content cannot be blank")
    String content;
}
