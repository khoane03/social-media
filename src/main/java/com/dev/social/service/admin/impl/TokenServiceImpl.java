package com.dev.social.service.admin.impl;

import com.dev.social.service.admin.TokenService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TokenServiceImpl implements TokenService {

    RedisTemplate<String, String> redisTemplate;

    @Override
    public void saveToken(String key, String value, long expirationTime) {
        redisTemplate.opsForValue().set(key, value, expirationTime, TimeUnit.MINUTES);
    }

    @Override
    public void saveToken(String key, String value) {
        redisTemplate.opsForValue().set(key, value);
    }

    @Override
    public String getToken(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    @Override
    public void deleteToken(String key) {
        redisTemplate.delete(key);
    }

    @Override
    public boolean tokenExists(String key) {
        return redisTemplate.hasKey(key);
    }
}
