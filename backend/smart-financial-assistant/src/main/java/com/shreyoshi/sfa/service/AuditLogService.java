package com.shreyoshi.sfa.service;

import com.shreyoshi.sfa.entity.AuditLog;
import com.shreyoshi.sfa.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLog log(String eventType, String entityType, Long entityId, String description) {
        AuditLog auditLog = AuditLog.builder()
                .eventType(eventType)
                .entityType(entityType)
                .entityId(entityId)
                .description(description)
                .performedBy("SYSTEM")
                .build();
        return auditLogRepository.save(auditLog);
    }

    public List<AuditLog> getAll() {
        return auditLogRepository.findAll();
    }

    public List<AuditLog> getByEntity(String entityType, Long entityId) {
        return auditLogRepository.findByEntityTypeAndEntityId(entityType, entityId);
    }

    public List<AuditLog> getByEventType(String eventType) {
        return auditLogRepository.findByEventType(eventType);
    }
}