package com.dev.social.utils.validation.dobValidation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = {DobCustom.class})
public @interface DobConstraint {
    int min();

    String message() default "Invalid day of birth. Please enter a valid date of birth.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
