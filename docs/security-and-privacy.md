# Security and privacy baseline

SARA-PRAGYA handles potentially sensitive health information. Production use requires a deployment-specific privacy, security, consent, and regulatory review.

## Phase 1 controls

- Environment variables are validated at startup.
- Production refuses local SQLite configuration and wildcard CORS origins.
- API responses include baseline security headers and request identifiers.
- Raw exception messages are not returned to clients.
- Role and audit entities are present before protected clinical workflows are added.
- Secrets and local databases are excluded from source control.

## Required controls for later phases

- OIDC authentication with short-lived sessions and multi-factor support.
- Least-privilege role-based authorization.
- Encryption in transit and at rest with managed key rotation.
- Signed, short-lived document access URLs.
- Upload quarantine, magic-byte validation, malware scanning, and size limits.
- Immutable access and correction audit trails.
- Configurable retention, consent withdrawal, and de-identification workflows.
- Explicit approval before identifiable data is sent to any external AI provider.

No real patient data should be entered into a development or demonstration environment.
