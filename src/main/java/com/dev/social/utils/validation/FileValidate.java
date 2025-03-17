package com.dev.social.utils.validation;

import com.dev.social.utils.constants.AppConst;
import com.dev.social.utils.exception.AppException;
import com.dev.social.utils.exception.ErrorMessage;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.Objects;

@Component
public class FileValidate {

    public void isValidImageFile(MultipartFile file) {
        isValidMaxFileSize(file);
        isValidFileType(file);
    }

    public void isValidMaxFileSize(MultipartFile file) {
        if (file.getSize() > AppConst.MAX_SIZE * 1024 * 1024) {
            throw new AppException(ErrorMessage.FILE_SIZE_TOO_LARGE);
        }
    }

    public void isValidFileType(MultipartFile file) {
        if (!Objects.requireNonNull(file.getContentType()).equalsIgnoreCase(AppConst.IMAGE_JPEG)
                && !file.getContentType().equalsIgnoreCase(AppConst.IMAGE_PNG)
                && !file.getContentType().equalsIgnoreCase(AppConst.IMAGE_JPG)) {
            throw new AppException(ErrorMessage.INVALID_FILE_TYPE);
        }
    }

}
