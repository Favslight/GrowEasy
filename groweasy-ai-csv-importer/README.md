# LeadSense

**AI-powered CRM Lead Importer** — upload any CSV, preview it instantly, and let AI extract structured CRM records ready for your workflow.

LeadSense is a full-stack SaaS-style application that parses messy lead exports in the browser, processes them on a stateless backend, and uses OpenAI Structured Outputs to produce validated CRM records — with a polished results dashboard, exports, and production deployment support.

---

## Features

- **CSV Upload & Preview** — drag-and-drop or browse; client-side parsing with PapaParse
- **Validation** — file type, size (10 MB), empty file, and parse error handling
- **Backend Processing** — parse, normalize, chunk (50 rows/batch), all in memory
- **AI Extraction** — OpenAI Structured Outputs mapped to full GrowEasy CRM schema (15 fields)
- **Results Dashboard** — analytics cards, CRM table (search, pagination, column toggle), record drawer
- **Skipped Records** — collapsible section with reasons and raw data preview
- **Export** — download CRM records and skipped rows as CSV or JSON
- **Dark Mode** — system preference on first load, persisted via localStorage
- **Production Ready** — Render deployment blueprint, health checks, CORS, environment config

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js 15, React 19, TypeScript, Tailwind CSS, TanStack Table, PapaParse, react-dropzone |
| **Backend** | Node.js, Express, TypeScript, Multer, PapaParse, Zod |
| **AI** | OpenAI SDK (Structured Outputs), provider abstraction pattern |
| **Deployment** | Render (frontend + backend) |

---

## Project Structure

```
groweasy-ai-csv-importer/
├── frontend/          # Next.js application
│   └── src/
│       ├── app/       # Pages and layout
│       ├── components/# UI components (upload, preview, dashboard)
│       ├── hooks/     # React hooks (upload, theme, timeline)
│       ├── lib/       # CSV parsing, export, display helpers
│       ├── services/  # API client
│       └── types/     # TypeScript interfaces
├── backend/           # Express API
│   └── src/
│       ├── config/    # Environment, OpenAI, CRM constants
│       ├── controllers/
│       ├── middleware/
│       ├── providers/ # AIProvider + OpenAIProvider
│       ├── prompts/v1/
│       ├── routes/
│       ├── schemas/   # Zod + JSON Schema
│       ├── services/  # Import pipeline
│       └── types/
├── docs/
│   └── architecture.md
└── render.yaml        # Render deployment blueprint
```

See [docs/architecture.md](docs/architecture.md) for detailed architecture documentation.

---

## Installation

### Prerequisites

- Node.js 18+
- npm
- OpenAI API key (for AI extraction)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env — set OPENAI_API_KEY
npm run dev
```

API runs at `http://localhost:5000`.

### Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local — set NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev
```

App runs at `http://localhost:3000`.

---

## Environment Variables

### Frontend (`.env.local`)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000` |

### Backend (`.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` |
| `OPENAI_MODEL` | Model for extraction | `gpt-4o-mini` |
| `FRONTEND_URL` | Allowed CORS origin(s), comma-separated | `http://localhost:3000` |

---

## Running Locally

1. Start the backend: `cd backend && npm run dev`
2. Start the frontend: `cd frontend && npm run dev`
3. Open `http://localhost:3000`
4. Upload a CSV → preview → Confirm Import → view AI results

---

## Deployment

### Deploying to Render

1. Push the repository to GitHub
2. Create a new **Blueprint** from `render.yaml` in the Render dashboard
3. Set environment variables:
   - **Backend:** `OPENAI_API_KEY`, `FRONTEND_URL` (your frontend URL)
   - **Frontend:** `NEXT_PUBLIC_API_URL` (your backend URL, e.g. `https://leadsense-api.onrender.com`)
4. Deploy both services

The backend health check is available at `GET /health`.

### Alternative: Vercel (Frontend) + Render (Backend)

- Deploy **frontend** to Vercel with `NEXT_PUBLIC_API_URL` pointing to your Render backend
- Deploy **backend** to Render with `FRONTEND_URL` set to your Vercel URL
- Add both URLs to `FRONTEND_URL` if using multiple origins: `https://app.vercel.app,https://backup.onrender.com`

---

## GrowEasy CRM Fields

The AI extracts all 15 GrowEasy CRM fields per the assignment spec:

| Field | Description |
|-------|-------------|
| `created_at` | Lead creation date (must parse via `new Date()`) |
| `name` | Lead name |
| `email` | Primary email |
| `country_code` | Country dialing code (e.g. +91) |
| `mobile_without_country_code` | Mobile without country code |
| `company` | Company name |
| `city` | City |
| `state` | State |
| `country` | Country |
| `lead_owner` | Lead owner |
| `crm_status` | `GOOD_LEAD_FOLLOW_UP`, `DID_NOT_CONNECT`, `BAD_LEAD`, `SALE_DONE` |
| `crm_note` | Notes, extra contacts, unmapped data |
| `data_source` | `leads_on_demand`, `meridian_tower`, `eden_park`, `varah_swamy`, `sarjapur_plots` |
| `possession_time` | Property possession time |
| `description` | Additional description |

**Skip rule:** Rows with neither email nor mobile are skipped. Rows with at least one contact method are imported.

**Excel files:** Export from Excel as `.csv` before upload (native `.xlsx` is not supported).

---

## API Documentation

### `GET /health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "LeadSense API",
  "version": "1.0.0"
}
```

### `POST /api/import`

Upload a CSV file for parsing, normalization, chunking, and AI extraction.

**Request:** `multipart/form-data` with field `file` (single `.csv` file, max 10 MB)

**Success Response:**
```json
{
  "success": true,
  "message": "CSV processed successfully.",
  "filename": "contacts.csv",
  "summary": {
    "imported": 214,
    "skipped": 9,
    "failedBatches": 0
  },
  "records": [
    {
      "created_at": "2026-05-13 14:20:48",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "country_code": "+91",
      "mobile_without_country_code": "9876543210",
      "company": "GrowEasy",
      "city": "Mumbai",
      "state": "Maharashtra",
      "country": "India",
      "lead_owner": "test@gmail.com",
      "crm_status": "GOOD_LEAD_FOLLOW_UP",
      "crm_note": "Client is asking to reschedule demo",
      "data_source": "leads_on_demand",
      "possession_time": "",
      "description": ""
    }
  ],
  "skipped": [
    {
      "name": "Jane",
      "email": "",
      "country_code": "",
      "mobile_without_country_code": "",
      "reason": "Missing email and mobile"
    }
  ]
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Only CSV files are allowed."
}
```

---

## AI Architecture

```
Upload → Parse → Normalize → Chunk (50) → Prompt Builder → OpenAI Provider
  → Structured Output Validator → Retry Service → Response Formatter
```

| Stage | Responsibility |
|-------|---------------|
| **CSV Parser** | PapaParse with headers, skip empty lines |
| **Normalizer** | Trim whitespace, clean headers, normalize line endings |
| **Chunk Service** | Split into batches of 50 (configurable) |
| **Prompt Builder** | System + user prompts with CRM schema and rules |
| **AI Provider** | OpenAI Structured Outputs via `AIProvider` interface |
| **Validator** | Zod schema validation on every AI response |
| **Retry Service** | Max 2 retries for validation/transient failures |

See [docs/architecture.md](docs/architecture.md) for design decisions.

---

## Screenshots

> Add screenshots after deployment:

| Screen | Description |
|--------|-------------|
| Landing Page | Hero section with import CTA |
| Upload | Drag-and-drop CSV upload card |
| CSV Preview | Summary cards and preview table |
| AI Processing | Animated processing timeline |
| Results Dashboard | Analytics, CRM table, exports |

---

## Future Improvements

- Multiple AI providers (Gemini, Claude) via `AIProvider` interface
- Import history and saved sessions (requires database)
- Background job processing for very large files
- User authentication and team workspaces
- Webhook notifications on import completion

---

## License

ISC
