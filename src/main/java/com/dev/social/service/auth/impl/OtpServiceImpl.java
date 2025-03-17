package com.dev.social.service.auth.impl;

import com.dev.social.service.admin.MailService;
import com.dev.social.service.auth.OtpService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class OtpServiceImpl implements OtpService {

    @Value("${define.otp.expire-time}")
    @NonFinal
    long expireTime;

    final RedisTemplate<String, String> redisTemplate;
    final MailService mailService;

    @Override
    public void generateAndSendOtp(String email) {
        String otpRandom = String.valueOf(new Random().nextInt(999999 - 100000 + 1) + 100000);
        redisTemplate.opsForValue().set(email, otpRandom, expireTime, TimeUnit.MINUTES);
        mailService.sendMail(email, otpRandom);
    }

    @Override
    public boolean verifyOtp(String email, String otp) {
        String storedOtp = redisTemplate.opsForValue().get(email);
        return storedOtp != null && storedOtp.equals(otp);
    }
}