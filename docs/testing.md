# Testing strategy

## Automated

- Web type checking, linting, component tests, and production build.
- API linting, configuration tests, route tests, model constraint tests, and migration checks.
- Contract tests for browser-safe API response shapes.
- Accessibility checks for landmarks, labels, focus visibility, reduced motion, and color contrast.

## Integration

- Web-to-API health check.
- Migration against a clean PostgreSQL database when local infrastructure is available.
- Error-state behavior when the API is unavailable.

## Manual release check

- Verify all route shells at desktop and mobile widths.
- Navigate with keyboard only and confirm focus remains visible.
- Confirm the disclaimer is visible on clinical entry points.
- Confirm no horizontal scrolling at common mobile widths.
- Confirm no credentials or patient data appear in client assets, logs, or fixtures.

Each completed phase records commands, pass/fail status, developer observations, and repeatable manual steps.
