package com.dev.social.service.admin;

public interface TokenService {
    void saveToken(String key, String value, long expirationTime);
    void saveToken(String key, String value);
    String getToken(String key);
    void deleteToken(String key);
    boolean tokenExists(String key);
}
