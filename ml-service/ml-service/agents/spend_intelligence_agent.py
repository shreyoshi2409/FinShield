"""
Agent 2 — Spend Intelligence Agent
Reads detected anomalies, scores them by severity, and returns
a sorted list with numeric priority scores attached.

Severity scoring:
  DUPLICATE_PAYMENT  → CRITICAL  → score 4
  COST_SPIKE         → HIGH      → score 3
  SLA_BREACH_RISK    → HIGH      → score 3
  OTHER              → MEDIUM    → score 2
  (anything else)    → LOW       → score 1
"""
import logging

logger = logging.getLogger(__name__)

SEVERITY_SCORE: dict[str, int] = {
    "CRITICAL": 4,
    "HIGH": 3,
    "MEDIUM": 2,
    "LOW": 1,
}

ANOMALY_TYPE_SEVERITY: dict[str, str] = {
    "DUPLICATE_PAYMENT": "CRITICAL",
    "COST_SPIKE": "HIGH",
    "SLA_BREACH_RISK": "HIGH",
    "VENDOR_OVERCHARGE": "HIGH",
    "OTHER": "MEDIUM",
}


def run(anomalies: list[dict]) -> list[dict]:
    """
    Attaches / normalises severity and adds a numeric `priority_score`
    to each anomaly. Returns anomalies sorted highest → lowest priority.
    """
    logger.info("[SpendIntelligenceAgent] Scoring %d anomalies...", len(anomalies))

    scored = []
    for anomaly in anomalies:
        anomaly_type = anomaly.get("anomalyType", "OTHER")
        # Use the type-driven severity if not already set properly
        severity = ANOMALY_TYPE_SEVERITY.get(anomaly_type, "LOW")
        anomaly["severity"] = severity
        anomaly["priority_score"] = SEVERITY_SCORE.get(severity, 1)
        scored.append(anomaly)

    scored.sort(key=lambda a: a["priority_score"], reverse=True)

    logger.info("[SpendIntelligenceAgent] Scoring complete.")
    return scored