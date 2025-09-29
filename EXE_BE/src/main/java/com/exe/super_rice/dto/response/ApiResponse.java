package com.exe.super_rice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
//@JsonInclude(JsonInclude.Include.NON_NULL)
@Builder
@AllArgsConstructor
public class ApiResponse<T> {
    @Builder.Default
    private int code = 1000;
    private String message;
    private T data;
}
