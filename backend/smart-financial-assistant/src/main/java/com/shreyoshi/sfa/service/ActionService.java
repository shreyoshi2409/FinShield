package com.shreyoshi.sfa.service;

import com.shreyoshi.sfa.entity.Action;
import com.shreyoshi.sfa.entity.AgentDecision;
import com.shreyoshi.sfa.repository.ActionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActionService {

    private final ActionRepository actionRepository;
    private final AuditLogService auditLogService;

    public Action execute(AgentDecision decision) {
        // Only execute if decision is APPROVED
        if (decision.getApprovalStatus() != AgentDecision.ApprovalStatus.APPROVED) {
            throw new RuntimeException("Cannot execute action — decision is not approved.");
        }

        Action action = Action.builder()
                .decision(decision)
                .actionType(Action.ActionType.TRANSACTION_FLAGGED)
                .actionDetail("Flagged based on agent decision: " + decision.getRecommendedAction())
                .executedBy("SYSTEM")
                .status(Action.ActionStatus.SUCCESS)
                .build();

        Action saved = actionRepository.save(action);

        // Log to audit trail
        auditLogService.log(
                "ACTION_EXECUTED",
                "Action",
                saved.getId(),
                "Action executed for decision ID: " + decision.getId()
        );

        return saved;
    }

    public List<Action> getAll() {
        return actionRepository.findAll();
    }

    public List<Action> getByDecisionId(Long decisionId) {
        return actionRepository.findByDecision_Id(decisionId);
    }
}