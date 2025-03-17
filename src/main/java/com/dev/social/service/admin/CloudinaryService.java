package com.dev.social.service.admin;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface CloudinaryService {
    String uploadImage(MultipartFile file) throws IOException;
    Boolean deleteImage(String url) throws IOException;
}
