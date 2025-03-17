package com.dev.social.utils.exception;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AppException extends RuntimeException {
    private final ErrorMessage errMsg;

    public AppException(ErrorMessage errMsg) {
        super();
        this.errMsg = errMsg;
    }

    public AppException() {
        super();
        errMsg = null;
    }


}
