package com.shreyoshi.sfa.repository;

import com.shreyoshi.sfa.entity.AgentDecision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface AgentDecisionRepository extends JpaRepository<AgentDecision, Long> {

    List<AgentDecision> findByApprovalStatus(AgentDecision.ApprovalStatus approvalStatus);

    List<AgentDecision> findByAnomaly_Id(Long anomalyId);

    @Query("SELECT COALESCE(SUM(d.moneyAtRisk), 0) FROM AgentDecision d")
    BigDecimal sumMoneyAtRisk();

    @Query("SELECT COALESCE(SUM(d.moneySaveable), 0) FROM AgentDecision d")
    BigDecimal sumMoneySaveable();
}