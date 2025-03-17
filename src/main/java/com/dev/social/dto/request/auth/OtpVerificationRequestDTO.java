package com.dev.social.dto.request.auth;

import com.dev.social.utils.validation.emailValidation.EmailConstraint;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OtpVerificationRequestDTO {

    String otpCode;

    @EmailConstraint(message = "Email must be in the form (A-Z,a-z,0-9)@gmail.com")
    String email;
}
