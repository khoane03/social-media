package com.dev.social.utils.validation;

import com.dev.social.utils.enums.ReactionTypeEnum;
import com.dev.social.utils.exception.AppException;
import com.dev.social.utils.exception.ErrorMessage;
import org.springframework.stereotype.Component;

@Component
public class FeelValidate {

    public ReactionTypeEnum isValidFeelType(String feelType) {
        try {
            String feelTypeUpperCase = feelType.toUpperCase();
            return ReactionTypeEnum.valueOf(feelTypeUpperCase);
        } catch (IllegalArgumentException e) {
            throw new AppException(ErrorMessage.INVALID_FEEL_TYPE);
        }

    }

}
