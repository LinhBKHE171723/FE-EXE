package com.exe.super_rice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsersResponse {
    private UUID id;
    private String email;
    private String fullName;
    private String phone;
    private String address;
    private Instant createdAt;
}