"""
Agent 3 — Decision Agent (LLM-powered)
For each saved anomaly, calls the Groq API to generate a
recommended_action + reasoning, then POSTs a skeleton decision
to Spring Boot (moneyAtRisk / moneySaveable filled later by Agent 4).
"""
import json
import logging
import os

from groq import Groq
import requests

logger = logging.getLogger(__name__)

MODEL = "llama3-8b-8192"

SYSTEM_PROMPT = (
    "You are a financial analyst AI. "
    "Respond ONLY with valid JSON — no markdown, no extra text."
)

USER_PROMPT_TEMPLATE = """Given this anomaly in a company's transactions, suggest a specific action to take.

Anomaly type: {anomaly_type}
Vendor: {vendor_name}
Amount: {amount}
Description: {description}

Respond in JSON with exactly these keys:
  "recommended_action": "<concise action string>",
  "reasoning": "<explanation>"
"""


def _call_groq(anomaly_type: str, vendor_name: str, amount: str, description: str) -> dict:
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))

    prompt = USER_PROMPT_TEMPLATE.format(
        anomaly_type=anomaly_type,
        vendor_name=vendor_name,
        amount=amount,
        description=description,
    )

    message = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ],
        max_tokens=512,
    )

    raw = message.choices[0].message.content.strip()

    # Strip any accidental markdown fences
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()

    return json.loads(raw)


def _get_transaction(spring_base_url: str, transaction_id: int) -> dict:
    try:
        resp = requests.get(
            f"{spring_base_url}/api/transactions/{transaction_id}", timeout=10
        )
        resp.raise_for_status()
        return resp.json()
    except requests.RequestException as exc:
        logger.warning(
            "[DecisionAgent] Could not fetch transaction %d: %s", transaction_id, exc
        )
        return {}


def run(
    saved_anomalies: list[dict],
    spring_base_url: str,
) -> list[dict]:
    logger.info("[DecisionAgent] Generating decisions for %d anomalies...", len(saved_anomalies))

    decisions = []

    for anomaly in saved_anomalies:
        anomaly_id     = anomaly.get("id")
        transaction_id = anomaly.get("transactionId") or anomaly.get("transaction_id")
        anomaly_type   = anomaly.get("anomalyType") or anomaly.get("anomaly_type", "OTHER")
        description    = anomaly.get("description", "")

        txn = _get_transaction(spring_base_url, transaction_id) if transaction_id else {}
        vendor_name = txn.get("vendorName") or txn.get("vendor_name", "Unknown Vendor")
        amount      = txn.get("amount", "N/A")

        try:
            llm_response = _call_groq(anomaly_type, vendor_name, str(amount), description)
            recommended_action = llm_response.get("recommended_action", "Review manually")
            reasoning          = llm_response.get("reasoning", "")
        except Exception as exc:
            logger.error("[DecisionAgent] Groq API error for anomaly %s: %s", anomaly_id, exc)
            recommended_action = "Manual review required"
            reasoning          = f"Automated analysis unavailable: {exc}"

        decision = {
            "anomalyId":         anomaly_id,
            "agentName":         "DecisionAgent",
            "recommendedAction": recommended_action,
            "reasoning":         reasoning,
            "moneyAtRisk":       0.0,
            "moneySaveable":     0.0,
            "_anomaly_type":     anomaly_type,
            "_transaction_id":   transaction_id,
            "_txn":              txn,
        }

        decisions.append(decision)
        logger.info(
            "[DecisionAgent] Decision for anomaly %s: %s", anomaly_id, recommended_action
        )

    return decisions