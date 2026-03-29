package com.shreyoshi.sfa.controller;

import com.shreyoshi.sfa.entity.Transaction;
import com.shreyoshi.sfa.service.AuditLogService;
import com.shreyoshi.sfa.service.CsvUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UploadController {

    private final CsvUploadService csvUploadService;
    private final AuditLogService auditLogService;
    private final RestTemplate restTemplate;

    @Value("${ml.service.url:http://localhost:8000}")
    private String mlServiceUrl;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadCSV(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Step 1 — Save transactions
        List<Transaction> transactions = csvUploadService.uploadCSV(file);

        // Step 2 — Log the upload
        auditLogService.log(
                "CSV_UPLOADED",
                "Transaction",
                null,
                transactions.size() + " transactions uploaded from file: " + file.getOriginalFilename()
        );

        // Step 3 — Auto-trigger ML pipeline
        Map<String, Object> mlResult = new HashMap<>();
        try {
            mlResult = restTemplate.postForObject(
                    mlServiceUrl + "/analyze",
                    null,
                    Map.class
            );
            auditLogService.log(
                    "ML_PIPELINE_TRIGGERED",
                    "MLService",
                    null,
                    "ML pipeline triggered automatically after upload. Result: " + mlResult
            );
        } catch (Exception e) {
            mlResult.put("error", "ML service unavailable: " + e.getMessage());
        }

        // Step 4 — Return combined response
        Map<String, Object> response = new HashMap<>();
        response.put("transactions_uploaded", transactions.size());
        response.put("ml_pipeline", mlResult);

        return ResponseEntity.ok(response);
    }
}