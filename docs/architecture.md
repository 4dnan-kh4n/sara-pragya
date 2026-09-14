# Architecture

SARA-PRAGYA uses a modular monorepo so clinical workflow code, research analysis, document processing, and AI integrations can evolve independently.

## Boundaries

- `apps/web` is the patient, clinician, and researcher interface. It never receives private provider credentials.
- `services/api` owns validation, authorization boundaries, clinical records, audit events, and stable HTTP contracts.
- `services/worker` is reserved for OCR, extraction, statistical analysis, and AI jobs. It is intentionally empty in Phase 1.
- `packages/contracts` contains browser-safe API response types.
- PostgreSQL is the system of record; Redis is for short-lived job state; encrypted object storage is for source documents.

## Request flow

The web application calls versioned API routes. The API validates the authenticated role, validates input, performs a database transaction, and emits an audit event. Slow work is queued and produces a versioned result that must be reviewed before downstream analysis.

## Provider independence

OCR, object storage, identity, and AI providers will be accessed through internal interfaces. Clinical tables and workflows must not depend on provider-specific payloads.

## Deployment principle

Web, API, worker, PostgreSQL, Redis, and object storage are independently deployable. All public communication must use encrypted transport. Secrets are injected by the deployment environment and are never embedded in web bundles.
