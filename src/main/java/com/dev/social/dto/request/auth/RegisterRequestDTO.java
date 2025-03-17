package com.dev.social.dto.request.auth;

import com.dev.social.utils.validation.emailValidation.EmailConstraint;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RegisterRequestDTO {

    @NotBlank(message = "Name is required")
    @Pattern(regexp = "^[A-Za-z ]*$",
            message = "Name must contain only letters and spaces")
    String name;

    @NotBlank(message = "Username is required")
    @Size(min = 8,
            message = "User name must be at least 8 characters long")
    String username;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$",
            message = "Password must contain at least one uppercase letter, one lowercase letter, and one number")
    String password;

    @NotBlank(message = "Confirm password is required")
    @Size(min = 8, message = "Confirm password must be at least 8 characters")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$",
            message = "Confirm password must contain at least one uppercase letter, one lowercase letter, and one number")
    String confirmPassword;

    @EmailConstraint(message = "Email must be in the form (A-Z,a-z,0-9)@gmail.com")
    String email;

    @Pattern(regexp = "^(\\+84|0)[0-9]*$",
            message = "Phone number must start with +84 or 0")
    @Size(min = 10, max = 12, message = "Phone number must be 10 or 12 digits")
    String phone;

}
