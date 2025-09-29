package com.exe.super_rice.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsersRequest {
    private String email;
    private String password;
    private String fullName;
    private String phone;
    private String address;
}