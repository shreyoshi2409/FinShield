package com.shreyoshi.sfa.service;

import com.shreyoshi.sfa.entity.Anomaly;
import com.shreyoshi.sfa.repository.AnomalyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnomalyService {

    private final AnomalyRepository anomalyRepository;

    public Anomaly save(Anomaly anomaly) {
        return anomalyRepository.save(anomaly);
    }

    public List<Anomaly> getAll() {
        return anomalyRepository.findAll();
    }

    public Anomaly getById(Long id) {
        return anomalyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Anomaly not found with id: " + id));
    }

    public List<Anomaly> getByStatus(Anomaly.AnomalyStatus status) {
        return anomalyRepository.findByStatus(status);
    }

    public List<Anomaly> getBySeverity(Anomaly.Severity severity) {
        return anomalyRepository.findBySeverity(severity);
    }

    public List<Anomaly> getByTransactionId(Long transactionId) {
        return anomalyRepository.findByTransaction_Id(transactionId);
    }
}