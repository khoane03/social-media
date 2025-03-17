package com.dev.social.service.admin;

import org.springframework.security.core.userdetails.UserDetails;

import java.util.Map;

public interface JwtService
{
    Map<String, String> generateToken(UserDetails userDetails);

    boolean validateAccessToken(String token, UserDetails userDetails);

    String extractUsername(String token);

    String refreshToken(String refreshToken, UserDetails userDetails);

    void logout(String token);
}
