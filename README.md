# AI FB MVP

Single-codebase MVP for automated Malay Facebook Page content generation, QA, publishing, metrics collection, and prompt optimization.

## Stack

- Next.js App Router
- Supabase Postgres
- Meta Graph API
- Vercel Cron
- OpenAI for structured draft generation and optional AI post images

## Core flow

1. `POST /api/workflows/daily-run`
2. Generate structured draft JSON
3. Run QA gate
4. If `SOFT_FAIL`, rewrite once and re-run QA
5. Optionally generate an AI image for the post
6. Format Facebook-ready text
7. Publish to Meta Graph API
8. `POST /api/workflows/collect-metrics`
9. Update prompt profile weights

## Project structure

- `app/api/generate`: generation endpoint
- `app/api/config`: page config read/write endpoint
- `app/api/runs`: recent runs and publish activity endpoint
- `app/api/workflows/daily-run`: orchestration entry for content generation and publishing
- `app/api/workflows/collect-metrics`: metrics and optimization entry
- `app/api/webhooks/meta`: Meta webhook verification stub
- `config/page-a.json`: editable per-page prompt and safety profile
- `app/config/page.tsx`: minimal admin config page
- `components/run-status-panel.tsx`: dashboard panel for recent runs and publishes
- `modules/*`: workflow modules
- `db/schema.sql`: Postgres schema for Supabase
- `RUNBOOK.md`: current operating notes and safe testing flow
- `types/workflow.ts`: shared workflow contracts
- `vercel.json`: cron schedule for publish and metrics jobs

## Setup

1. Install dependencies with `npm install`
2. Copy `.env.example` to `.env.local`
3. Apply [`db/schema.sql`](/Users/rms/Desktop/Ai Project/Ai FB/db/schema.sql) to Supabase
4. Run `npm run dev`

## What is stubbed

- LLM generation supports `mock` and `openai`; `mock` remains the safe default
- Publisher calls Meta Graph API when configured, otherwise returns a flagged mock publish result
- Metrics collector calls Meta Graph API only for `live` posts; mock posts are excluded from optimizer input
- Supabase persistence is wired for workflow runs, drafts, posts, and metric snapshots when env is configured

## Immediate next tasks

1. Add Gemini as a second real provider beside OpenAI
2. Show publish/metrics error states in the admin UI
3. Add per-page token storage and validation flow
4. Add a runs dashboard for recent workflow executions
