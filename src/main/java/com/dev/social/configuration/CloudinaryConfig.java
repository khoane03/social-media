package com.dev.social.configuration;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.dev.social.utils.constants.AppConst;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class CloudinaryConfig {

    @Value("${define.cloudinary.cloud-name}")
    String cloudName;

    @Value("${define.cloudinary.api-key}")
    String apiKey;

    @Value("${define.cloudinary.api-secret}")
    String apiSecret;

    @Bean
    public Cloudinary configCloud() {
        return new Cloudinary(ObjectUtils.asMap(
                AppConst.CLOUD_NAME, cloudName,
                AppConst.API_KEY, apiKey,
                AppConst.API_SECRET, apiSecret
        ));
    }
}