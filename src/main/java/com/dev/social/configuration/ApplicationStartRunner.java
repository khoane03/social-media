package com.dev.social.configuration;

import com.dev.social.service.admin.AdminInitService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApplicationStartRunner implements ApplicationRunner {

    AdminInitService adminInitService;

    @Override
    public void run(ApplicationArguments args) {
        adminInitService.initDefaultAdmin();
    }
}
