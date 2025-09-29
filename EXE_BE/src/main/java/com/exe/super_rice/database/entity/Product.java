package com.exe.super_rice.database.entity;


import com.exe.super_rice.enums.RiceType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    private String unit = "kg";
    private LocalDateTime createdAt = LocalDateTime.now();
    @Enumerated(EnumType.ORDINAL)
    private RiceType riceType;
    @OneToMany(mappedBy = "product")
    private List<OrderItem> orderItems = new ArrayList<>();
}