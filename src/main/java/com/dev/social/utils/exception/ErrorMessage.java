package com.dev.social.utils.exception;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum ErrorMessage {
    // code 400
    BAD_REQUEST(400, "Bad Request", HttpStatus.BAD_REQUEST),
    INVALID_TOKEN(400_001, "Token invalid", HttpStatus.BAD_REQUEST),
    USER_ALREADY_EXIST(400_002, "User already exist", HttpStatus.BAD_REQUEST),
    PHONE_ALREADY_EXIST(400_003, "Phone already exits", HttpStatus.BAD_REQUEST),
    EMAIL_ALREADY_EXIST(400_004, "Email already exits", HttpStatus.BAD_REQUEST),
    PASSWORD_NOT_MATCH(400_005, "Password doesn't match", HttpStatus.BAD_REQUEST),
    INVALID_OTP(400_006, "OTP expired or invalid", HttpStatus.BAD_REQUEST),
    FILE_SIZE_TOO_LARGE(400_007, "Photo must be smaller than 10MB ", HttpStatus.BAD_REQUEST),
    INVALID_FILE_TYPE(400_008, "Invalid file type. Only support (png, jpg, jpeg)", HttpStatus.BAD_REQUEST),
    IMAGE_UPLOAD_FAILED(400_009, "Image upload failed", HttpStatus.BAD_REQUEST),
    INVALID_FEEL_TYPE(400_010, "Invalid feel type, Must be (LIKE, LOVE, HAHA, WOW, SAD, ANGRY)", HttpStatus.BAD_REQUEST),
    SAME_USER(400_011, "Can't send request to yourself", HttpStatus.BAD_REQUEST),

    // code 401
    UNAUTHORIZED(401, "UNAUTHORIZED", HttpStatus.UNAUTHORIZED),
    INCORRECT_USERNAME_OR_PASSWORD(401_001, "Incorrect username or password", HttpStatus.UNAUTHORIZED),


    // code 403
    FORBIDDEN(403, "Forbidden", HttpStatus.FORBIDDEN),


    ACC_NOT_FOUND(404_001, "Account isn't exist", HttpStatus.NOT_FOUND),
    POST_NOT_FOUND(404_002, "Post isn't exist", HttpStatus.NOT_FOUND),
    USER_NOT_FOUND(404_002, "User isn't exist", HttpStatus.NOT_FOUND);




    int code;
    String message;
    HttpStatus statusCode;
}
