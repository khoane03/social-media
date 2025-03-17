package com.dev.social.dto.request.user;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;


@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostRequest {
    String content;
    MultipartFile[] files;
}

