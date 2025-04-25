package com.dev.social.dto.response;

import com.dev.social.utils.constants.AppConst;
import com.dev.social.utils.exception.ErrorMessage;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.Collection;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponseDTO<T> {

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = AppConst.DATE_FORMAT)
    @Builder.Default
    LocalDateTime timestamp = LocalDateTime.now();

    int code;
    String message;
    String errMess;
    T data;
    Integer pageIndex;
    Integer pageSize;
    Integer totalElements;
    Integer totalPages;

    // factory method: build from simple objects
    public static <T> ApiResponseDTO<T> of(T data) {
        ApiResponseDTOBuilder<T> builder = ApiResponseDTO.<T>builder()
                .code(HttpStatus.OK.value())
                .message(AppConst.SUCCESS)
                .data(data);

        if (data instanceof Collection<?> collection) {
            builder.totalElements(collection.size());
        }

        return builder.build();
    }

    // Factory method: build from Page<>
    public static <T> ApiResponseDTO<Collection<T>> of(Page<T> pageData) {
        return ApiResponseDTO.<Collection<T>>builder()
                .code(HttpStatus.OK.value())
                .message(AppConst.SUCCESS)
                .data(pageData.getContent())
                .pageIndex(pageData.getNumber() + 1)
                .pageSize(pageData.getSize())
                .totalElements((int) pageData.getTotalElements())
                .totalPages(pageData.getTotalPages())
                .build();
    }

    // Factory: build exception from ErrorMessage
    public static <T> ApiResponseDTO<T> error(ErrorMessage err) {
        return ApiResponseDTO.<T>builder()
                .code(err.getCode())
                .errMess(err.getMessage())
                .build();
    }

    // Factory: build exception from String
    public static <T> ApiResponseDTO<T> error(String message, int code) {
        return ApiResponseDTO.<T>builder()
                .code(code)
                .errMess(message)
                .build();
    }
}
