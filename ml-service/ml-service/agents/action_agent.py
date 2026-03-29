"""
Agent 5 — Action Agent
Saves each decision to Spring Boot via POST /api/decisions/save.
Does NOT auto-execute — sets approval_status = PENDING_APPROVAL.
Human must approve via Spring Boot API before execution.
"""
import logging
import requests

logger = logging.getLogger(__name__)


def _clean_for_post(decision: dict) -> dict:
    """Strip private metadata keys (prefixed with _) before sending to Spring Boot."""
    return {k: v for k, v in decision.items() if not k.startswith("_")}


def run(decisions: list[dict], spring_base_url: str) -> list[dict]:
    """
    POSTs each decision to POST /api/decisions/save.
    Returns list of saved decision responses from Spring Boot.
    """
    logger.info("[ActionAgent] Saving %d decisions (PENDING_APPROVAL)...", len(decisions))

    saved_decisions = []

    for decision in decisions:
        payload = _clean_for_post(decision)

        try:
            resp = requests.post(
                f"{spring_base_url}/api/decisions/save",
                json=payload,
                timeout=10,
            )
            resp.raise_for_status()
            saved = resp.json()
            saved_decisions.append(saved)
            logger.info(
                "[ActionAgent] Saved decision for anomaly %s → decision id %s (PENDING_APPROVAL)",
                decision.get("anomalyId"), saved.get("id"),
            )
        except requests.RequestException as exc:
            logger.error(
                "[ActionAgent] Failed to save decision for anomaly %s: %s",
                decision.get("anomalyId"), exc,
            )
            # Still append partial info so audit agent can log the attempt
            saved_decisions.append({
                "anomalyId": decision.get("anomalyId"),
                "error": str(exc),
                "saved": False,
            })

    return saved_decisions