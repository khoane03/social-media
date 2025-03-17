package com.dev.social.dto.response;

import com.dev.social.utils.constants.AppConst;
import com.dev.social.utils.exception.ErrorMessage;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.Collection;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_DEFAULT)
public class ApiResponseDTO<T> {

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = AppConst.DATE_FORMAT)
    final LocalDateTime timestamp = LocalDateTime.now();
    int code;
    String errMess;
    String message;
    T data;
    int total;


    public static <T> ApiResponseDTO<T> build(T data){
        ApiResponseDTO<T> apiResponseDTO = new ApiResponseDTO<>();
        apiResponseDTO.setCode(HttpStatus.OK.value());
        apiResponseDTO.setData(data);
        apiResponseDTO.setMessage(AppConst.SUCCESS);
        if (data instanceof Collection) {
            apiResponseDTO.total = ((Collection<?>) data).size();
        }
        return apiResponseDTO;
    }

    public static <T> ApiResponseDTO<T> buildException(ErrorMessage err){
        ApiResponseDTO<T> apiResponseDTO = new ApiResponseDTO<>();
        apiResponseDTO.setCode(err.getCode());
        apiResponseDTO.setErrMess(err.getMessage());
        return apiResponseDTO;
    }

    public static <T> ApiResponseDTO<T> buildException(String err, int code){
        ApiResponseDTO<T> apiResponseDTO = new ApiResponseDTO<>();
        apiResponseDTO.setCode(code);
        apiResponseDTO.setErrMess(err);
        return apiResponseDTO;
    }

    public static <T> ApiResponseDTO<T> build(){
        ApiResponseDTO<T> apiResponseDTO = new ApiResponseDTO<>();
        apiResponseDTO.setCode(HttpStatus.OK.value());
        apiResponseDTO.setMessage(AppConst.SUCCESS);
        return apiResponseDTO;
    }
}
