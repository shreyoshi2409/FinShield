"""
Agent 4 — Impact Math Agent
Calculates moneyAtRisk and moneySaveable for each decision.

Rules:
  DUPLICATE_PAYMENT  → money_at_risk = transaction amount
                        money_saveable = full amount (100 % recoverable)
  COST_SPIKE         → money_at_risk = (actual - vendor_average)
                        money_saveable = that difference
  SLA_BREACH_RISK    → money_at_risk = penalty if known, else ₹10,000 default
                        money_saveable = money_at_risk (avoid penalty entirely)
  Other / Unknown    → money_at_risk = transaction amount, money_saveable = 0
"""
import logging
import requests
import pandas as pd

logger = logging.getLogger(__name__)

DEFAULT_SLA_PENALTY = 10_000.0


def _vendor_average(spring_base_url: str, vendor_name: str) -> float:
    """Fetch all transactions for this vendor and return their average amount."""
    try:
        resp = requests.get(f"{spring_base_url}/api/transactions", timeout=10)
        resp.raise_for_status()
        txns = resp.json()
        df = pd.DataFrame(txns)
        if df.empty or "vendor_name" not in df.columns:
            return 0.0
        vendor_col = "vendor_name" if "vendor_name" in df.columns else "vendorName"
        df["amount"] = pd.to_numeric(df["amount"], errors="coerce")
        vendor_txns = df[df[vendor_col].str.lower() == vendor_name.lower()]
        return float(vendor_txns["amount"].mean()) if not vendor_txns.empty else 0.0
    except Exception as exc:
        logger.warning("[ImpactMathAgent] Could not compute vendor average: %s", exc)
        return 0.0


def run(decisions: list[dict], spring_base_url: str) -> list[dict]:
    """
    Mutates each decision dict in-place with correct moneyAtRisk / moneySaveable.
    Returns the enriched list.
    """
    logger.info("[ImpactMathAgent] Computing financial impact for %d decisions...", len(decisions))

    for decision in decisions:
        anomaly_type = decision.get("_anomaly_type", "OTHER")
        txn          = decision.get("_txn", {})

        raw_amount = txn.get("amount", 0)
        try:
            amount = float(raw_amount)
        except (TypeError, ValueError):
            amount = 0.0

        vendor_name = txn.get("vendorName") or txn.get("vendor_name", "")

        if anomaly_type == "DUPLICATE_PAYMENT":
            decision["moneyAtRisk"]   = amount
            decision["moneySaveable"] = amount

        elif anomaly_type == "COST_SPIKE":
            avg = _vendor_average(spring_base_url, vendor_name)
            excess = max(amount - avg, 0.0)
            decision["moneyAtRisk"]   = excess
            decision["moneySaveable"] = excess

        elif anomaly_type == "SLA_BREACH_RISK":
            # Use default penalty; could be replaced with actual SLA penalty lookup
            decision["moneyAtRisk"]   = DEFAULT_SLA_PENALTY
            decision["moneySaveable"] = DEFAULT_SLA_PENALTY

        else:
            decision["moneyAtRisk"]   = amount
            decision["moneySaveable"] = 0.0

        logger.info(
            "[ImpactMathAgent] Anomaly %s (%s) → atRisk=₹%.2f  saveable=₹%.2f",
            decision.get("anomalyId"), anomaly_type,
            decision["moneyAtRisk"], decision["moneySaveable"],
        )

    return decisions