package com.dev.social.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ListChatResponseDTO {
    String userId;
    String name;
    String username;
    String avatarUrl;
}

