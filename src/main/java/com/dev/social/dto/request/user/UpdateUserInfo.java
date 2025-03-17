package com.dev.social.dto.request.user;

import com.dev.social.utils.validation.dobValidation.DobConstraint;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateUserInfo {
    @DobConstraint(min = 18, message = "Day of birth must be 18 years ago or more")
    LocalDate dob;
    String address;
    String gender;
}
