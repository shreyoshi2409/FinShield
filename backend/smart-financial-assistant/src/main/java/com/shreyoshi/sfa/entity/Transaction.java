package com.shreyoshi.sfa.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "transaction_ref", unique = true)
    private String transactionRef;

    @NotBlank
    @Column(name = "vendor_name")
    private String vendorName;

    @NotNull
    @DecimalMin("0.0")
    @Column(name = "amount", precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(name = "currency", length = 10)
    private String currency;

    @Column(name = "category")
    private String category;

    @Column(name = "department")
    private String department;

    @Column(name = "transaction_date")
    private LocalDateTime transactionDate;

    @Column(name = "due_date")
    private LocalDateTime dueDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private TransactionStatus status;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = TransactionStatus.PENDING;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum TransactionStatus {
        PENDING, COMPLETED, FLAGGED, DUPLICATE, CANCELLED
    }
}