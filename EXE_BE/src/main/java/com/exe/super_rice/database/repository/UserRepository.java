package com.exe.super_rice.database.repository;

import com.exe.super_rice.database.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRepository extends JpaRepository<Users, Long> {
    Users findByEmail(String email);
}
