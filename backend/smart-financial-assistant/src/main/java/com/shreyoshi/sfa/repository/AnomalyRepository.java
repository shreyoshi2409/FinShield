package com.shreyoshi.sfa.repository;

import com.shreyoshi.sfa.entity.Anomaly;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnomalyRepository extends JpaRepository<Anomaly, Long> {

    List<Anomaly> findByStatus(Anomaly.AnomalyStatus status);

    List<Anomaly> findBySeverity(Anomaly.Severity severity);

    List<Anomaly> findByAnomalyType(Anomaly.AnomalyType anomalyType);

    List<Anomaly> findByTransaction_Id(Long transactionId);
}