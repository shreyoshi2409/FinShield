"""
Agent 1 — Monitoring Agent
Fetches all transactions from Spring Boot and runs the 3 detection engines.
Returns raw anomaly dicts (not yet saved to DB).
"""
import logging
import requests
from detectors import detect_duplicates, detect_cost_spikes, detect_sla_breach_risks

logger = logging.getLogger(__name__)


def run(spring_base_url: str) -> tuple[list[dict], list[dict]]:
    """
    Returns:
        transactions  — raw list fetched from Spring Boot
        anomalies     — list of anomaly dicts (not yet persisted)
    """
    logger.info("[MonitoringAgent] Fetching transactions from Spring Boot...")

    try:
        resp = requests.get(f"{spring_base_url}/api/transactions", timeout=10)
        resp.raise_for_status()
        transactions = resp.json()
    except requests.RequestException as exc:
        logger.error("[MonitoringAgent] Failed to fetch transactions: %s", exc)
        raise

    logger.info("[MonitoringAgent] Fetched %d transactions.", len(transactions))

    duplicates   = detect_duplicates(transactions)
    cost_spikes  = detect_cost_spikes(transactions)
    sla_risks    = detect_sla_breach_risks(transactions)

    anomalies = duplicates + cost_spikes + sla_risks

    logger.info(
        "[MonitoringAgent] Detected %d anomalies "
        "(%d duplicates, %d cost spikes, %d SLA risks).",
        len(anomalies), len(duplicates), len(cost_spikes), len(sla_risks),
    )

    return transactions, anomalies