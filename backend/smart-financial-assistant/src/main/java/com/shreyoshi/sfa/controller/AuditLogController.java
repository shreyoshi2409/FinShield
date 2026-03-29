package com.shreyoshi.sfa.controller;

import com.shreyoshi.sfa.entity.AuditLog;
import com.shreyoshi.sfa.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<List<AuditLog>> getAll() {
        return ResponseEntity.ok(auditLogService.getAll());
    }

    @GetMapping("/entity")
    public ResponseEntity<List<AuditLog>> getByEntity(
            @RequestParam String entityType,
            @RequestParam Long entityId) {
        return ResponseEntity.ok(auditLogService.getByEntity(entityType, entityId));
    }

    @GetMapping("/event")
    public ResponseEntity<List<AuditLog>> getByEventType(@RequestParam String eventType) {
        return ResponseEntity.ok(auditLogService.getByEventType(eventType));
    }
}