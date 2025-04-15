package com.dev.social.service.admin;

import org.springframework.security.core.userdetails.UserDetails;

import java.util.Map;

public interface JwtService
{
    Map<String, String> generateToken(UserDetails userDetails);

    boolean validateToken(String token, UserDetails userDetails, boolean isRefreshToken);

    String extractUsername(String token);

    String refreshToken(String refreshToken, UserDetails userDetails);

    void logout(String token);
}
