package com.dev.social.service.auth.impl;

import com.dev.social.service.admin.MailService;
import com.dev.social.service.auth.OtpService;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Iterator;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OtpServiceImpl implements OtpService {

    @Value("${define.otp.expire-time}")
    @NonFinal
    long expireTime;

    final MailService mailService;

    Map<String, OtpInfo> otpStore = new ConcurrentHashMap<>();

    @Override
    public void generateAndSendOtp(String email) {
        String otp = String.valueOf(new Random().nextInt(900000) + 100000);
        OtpInfo otpInfo = new OtpInfo(otp, LocalDateTime.now().plusMinutes(expireTime));
        otpStore.put(email, otpInfo);
        mailService.sendMail(email, otp);
    }

    @Override
    public boolean verifyOtp(String email, String otp) {
        OtpInfo storedOtp = otpStore.get(email);
        if (storedOtp == null) return false;

        if (storedOtp.expiryTime.isBefore(LocalDateTime.now())) {
            otpStore.remove(email);
            return false;
        }

        boolean match = storedOtp.code.equals(otp);
        if (match) otpStore.remove(email);
        return match;
    }

    // Dọn dẹp OTP hết hạn mỗi 1 phút
    @Scheduled(fixedRate = 60_000)
    public void clearExpiredOtp() {
        Iterator<Map.Entry<String, OtpInfo>> iterator = otpStore.entrySet().iterator();
        while (iterator.hasNext()) {
            Map.Entry<String, OtpInfo> entry = iterator.next();
            if (entry.getValue().expiryTime.isBefore(LocalDateTime.now())) {
                iterator.remove();
                log.debug("Expired OTP removed for {}", entry.getKey());
            }
        }
    }

    @AllArgsConstructor
    static class OtpInfo {
        String code;
        LocalDateTime expiryTime;
    }
}
