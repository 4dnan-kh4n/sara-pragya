# Database foundation

The initial schema creates users, roles, user-role assignments, patients, assessments, and immutable audit events. Later phases add domain-specific tables through reviewed migrations.

## Core rules

- Primary keys use UUIDs except for compact reference tables.
- Each patient receives an anonymized `research_id` independent of direct identity data.
- Direct identifiers, if later required, are stored separately as encrypted ciphertext.
- Assessments keep an explicit workflow state and current step.
- Clinical data is normalized; JSON is limited to non-clinical metadata and versioned raw provider payloads.
- Derived results always retain the configuration, question-bank, prompt, and model version that produced them.
- Research exports operate on de-identified, versioned dataset snapshots.

## Phase 1 entities

`users`, `roles`, `user_roles`, `patients`, `assessments`, and `audit_events`.

The migration targets PostgreSQL. Automated tests use isolated SQLite databases to verify model constraints without requiring developers to install infrastructure before running the test suite.
