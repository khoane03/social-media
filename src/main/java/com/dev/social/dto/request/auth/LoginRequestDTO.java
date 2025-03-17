package com.dev.social.dto.request.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class LoginRequestDTO {

    @NotBlank(message = "Username must not be blank")
    String username;

    @NotBlank(message = "Password must not be blank ")
    String password;
}
