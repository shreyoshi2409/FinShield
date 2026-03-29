package com.shreyoshi.sfa.service;

import com.shreyoshi.sfa.entity.AgentDecision;
import com.shreyoshi.sfa.repository.AgentDecisionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AgentDecisionService {

    private final AgentDecisionRepository agentDecisionRepository;

    public AgentDecision save(AgentDecision decision) {
        return agentDecisionRepository.save(decision);
    }

    public List<AgentDecision> getAll() {
        return agentDecisionRepository.findAll();
    }

    public AgentDecision getById(Long id) {
        return agentDecisionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("AgentDecision not found with id: " + id));
    }

    public List<AgentDecision> getPending() {
        return agentDecisionRepository.findByApprovalStatus(AgentDecision.ApprovalStatus.PENDING_APPROVAL);
    }

    public AgentDecision approve(Long id, String reviewedBy) {
        AgentDecision decision = getById(id);
        decision.setApprovalStatus(AgentDecision.ApprovalStatus.APPROVED);
        decision.setReviewedBy(reviewedBy);
        decision.setReviewedAt(LocalDateTime.now());
        return agentDecisionRepository.save(decision);
    }

    public AgentDecision reject(Long id, String reviewedBy) {
        AgentDecision decision = getById(id);
        decision.setApprovalStatus(AgentDecision.ApprovalStatus.REJECTED);
        decision.setReviewedBy(reviewedBy);
        decision.setReviewedAt(LocalDateTime.now());
        return agentDecisionRepository.save(decision);
    }
}