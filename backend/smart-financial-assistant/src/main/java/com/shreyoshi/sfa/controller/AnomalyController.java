package com.shreyoshi.sfa.controller;

import com.shreyoshi.sfa.entity.Anomaly;
import com.shreyoshi.sfa.service.AnomalyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/anomalies")
@RequiredArgsConstructor
public class AnomalyController {

    private final AnomalyService anomalyService;

    @GetMapping
    public ResponseEntity<List<Anomaly>> getAll() {
        return ResponseEntity.ok(anomalyService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Anomaly> getById(@PathVariable Long id) {
        return ResponseEntity.ok(anomalyService.getById(id));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Anomaly>> getByStatus(@PathVariable Anomaly.AnomalyStatus status) {
        return ResponseEntity.ok(anomalyService.getByStatus(status));
    }

    @GetMapping("/severity/{severity}")
    public ResponseEntity<List<Anomaly>> getBySeverity(@PathVariable Anomaly.Severity severity) {
        return ResponseEntity.ok(anomalyService.getBySeverity(severity));
    }

    @GetMapping("/transaction/{transactionId}")
    public ResponseEntity<List<Anomaly>> getByTransactionId(@PathVariable Long transactionId) {
        return ResponseEntity.ok(anomalyService.getByTransactionId(transactionId));
    }

    @PostMapping
    public ResponseEntity<Anomaly> create(@RequestBody Anomaly anomaly) {
        return ResponseEntity.ok(anomalyService.save(anomaly));
    }
}