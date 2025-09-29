package com.exe.super_rice.controller;


import com.exe.super_rice.dto.request.IntrospectRequest;
import com.exe.super_rice.dto.request.LoginRequest;
import com.exe.super_rice.dto.response.ApiResponse;
import com.exe.super_rice.dto.response.IntrospectResponse;
import com.exe.super_rice.service.auth.AuthService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthController {
    AuthService authService;
    @GetMapping("/")
    public String home() {
        return "Hello World";
    }

    @PostMapping("/signup")
    public ApiResponse<String> createAccount(@RequestBody LoginRequest request) {
        return ApiResponse.<String>builder()
                .data(authService.createAccount(request))
                .build();
    }
    @PostMapping("/login")
    public ApiResponse<String> login(@RequestBody LoginRequest request) {
        return ApiResponse.<String>builder()
                .data(authService.login(request))
                .build();
    }
    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> authenticate(@RequestBody IntrospectRequest request) {
        IntrospectResponse result = authService.introspect(request);
        return ApiResponse.<IntrospectResponse>builder().data(result).build();
    }
}
