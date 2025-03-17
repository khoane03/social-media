package com.dev.social.controller.auth;

import com.dev.social.dto.request.auth.*;
import com.dev.social.dto.response.ApiResponseDTO;
import com.dev.social.dto.response.AuthResponseDTO;
import com.dev.social.service.auth.AuthenticationService;
import com.dev.social.service.auth.OtpService;
import com.dev.social.utils.constants.AppConst;
import com.dev.social.utils.exception.AppException;
import com.dev.social.utils.exception.ErrorMessage;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthController {

    AuthenticationService authenticationService;
    OtpService otpService;


    @PostMapping("/login")
    public ApiResponseDTO<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO loginRequestDTO) {
        return ApiResponseDTO.build(authenticationService.login(loginRequestDTO));
    }

    @PostMapping("/logout")
    public ApiResponseDTO<String> logout(@Valid @RequestBody TokenRequestDTO req) {
        authenticationService.logout(req.getAccessToken());
        return ApiResponseDTO.build();
    }

    @PostMapping("/refresh")
    public ApiResponseDTO<AuthResponseDTO> refreshToken(@RequestBody TokenRequestDTO refreshToken) {
        return ApiResponseDTO.build(authenticationService.refreshToken(refreshToken));
    }

    @PostMapping("/send-otp")
    public ApiResponseDTO<String> registerEmail(@Valid @RequestBody OtpVerificationRequestDTO req) {
        otpService.generateAndSendOtp(req.getEmail());
        return ApiResponseDTO.build(AppConst.SEND_MAIL_SUCCESS);
    }

    @PostMapping("/verify-otp")
    public ApiResponseDTO<String> verifyOtp(@Valid @RequestBody OtpVerificationRequestDTO req) {
        if(!otpService.verifyOtp(req.getEmail(), req.getOtpCode())){
            throw new AppException(ErrorMessage.INVALID_OTP);
        }
        return ApiResponseDTO.build(AppConst.CONTINUE_REGISTER);
    }

    @PostMapping("/register")
    public ApiResponseDTO<String> register(@Valid @RequestBody RegisterRequestDTO req) {
        authenticationService.registerUser(req);
        return ApiResponseDTO.build(AppConst.REGISTER_SUCCESS);
    }

    @PostMapping("/recovery-password")
    public ApiResponseDTO<String> forgotPass(@Valid @RequestBody PasswordRecoveryRequestDTO req) {
        authenticationService.passwordRecovery(req);
        return ApiResponseDTO.build(AppConst.PASSWORD_RECOVERY_SUCCESS);
    }

}
