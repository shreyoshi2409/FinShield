package com.shreyoshi.sfa.controller;

import com.shreyoshi.sfa.repository.AgentDecisionRepository;
import com.shreyoshi.sfa.repository.AnomalyRepository;
import com.shreyoshi.sfa.entity.AgentDecision;
import com.shreyoshi.sfa.entity.Anomaly;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ImpactSummaryController {

    private final AgentDecisionRepository agentDecisionRepository;
    private final AnomalyRepository anomalyRepository;

    @GetMapping("/impact-summary")
    public ResponseEntity<Map<String, Object>> getImpactSummary() {
        BigDecimal totalMoneyAtRisk = agentDecisionRepository.sumMoneyAtRisk();
        BigDecimal totalMoneySaveable = agentDecisionRepository.sumMoneySaveable();

        long totalAnomalies = anomalyRepository.count();
        long totalDecisionsPending = agentDecisionRepository
                .findByApprovalStatus(AgentDecision.ApprovalStatus.PENDING_APPROVAL)
                .size();
        long totalOpenAnomalies = anomalyRepository
                .findByStatus(Anomaly.AnomalyStatus.OPEN)
                .size();

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalMoneyAtRisk", totalMoneyAtRisk);
        summary.put("totalMoneySaveable", totalMoneySaveable);
        summary.put("totalAnomalies", totalAnomalies);
        summary.put("totalOpenAnomalies", totalOpenAnomalies);
        summary.put("totalDecisionsPending", totalDecisionsPending);

        return ResponseEntity.ok(summary);
    }
}
