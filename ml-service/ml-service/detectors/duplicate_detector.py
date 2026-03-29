import pandas as pd

def detect_duplicates(transactions: list[dict]) -> list[dict]:
    if not transactions:
        return []

    df = pd.DataFrame(transactions)

    if "vendorName" in df.columns:
        df["vendor_name"] = df["vendorName"]
    if "vendor_name" not in df.columns:
        return []

    df["amount"] = pd.to_numeric(df["amount"], errors="coerce")

    # Only check PENDING or PAID transactions — skip already FLAGGED ones
    if "status" in df.columns:
        df = df[~df["status"].str.upper().isin(["FLAGGED", "DUPLICATE"])]

    duplicates = df[df.duplicated(subset=["vendor_name", "amount"], keep=False)].copy()

    anomalies = []
    seen_pairs = set()

    for _, row in duplicates.iterrows():
        key = (row["vendor_name"], row["amount"])
        if key in seen_pairs:
            continue
        seen_pairs.add(key)

        group = duplicates[
            (duplicates["vendor_name"] == row["vendor_name"])
            & (duplicates["amount"] == row["amount"])
        ]
        transaction_ids = group["id"].tolist()

        for txn_id in transaction_ids[1:]:
            anomalies.append({
                "transactionId": int(txn_id),
                "anomalyType": "DUPLICATE_PAYMENT",
                "severity": "CRITICAL",
                "description": (
                    f"Duplicate payment detected: vendor '{row['vendor_name']}' "
                    f"charged {row['amount']:,.2f} multiple times "
                    f"(transaction IDs: {', '.join(str(i) for i in transaction_ids)})."
                ),
                "status": "OPEN",
            })

    return anomalies