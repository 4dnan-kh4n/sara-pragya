# SARA-PRAGYA

SARA-PRAGYA is a research-oriented clinical decision-support platform designed to study relationships between classical Dhātu Sāratā observations and measurable physiological and clinical parameters.

> SARA-PRAGYA is not a diagnostic system. Its future analytical output must be reviewed by a qualified healthcare professional and must not replace clinical examination, laboratory interpretation, or diagnosis.

## Phase 1 status

This repository currently contains the project foundation:

- a responsive Next.js web shell and original brand system;
- public, assessment, research, administration, and disclaimer routes;
- a FastAPI service with configuration, health checks, safe error responses, and security headers;
- a stateless API for PDF processing, AI analysis, and downloadable research reports;
- environment templates, local service definitions, and architecture documentation;
- automated web and API tests.

Questionnaires, document uploads, OCR, AI analysis, and clinical reports are intentionally not implemented in Phase 1.

## Local development

### Web

Install workspace dependencies with `pnpm install`, then run `pnpm dev:web`. The web application is served at `http://localhost:3000`.

### API

From `services/api`, create a Python environment, install the project with its development dependencies, copy the root `.env.example` to `.env`, and run `uvicorn app.main:app --reload`. The API is served at `http://localhost:8000`; its health endpoint is `/api/v1/health`.

The current API is stateless: assessment data remains in the browser session and is not saved to a database.

## Verification

- Web: `pnpm lint:web`, `pnpm typecheck:web`, `pnpm test:web`, `pnpm build:web`
- API: run `pytest` and `ruff check .` from `services/api`

See the `docs` directory for architecture, database, safety, security, and testing decisions.
