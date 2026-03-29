"""
Agent 6 — Audit Agent
Logs each significant pipeline event to Spring Boot's audit_logs table
via a POST /api/audit-logs endpoint.

If the Spring Boot endpoint does not yet exist, the agent will log a
warning and continue — it never raises, so the pipeline is never blocked.
"""
import logging
import requests
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

AGENT_NAME = "AuditAgent"


def _post_log(spring_base_url: str, payload: dict) -> None:
    try:
        resp = requests.post(
            f"{spring_base_url}/api/audit-logs",
            json=payload,
            timeout=10,
        )
        resp.raise_for_status()
        logger.debug("[AuditAgent] Log posted: %s", payload.get("action"))
    except requests.RequestException as exc:
        logger.warning("[AuditAgent] Could not post audit log: %s", exc)


def log_anomaly(spring_base_url: str, anomaly: dict) -> None:
    payload = {
        "performedBy": AGENT_NAME,
        "action": "ANOMALY_DETECTED",
        "entityType": "ANOMALY",
        "entityId": anomaly.get("id"),
        "details": (
            f"Anomaly detected — type: {anomaly.get('anomalyType')}, "
            f"severity: {anomaly.get('severity')}, "
            f"transaction_id: {anomaly.get('transactionId')}. "
            f"{anomaly.get('description', '')}"
        ),
        "timestamp": datetime.now(tz=timezone.utc).isoformat(),
    }
    _post_log(spring_base_url, payload)


def log_decision(spring_base_url: str, decision: dict) -> None:
    payload = {
        "performedBy": AGENT_NAME,
        "action": "DECISION_CREATED",
        "entityType": "AGENT_DECISION",
        "entityId": decision.get("id"),
        "details": (
            f"Decision saved — anomaly_id: {decision.get('anomalyId')}, "
            f"agent: {decision.get('agentName')}, "
            f"action: {decision.get('recommendedAction')}, "
            f"money_at_risk: ₹{decision.get('moneyAtRisk', 0):,.2f}, "
            f"money_saveable: ₹{decision.get('moneySaveable', 0):,.2f}, "
            f"status: PENDING_APPROVAL."
        ),
        "timestamp": datetime.now(tz=timezone.utc).isoformat(),
    }
    _post_log(spring_base_url, payload)


def log_pipeline_summary(spring_base_url: str, anomaly_count: int, decision_count: int) -> None:
    payload = {
        "performedBy": AGENT_NAME,
        "action": "PIPELINE_COMPLETED",
        "entityType": "PIPELINE",
        "entityId": None,
        "details": (
            f"ML pipeline completed — {anomaly_count} anomalies detected, "
            f"{decision_count} decisions created."
        ),
        "timestamp": datetime.now(tz=timezone.utc).isoformat(),
    }
    _post_log(spring_base_url, payload)


def run(
    spring_base_url: str,
    saved_anomalies: list[dict],
    saved_decisions: list[dict],
) -> None:
    """
    Logs each anomaly and each decision, then logs a pipeline summary.
    Never raises — silently swallows errors so the pipeline always completes.
    """
    logger.info("[AuditAgent] Logging %d anomalies and %d decisions...",
                len(saved_anomalies), len(saved_decisions))

    for anomaly in saved_anomalies:
        log_anomaly(spring_base_url, anomaly)

    for decision in saved_decisions:
        log_decision(spring_base_url, decision)

    log_pipeline_summary(spring_base_url, len(saved_anomalies), len(saved_decisions))

    logger.info("[AuditAgent] Audit logging complete.")