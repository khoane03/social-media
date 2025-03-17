package com.dev.social.utils.validation;

import com.dev.social.dto.request.auth.RegisterRequestDTO;
import com.dev.social.repository.UserRepository;
import com.dev.social.utils.exception.AppException;
import com.dev.social.utils.exception.ErrorMessage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class RegisterValidate {

    UserRepository userRepository;

    public void isValidRegister(RegisterRequestDTO req) {
        checkDuplicate(userRepository.existsByPhone(req.getPhone()), ErrorMessage.PHONE_ALREADY_EXIST);
        checkDuplicate(userRepository.existsByUsername(req.getUsername()), ErrorMessage.USER_ALREADY_EXIST);
        checkDuplicate(userRepository.existsByEmail(req.getEmail()), ErrorMessage.EMAIL_ALREADY_EXIST);
        checkPassMatch(req.getPassword(), req.getConfirmPassword());
    }

    public void checkDuplicate(boolean isDuplicate, ErrorMessage message) {
        if (isDuplicate) {
            throw new AppException(message);
        }
    }

    public void checkPassMatch(String pass, String confirmPass) {
        if (!pass.equals(confirmPass)) {
            throw new AppException(ErrorMessage.PASSWORD_NOT_MATCH);
        }
    }

}
