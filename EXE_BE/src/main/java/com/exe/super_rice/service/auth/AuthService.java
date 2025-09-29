package com.exe.super_rice.service.auth;

import com.exe.super_rice.database.entity.Users;
import com.exe.super_rice.dto.request.IntrospectRequest;
import com.exe.super_rice.dto.request.LoginRequest;
import com.exe.super_rice.dto.response.IntrospectResponse;

public interface AuthService {
    String login(LoginRequest request);
    String  createAccount(LoginRequest request);

    IntrospectResponse introspect(IntrospectRequest request);
}
