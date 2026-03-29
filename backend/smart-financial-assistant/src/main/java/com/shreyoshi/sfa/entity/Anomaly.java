package com.shreyoshi.sfa.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "anomalies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Anomaly {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_id")
    private Transaction transaction;

    @Enumerated(EnumType.STRING)
    @Column(name = "anomaly_type")
    private AnomalyType anomalyType;

    @Enumerated(EnumType.STRING)
    @Column(name = "severity")
    private Severity severity;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "financial_impact", precision = 15, scale = 2)
    private BigDecimal financialImpact;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private AnomalyStatus status;

    @Column(name = "detected_at")
    private LocalDateTime detectedAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @PrePersist
    protected void onCreate() {
        detectedAt = LocalDateTime.now();
        if (status == null) status = AnomalyStatus.OPEN;
    }

    public enum AnomalyType {
        DUPLICATE_PAYMENT,
        COST_SPIKE,
        VENDOR_OVERCHARGE,
        SLA_BREACH_RISK,
        BUDGET_VARIANCE
    }

    public enum Severity {
        LOW, MEDIUM, HIGH, CRITICAL
    }

    public enum AnomalyStatus {
        OPEN, UNDER_REVIEW, RESOLVED, DISMISSED
    }
}