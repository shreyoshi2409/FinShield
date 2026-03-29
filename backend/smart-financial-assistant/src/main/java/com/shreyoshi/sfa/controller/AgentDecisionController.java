package com.shreyoshi.sfa.controller;

import com.shreyoshi.sfa.entity.AgentDecision;
import com.shreyoshi.sfa.entity.Anomaly;
import com.shreyoshi.sfa.entity.Action;
import com.shreyoshi.sfa.service.AgentDecisionService;
import com.shreyoshi.sfa.service.ActionService;
import com.shreyoshi.sfa.service.AuditLogService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/decisions")
@RequiredArgsConstructor
public class AgentDecisionController {

    private final AgentDecisionService agentDecisionService;
    private final ActionService actionService;
    private final AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<List<AgentDecision>> getAll() {
        return ResponseEntity.ok(agentDecisionService.getAll());
    }

    @GetMapping("/pending")
    public ResponseEntity<List<AgentDecision>> getPending() {
        return ResponseEntity.ok(agentDecisionService.getPending());
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<AgentDecision> approve(
            @PathVariable Long id,
            @RequestParam(defaultValue = "MANAGER") String reviewedBy) {
        AgentDecision decision = agentDecisionService.approve(id, reviewedBy);
        return ResponseEntity.ok(decision);
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<AgentDecision> reject(
            @PathVariable Long id,
            @RequestParam(defaultValue = "MANAGER") String reviewedBy) {
        AgentDecision decision = agentDecisionService.reject(id, reviewedBy);
        return ResponseEntity.ok(decision);
    }

    @PostMapping("/{id}/execute")
    public ResponseEntity<Action> execute(@PathVariable Long id) {
        AgentDecision decision = agentDecisionService.getById(id);
        Action action = actionService.execute(decision);
        return ResponseEntity.ok(action);
    }

    @PostMapping("/save")
    public ResponseEntity<AgentDecision> save(@RequestBody AgentDecisionRequest request) {
        Anomaly anomaly = new Anomaly();
        anomaly.setId(request.getAnomalyId());

        AgentDecision decision = AgentDecision.builder()
                .anomaly(anomaly)
                .agentName(request.getAgentName())
                .recommendedAction(request.getRecommendedAction())
                .reasoning(request.getReasoning())
                .moneyAtRisk(request.getMoneyAtRisk())
                .moneySaveable(request.getMoneySaveable())
                .build();

        AgentDecision saved = agentDecisionService.save(decision);

        auditLogService.log(
                "DECISION_CREATED",
                "AgentDecision",
                saved.getId(),
                "Decision created by agent: " + saved.getAgentName()
        );

        return ResponseEntity.ok(saved);
    }

    @Data
    public static class AgentDecisionRequest {
        private Long anomalyId;
        private String agentName;
        private String recommendedAction;
        private String reasoning;
        private BigDecimal moneyAtRisk;
        private BigDecimal moneySaveable;
    }
}