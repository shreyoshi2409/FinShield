# FinShield — Smart Financial Assistant

AI-powered financial intelligence dashboard. Automatically detects duplicate payments, cost spikes, and SLA breaches — with human approval and full audit trail.

---

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui
- **Charts:** Recharts
- **Animations:** Framer Motion
- **HTTP Client:** Axios
- **Backend:** Spring Boot on `http://localhost:8080`

---

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Spring Boot backend running on port 8080
- Python ML service running on port 8000

### Install & Run

```bash
# Install dependencies
npm install

# Start development server (runs on port 3000)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard — live stats, anomaly feed, chart |
| `/upload` | Upload CSV to trigger ML pipeline |
| `/approvals` | Approve or reject pending AI decisions |
| `/audit` | Full audit log trail |

---

## API Configuration

The backend base URL is set in `src/lib/api.ts`:

```ts
const api = axios.create({
  baseURL: 'http://localhost:8080',
});
```

Change the `baseURL` here if your backend runs on a different host/port.

---

## Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.
