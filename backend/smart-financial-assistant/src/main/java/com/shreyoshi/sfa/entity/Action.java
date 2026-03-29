package com.shreyoshi.sfa.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "actions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Action {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "decision_id", nullable = false)
    private AgentDecision decision;

    @Enumerated(EnumType.STRING)
    @Column(name = "action_type")
    private ActionType actionType;

    @Column(name = "action_detail", columnDefinition = "TEXT")
    private String actionDetail;

    @Column(name = "executed_at")
    private LocalDateTime executedAt;

    @Column(name = "executed_by")
    private String executedBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ActionStatus status;

    @PrePersist
    protected void onCreate() {
        executedAt = LocalDateTime.now();
        if (executedBy == null) executedBy = "SYSTEM";
        if (status == null) status = ActionStatus.PENDING;
    }

    public enum ActionType {
        EMAIL_SENT, TRANSACTION_FLAGGED, REFUND_REQUESTED, ESCALATED
    }

    public enum ActionStatus {
        SUCCESS, FAILED, PENDING
    }
}