import pandas as pd

SPIKE_THRESHOLD = 0.30

def detect_cost_spikes(transactions: list[dict]) -> list[dict]:
    if not transactions:
        return []

    df = pd.DataFrame(transactions)

    if "vendorName" in df.columns:
        df["vendor_name"] = df["vendorName"]
    if "vendor_name" not in df.columns:
        return []

    df["amount"] = pd.to_numeric(df["amount"], errors="coerce")
    df = df.dropna(subset=["amount"])

    # Skip already flagged or duplicate transactions
    if "status" in df.columns:
        df = df[~df["status"].str.upper().isin(["FLAGGED", "DUPLICATE"])]

    if df.empty:
        return []

    vendor_avg = df.groupby("vendor_name")["amount"].mean()

    anomalies = []

    for _, row in df.iterrows():
        avg = vendor_avg.get(row["vendor_name"])
        if avg is None or avg == 0:
            continue

        threshold_amount = avg * (1 + SPIKE_THRESHOLD)
        if row["amount"] > threshold_amount:
            excess = row["amount"] - avg
            pct_above = ((row["amount"] - avg) / avg) * 100

            anomalies.append({
                "transactionId": int(row["id"]),
                "anomalyType": "COST_SPIKE",
                "severity": "HIGH",
                "description": (
                    f"Cost spike detected for vendor '{row['vendor_name']}': "
                    f"transaction amount {row['amount']:,.2f} is "
                    f"{pct_above:.1f}% above vendor average of {avg:,.2f} "
                    f"(excess: {excess:,.2f})."
                ),
                "status": "OPEN",
            })

    return anomalies