package com.dev.social.utils.validation;

import com.dev.social.utils.exception.AppException;
import com.dev.social.utils.exception.ErrorMessage;

public class EnumValidate {

    public static <E extends Enum<E>> E isValidEnum(Class<E> enumClass, String value, ErrorMessage error) {
        try {
            return Enum.valueOf(enumClass, value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new AppException(error);
        }
    }

}
