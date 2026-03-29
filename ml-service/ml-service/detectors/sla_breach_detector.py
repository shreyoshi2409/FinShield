from datetime import datetime, timezone, timedelta
import pandas as pd

DAYS_AHEAD = 7

def detect_sla_breach_risks(transactions: list[dict]) -> list[dict]:
    if not transactions:
        return []

    df = pd.DataFrame(transactions)

    if "vendorName" in df.columns:
        df["vendor_name"] = df["vendorName"]
    if "dueDate" in df.columns:
        df["due_date"] = df["dueDate"]

    required_cols = {"id", "due_date", "status", "vendor_name", "amount"}
    if not required_cols.issubset(df.columns):
        return []

    df["status"] = df["status"].str.upper().str.strip()

    # Skip already flagged or duplicate transactions
    df = df[~df["status"].isin(["FLAGGED", "DUPLICATE"])]

    if df.empty:
        return []

    pending_df = df[df["status"] == "PENDING"].copy()

    if pending_df.empty:
        return []

    pending_df["due_date_parsed"] = pd.to_datetime(
        pending_df["due_date"], errors="coerce", utc=True
    )
    pending_df = pending_df.dropna(subset=["due_date_parsed"])

    if pending_df.empty:
        return []

    now = datetime.now(tz=timezone.utc)
    deadline = now + timedelta(days=DAYS_AHEAD)

    at_risk = pending_df[
        (pending_df["due_date_parsed"] >= now)
        & (pending_df["due_date_parsed"] <= deadline)
    ]

    anomalies = []

    for _, row in at_risk.iterrows():
        days_left = (row["due_date_parsed"] - now).days
        anomalies.append({
            "transactionId": int(row["id"]),
            "anomalyType": "SLA_BREACH_RISK",
            "severity": "HIGH",
            "description": (
                f"SLA breach risk: transaction for vendor '{row['vendor_name']}' "
                f"(amount {float(row['amount']):,.2f}) is PENDING with due date "
                f"{row['due_date']} — only {days_left} day(s) remaining."
            ),
            "status": "OPEN",
        })

    return anomalies