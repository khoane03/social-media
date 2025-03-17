package com.dev.social.service.auth;

import com.dev.social.dto.request.auth.LoginRequestDTO;
import com.dev.social.dto.request.auth.PasswordRecoveryRequestDTO;
import com.dev.social.dto.request.auth.RegisterRequestDTO;
import com.dev.social.dto.request.auth.TokenRequestDTO;
import com.dev.social.dto.response.AuthResponseDTO;

public interface AuthenticationService {
    AuthResponseDTO login(LoginRequestDTO loginRequestDTO);

    void logout(String token);

    AuthResponseDTO refreshToken(TokenRequestDTO token);

    void registerUser(RegisterRequestDTO registerRequestDTO);

    void passwordRecovery(PasswordRecoveryRequestDTO req);
}
