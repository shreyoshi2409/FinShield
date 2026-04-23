<div align="center">

<br/>

```
███████╗██╗███╗   ██╗███████╗██╗  ██╗██╗███████╗██╗     ██████╗ 
██╔════╝██║████╗  ██║██╔════╝██║  ██║██║██╔════╝██║     ██╔══██╗
█████╗  ██║██╔██╗ ██║███████╗███████║██║█████╗  ██║     ██║  ██║
██╔══╝  ██║██║╚██╗██║╚════██║██╔══██║██║██╔══╝  ██║     ██║  ██║
██║     ██║██║ ╚████║███████║██║  ██║██║███████╗███████╗██████╔╝
╚═╝     ╚═╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚═════╝ 
```

**AI-Powered Enterprise Financial Intelligence — Detect. Decide. Act.**

[![Hackathon](https://img.shields.io/badge/ET_AI_Hackathon_2026-Submission-orange?style=flat-square)](https://unstop.com)
[![Powered By](https://img.shields.io/badge/Powered_by-Avataar.ai-blueviolet?style=flat-square)](https://avataar.ai)
[![Problem](https://img.shields.io/badge/Problem_Statement-3-red?style=flat-square)](#)
[![Theme](https://img.shields.io/badge/Theme-AI_for_Enterprise_Cost_Intelligence-blue?style=flat-square)](#)
[![Stack](https://img.shields.io/badge/Stack-React_·_Spring_Boot_·_FastAPI_·_Python-green?style=flat-square)](#)
[![LLM](https://img.shields.io/badge/LLM-Grok_API-black?style=flat-square)](#)

<br/>

> *Traditional dashboards show you problems. Manual auditing reacts to problems.*  
> **FinShield detects, decides, and acts on problems — before they become losses.**

<br/>

</div>

---

## The Problem

Enterprises generate millions of financial transactions daily — across vendors, procurement pipelines, and internal systems. Yet:

- **Cost leakages go undetected** for weeks or months
- **Duplicate payments and overcharges** slip through manual audits
- **SLA breaches compound** into penalties before anyone notices
- **Financial decisions** are made on stale, delayed data

The result? Even a **2–5% inefficiency** in enterprise operations translates to **millions in preventable annual losses**.

---

## What FinShield Does

FinShield is a **24/7 autonomous financial watchdog** — an AI system that continuously monitors enterprise transaction data, surfaces cost leakages the moment they appear, and triggers corrective actions with full human oversight.

```
Upload Data → AI Detects Anomaly → Agents Decide Action → Manager Approves → System Executes → Audit Logged
```

It doesn't just flag problems. It tells you **exactly how much money is at risk**, **what to do about it**, and **executes the fix** the moment you approve.

---

## How It Works

### Step 1 — Data Ingestion
Upload transaction data (CSV / Excel) containing vendor payments, invoice details, and SLA deadlines. FinShield ingests and stores it via the Spring Boot backend into MySQL.

### Step 2 — AI Anomaly Detection
The Python ML layer scans every transaction against three detection engines:

| Engine | Trigger | Severity |
|---|---|---|
| Duplicate Payment Detector | Same vendor + same amount | 🔴 CRITICAL |
| Cost Spike Detector | >30% increase over baseline | 🟠 HIGH |
| SLA Breach Risk Detector | Deadline within threshold | 🟠 HIGH |

### Step 3 — Agentic Decision Pipeline
Six specialized agents form an autonomous reasoning loop:

```
Monitoring Agent       →  flags anomalies
Spend Intelligence Agent →  assigns severity + business context  
Decision Agent (LLM)   →  recommends corrective action via Grok API
Impact Math Agent      →  calculates ₹ recoverable amount
Action Agent           →  queues approved workflows for execution
Audit Agent            →  logs every step immutably
```

### Step 4 — Human-in-the-Loop Approval
The manager sees a clean UI card with:
- What was detected
- Why the AI flagged it
- How much money is at risk
- The recommended action

One click: **Approve** or **Reject**. Nothing executes without consent.

### Step 5 — Automated Execution
On approval: vendor emails sent, transactions flagged, workflows triggered. Every action is logged with full reasoning for compliance and audit.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                    │
│         Dashboard  ·  Approval UI  ·  Audit Logs        │
└────────────────────────┬────────────────────────────────┘
                         │ REST API
┌────────────────────────▼────────────────────────────────┐
│              ORCHESTRATION LAYER (Spring Boot)          │
│  API Gateway · Workflow Engine · Approval Manager       │
│  Action Executor · Audit Logger · MySQL Storage         │
└──────────┬─────────────────────────────┬────────────────┘
           │ ML Trigger                  │ Agent Calls
┌──────────▼──────────┐      ┌───────────▼───────────────┐
│  INTELLIGENCE LAYER │      │      AGENTIC LAYER        │
│  Python · FastAPI   │      │  6 Autonomous Agents      │
│  Anomaly Detection  │      │  LLM via Grok API         │
│  SLA Prediction     │      │  Agentic Loop (Detect →   │
│  Variance Analysis  │      │  Decide → Act → Log)      │
└─────────────────────┘      └───────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js |
| **Backend / Orchestration** | Spring Boot, MySQL |
| **AI Services** | FastAPI, Python, Pandas |
| **ML / Detection** | Rule-based engines, statistical variance |
| **LLM** | Grok API |
| **Testing** | Postman |

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/upload-data` | Ingest CSV/Excel transaction file |
| `GET` | `/transactions` | List all ingested transactions |
| `POST` | `/run-agents` | Trigger the full agentic pipeline |
| `GET` | `/anomalies` | Fetch detected anomalies |
| `POST` | `/approve-action` | Submit human approval decision |
| `POST` | `/execute-action` | Execute approved corrective action |
| `GET` | `/audit-logs` | Retrieve full audit trail |
| `GET` | `/impact-summary` | Get ₹ financial impact summary |

---

## Database Schema

```
transactions      — raw ingested financial records
vendors           — vendor master data
sla_records       — SLA deadlines and terms
anomalies         — detected issues with severity
agent_decisions   — AI reasoning and recommendations
actions           — approved and executed workflows
audit_logs        — immutable system-wide event log
```

---

## FinShield vs. The Alternatives

| Capability | Traditional Dashboards | Manual Auditing | **FinShield** |
|---|:---:|:---:|:---:|
| Real-time monitoring | ❌ | ❌ | ✅ |
| Automated anomaly detection | ⚠️ Limited | ⚠️ Manual | ✅ AI-driven |
| Proactive cost leakage detection | ❌ | ⚠️ Delayed | ✅ Real-time |
| Financial impact quantification (₹) | ❌ | ❌ | ✅ |
| AI-assisted decision making | ❌ | ❌ | ✅ |
| Automated action execution | ❌ | ❌ | ✅ With approval |
| Human-in-the-loop control | ❌ | ✅ | ✅ |
| Full audit trail | ⚠️ Limited | ⚠️ Manual logs | ✅ Immutable |
| Scalability | ⚠️ Moderate | ❌ Low | ✅ High |
| Speed | ❌ Slow | ❌ Very slow | ✅ Real-time |

---

## Design Principles

**Agentic Loop** — Every cycle: Detect → Decide → Act → Log → Repeat. No human bottleneck in the detection phase.

**Human-in-the-Loop** — No financial action executes without explicit manager approval. Enterprise-safe by design.

**Full Transparency** — Every AI recommendation includes its reasoning. Every action is logged. Nothing is a black box.

**Quantifiable Impact** — The system doesn't just flag issues; it tells you exactly how much money is recoverable in rupees.

---

## Roadmap

- [ ] Real-time streaming data integration (Kafka / Flink)
- [ ] ERP integration — SAP, Oracle, Tally
- [ ] Advanced ML models for anomaly detection (Isolation Forest, Autoencoders)
- [ ] Autonomous financial agents with multi-step reasoning
- [ ] Multi-currency and cross-border transaction support
- [ ] Role-based access control and SSO

---

## Team

Built for **ET AI Hackathon 2026** · Problem Statement #3  
Theme: *AI for Enterprise Cost Intelligence & Autonomous Action*  
Powered by **Avataar.ai** × **Unstop**

---

<div align="center">

*FinShield is not just a monitoring tool — it is a decision-making system for financial optimization.*

</div>
