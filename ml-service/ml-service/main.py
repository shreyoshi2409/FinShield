import logging
import os

import requests
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler

load_dotenv()

from agents import (
    monitoring_agent,
    spend_intelligence_agent,
    decision_agent,
    impact_math_agent,
    action_agent,
    audit_agent,
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s — %(message)s",
)
logger = logging.getLogger(__name__)

SPRING_BASE_URL: str = os.getenv("SPRING_BOOT_BASE_URL", "http://localhost:8080")

app = FastAPI(
    title="Smart Financial Assistant — ML Service",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def run_pipeline():
    logger.info("=== Scheduled pipeline starting ===")
    try:
        transactions, raw_anomalies = monitoring_agent.run(SPRING_BASE_URL)
    except Exception as exc:
        logger.error("Scheduled pipeline failed: %s", exc)
        return

    if not raw_anomalies:
        logger.info("Scheduled run: no anomalies found.")
        return

    scored_anomalies = spend_intelligence_agent.run(raw_anomalies)

    saved_anomalies = []
    for anomaly in scored_anomalies:
        payload = {k: v for k, v in anomaly.items() if not k.startswith("_") and k != "priority_score"}
        try:
            resp = requests.post(f"{SPRING_BASE_URL}/api/anomalies", json=payload, timeout=10)
            resp.raise_for_status()
            saved_anomalies.append(resp.json())
        except requests.RequestException as exc:
            logger.error("Failed to save anomaly: %s", exc)

    if not saved_anomalies:
        return

    decisions = decision_agent.run(saved_anomalies, SPRING_BASE_URL)
    decisions = impact_math_agent.run(decisions, SPRING_BASE_URL)
    saved_decisions = action_agent.run(decisions, SPRING_BASE_URL)
    audit_agent.run(SPRING_BASE_URL, saved_anomalies, saved_decisions)

    logger.info("=== Scheduled pipeline complete ===")


scheduler = BackgroundScheduler()
scheduler.add_job(run_pipeline, "interval", minutes=60)
scheduler.start()


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/analyze")
def analyze():
    logger.info("=== Manual pipeline starting ===")

    try:
        transactions, raw_anomalies = monitoring_agent.run(SPRING_BASE_URL)
    except requests.RequestException as exc:
        raise HTTPException(status_code=502, detail=f"Cannot reach Spring Boot: {exc}")

    if not raw_anomalies:
        return {"anomalies_detected": 0, "decisions_created": 0, "status": "completed"}

    scored_anomalies = spend_intelligence_agent.run(raw_anomalies)

    saved_anomalies = []
    for anomaly in scored_anomalies:
        payload = {k: v for k, v in anomaly.items() if not k.startswith("_") and k != "priority_score"}
        try:
            resp = requests.post(f"{SPRING_BASE_URL}/api/anomalies", json=payload, timeout=10)
            resp.raise_for_status()
            saved_anomalies.append(resp.json())
        except requests.RequestException as exc:
            logger.error("Failed to save anomaly: %s", exc)

    if not saved_anomalies:
        return {"anomalies_detected": 0, "decisions_created": 0, "status": "completed"}

    decisions = decision_agent.run(saved_anomalies, SPRING_BASE_URL)
    decisions = impact_math_agent.run(decisions, SPRING_BASE_URL)
    saved_decisions = action_agent.run(decisions, SPRING_BASE_URL)
    audit_agent.run(SPRING_BASE_URL, saved_anomalies, saved_decisions)

    decisions_created = sum(1 for d in saved_decisions if not d.get("error"))

    return {
        "anomalies_detected": len(saved_anomalies),
        "decisions_created": decisions_created,
        "status": "completed",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)