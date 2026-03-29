package com.shreyoshi.sfa.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "agent_decisions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AgentDecision {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "anomaly_id", nullable = false)
    private Anomaly anomaly;

    @Column(name = "agent_name")
    private String agentName;

    @Column(name = "recommended_action", columnDefinition = "TEXT")
    private String recommendedAction;

    @Column(name = "reasoning", columnDefinition = "TEXT")
    private String reasoning;

    @Column(name = "money_at_risk", precision = 15, scale = 2)
    private BigDecimal moneyAtRisk;

    @Column(name = "money_saveable", precision = 15, scale = 2)
    private BigDecimal moneySaveable;

    @Enumerated(EnumType.STRING)
    @Column(name = "approval_status")
    private ApprovalStatus approvalStatus;

    @Column(name = "reviewed_by")
    private String reviewedBy;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (approvalStatus == null) approvalStatus = ApprovalStatus.PENDING_APPROVAL;
    }

    public enum ApprovalStatus {
        PENDING_APPROVAL, APPROVED, REJECTED
    }
}