package com.dev.social.service.admin.impl;

import com.dev.social.service.admin.MailService;
import com.dev.social.utils.constants.MailConst;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class MailServiceImpl implements MailService {

    @Value("${spring.mail.username}")
    @NonFinal
    String sendFrom;

    JavaMailSender mailSender;

    @Override
    public void sendMail(String sendTo, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, MailConst.MAIL_ENCODE_UTF_8);
            helper.setFrom(sendFrom, MailConst.MAIL_PERSONAL);
            helper.setTo(sendTo);
            helper.setText(MailConst.MAIL_CONTENT + otp, true);
            helper.setSubject(MailConst.MAIL_SUBJECT);
            mailSender.send(message);
        } catch (MessagingException | UnsupportedEncodingException e) {
           log.error("Error send mail : {}", e.getMessage());
        }
    }
}
