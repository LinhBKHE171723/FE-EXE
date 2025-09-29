package com.exe.super_rice.exception;

import com.exe.super_rice.dto.response.ApiResponse;
import com.exe.super_rice.enums.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiResponse<Object>> handleAppException(AppException ex) {
        ErrorCode errorCode = ex.getErrorCode();

        ApiResponse<Object> response = ApiResponse.builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .data(null)
                .build();

        return ResponseEntity.status(errorCode.getStatusCode().value()).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleOtherExceptions(Exception ex) {
        log.error("Unexpected error: {}", ex.getMessage(), ex);

        ApiResponse<Object> response = ApiResponse.builder()
                .code(500)
                .message("Internal server error")
                .data(null)
                .build();

        return ResponseEntity.status(500).body(response);
    }
}
