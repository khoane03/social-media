package com.dev.social.service.admin.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.dev.social.service.admin.CloudinaryService;
import com.dev.social.utils.constants.AppConst;
import com.dev.social.utils.exception.AppException;
import com.dev.social.utils.exception.ErrorMessage;
import com.dev.social.utils.validation.FileValidate;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Slf4j
public class CloudinaryServiceImpl implements CloudinaryService {

    Cloudinary cloudinary;
    FileValidate fileValidate;

    @Override
    public String uploadImage(MultipartFile file) throws IOException {
        fileValidate.isValidImageFile(file);
        cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap(AppConst.PUBLIC_ID,
                        generateBaseName(Objects.requireNonNull(file.getOriginalFilename()))));
        return cloudinary.url().generate(generateBaseName(Objects.requireNonNull(file.getOriginalFilename())) +
                getExtension(Objects.requireNonNull(file.getOriginalFilename())));
    }

    @Override
    public Boolean deleteImage(String url) throws IOException {
        String publicId = extractPublicId(url);
        log.warn("Deleting image with public id: {}", publicId);
        return cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap()).get("result").equals("ok");
    }

    String generateBaseName(String fileName) {

        return LocalDate.now().toString().replace("-", "")
                + "_" +
                Objects.requireNonNull(fileName).substring(0, Objects.requireNonNull(fileName).lastIndexOf("."));
    }

    String getExtension(String fileName) {
        return Objects.requireNonNull(fileName).substring(Objects.requireNonNull(fileName).lastIndexOf("."));
    }

    String extractPublicId(String url) {
        try {
            int lastSlashIndex = url.lastIndexOf("/");
            int lastDotIndex = url.lastIndexOf(".");
            if (lastSlashIndex == -1 || lastDotIndex == -1 || lastDotIndex < lastSlashIndex) {
                throw new AppException(ErrorMessage.BAD_REQUEST);
            }
            return url.substring(lastSlashIndex + 1, lastDotIndex);
        } catch (Exception e) {
            throw new RuntimeException(url, e);
        }
    }

}
