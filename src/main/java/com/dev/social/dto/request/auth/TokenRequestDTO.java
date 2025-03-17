package com.dev.social.dto.request.auth;

import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class TokenRequestDTO {
    String accessToken;
    String refreshToken;
}
