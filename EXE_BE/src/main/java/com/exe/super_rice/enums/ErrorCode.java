package com.exe.super_rice.enums;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
@Getter
public enum ErrorCode {
    UNAUTHENTICATED(1006, "Wrong username or password",HttpStatus.BAD_REQUEST),
    PRODUCT_NOT_FOUND(1007, "Product not found", HttpStatus.NOT_FOUND),
    INVALID_PRODUCT_REQUEST(1008, "Invalid product request", HttpStatus.BAD_REQUEST),
    PRODUCT_CREATION_FAILED(1009, "Failed to create product", HttpStatus.INTERNAL_SERVER_ERROR),
    PRODUCT_UPDATE_FAILED(1010, "Failed to update product", HttpStatus.INTERNAL_SERVER_ERROR),
    PRODUCT_DELETE_FAILED(1011, "Failed to delete product", HttpStatus.INTERNAL_SERVER_ERROR),
        ;
    private int code;
    private String message;

    public String getMessage() {
        return message;
    }

    private HttpStatusCode statusCode;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    ErrorCode() {
    }
}
