# LeadSense Architecture

This document describes the architecture of the LeadSense application — a stateless, AI-powered CRM lead importer.

---

## Folder Structure

```
frontend/src/
  app/              Next.js App Router (page, layout, globals)
  components/
    dashboard/      Results dashboard (timeline, table, exports)
    preview/        CSV preview table and summary cards
    upload/         Dropzone and upload card
    ui/             Shared UI (empty state, spinner, theme toggle)
  hooks/            useCsvUpload, useTheme, useProcessingTimeline
  lib/              csv parsing, export, crm-display helpers
  services/         API client (fetch wrapper)
  types/            TypeScript interfaces

backend/src/
  config/           env validation, OpenAI client, CRM constants
  controllers/      Thin HTTP handlers
  middleware/       Upload, error handling, 404
  providers/        AIProvider interface + OpenAIProvider
  prompts/v1/       Versioned prompt templates
  routes/           Express route definitions
  schemas/          Zod schemas + JSON Schema for Structured Outputs
  services/         Business logic (parser, normalizer, chunker, extraction)
  types/            Shared TypeScript types
  utils/            Logger, HTTP errors
```

---

## Backend Architecture

Layered architecture with single-responsibility services:

```
ImportController
  → ImportService (orchestrator)
    → CsvParserService
    → CsvNormalizer
    → ChunkService
    → ExtractionService
      → RetryService
        → AIProvider (OpenAIProvider)
        → StructuredOutputValidator
    → ImportResponseFormatter
```

**Controllers** receive HTTP requests and return JSON. No business logic.

**Services** contain all processing logic. Each service has one job.

**Providers** abstract AI backends. The application depends only on `AIProvider`, not OpenAI directly.

---

## Frontend Architecture

Single-page application with section-based layout:

```
page.tsx (state orchestration)
  → useCsvUpload (browser-side CSV parse + file state)
  → useProcessingTimeline (stage progression UI)
  → useTheme (dark/light mode)
  → Components (presentational, receive props)
  → services/api.ts (backend communication)
```

State is managed with React hooks only — no Redux, Zustand, or Context API.

Large components (CRM table) are lazy-loaded via `next/dynamic`.

---

## Import Pipeline

1. **Upload** — Multer memory storage, single `.csv` file, max 10 MB
2. **Parse** — PapaParse with `header: true`, `skipEmptyLines: true`
3. **Normalize** — Trim values, clean headers, collapse whitespace
4. **Chunk** — Split into batches of 50 records
5. **Extract** — Each batch sent to AI via provider abstraction
6. **Validate** — Zod schema check on every AI response
7. **Retry** — Up to 2 retries on validation/transient failures
8. **Format** — Aggregate results into API response

Failed batches do not terminate the import. Configuration errors (missing API key) fail fast.

---

## AI Pipeline

```
PromptBuilder (system + user prompts)
  → OpenAIProvider (Structured Outputs, json_schema strict mode)
  → StructuredOutputValidator (Zod)
  → RetryService (bounded retries)
```

**Prompt versioning** lives in `prompts/v1/`. To change extraction behavior, create `prompts/v2/` without modifying the provider.

**CRM schema** is defined once in `config/crm.ts` (enums) and `schemas/crm.schema.ts` (Zod + JSON Schema). Prompts, validation, and Structured Outputs all derive from the same source.

---

## Design Decisions

### Why Stateless?

- No database means zero infrastructure overhead for the assignment scope
- Files are processed entirely in memory and discarded after the response
- Horizontal scaling is trivial — any instance can handle any request
- No session management, no data retention concerns

### Why AI in Batches?

- OpenAI context windows have limits; 50-row chunks stay within safe bounds
- Failed batches are isolated — one bad chunk doesn't kill the entire import
- Retry logic operates per-batch, minimizing wasted API calls
- Processing time scales linearly and predictably

### Why Abstract OpenAI?

- `AIProvider` interface allows swapping to Gemini, Claude, or a mock for testing
- Business logic (ImportService, ExtractionService) never imports OpenAI directly
- Prompt text lives in `prompts/`, not in the provider — separation of concerns
- Unit testing the pipeline without API calls becomes possible

### Why Structured Outputs + Zod?

- OpenAI Structured Outputs constrain the model to a JSON schema — dramatically reducing malformed responses
- Zod validation is a second safety net — never trust AI output without validation
- Both layers derive from the same CRM constants — no schema drift

### Why No Database?

- Assignment scope is upload → extract → display → export
- Import history, authentication, and persistence are explicitly deferred to future phases
- Keeps deployment simple (no Postgres/Redis on Render free tier)

---

## Deployment Architecture

```
[Browser] → [Next.js on Render/Vercel] → [Express on Render]
                                              ↓
                                         [OpenAI API]
```

- Frontend: static + SSR via Next.js `npm start`
- Backend: `node dist/server.js`, binds `0.0.0.0`
- CORS: `FRONTEND_URL` env var (comma-separated for multiple origins)
- Health check: `GET /health` for Render uptime monitoring
