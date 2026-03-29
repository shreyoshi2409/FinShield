package com.shreyoshi.sfa.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "vendors")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vendor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "category")
    private String category;

    @Column(name = "expected_rate", precision = 15, scale = 2)
    private BigDecimal expectedRate;

    @Column(name = "contract_value", precision = 15, scale = 2)
    private BigDecimal contractValue;

    @Column(name = "contract_start")
    private LocalDateTime contractStart;

    @Column(name = "contract_end")
    private LocalDateTime contractEnd;

    @Column(name = "email")
    private String email;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}