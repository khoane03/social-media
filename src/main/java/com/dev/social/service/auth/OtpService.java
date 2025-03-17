package com.dev.social.service.auth;

public interface OtpService {
    void generateAndSendOtp(String email);

    boolean verifyOtp(String email, String otp);



}
