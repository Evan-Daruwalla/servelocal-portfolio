# ServeLocal — engineering process & frontend (public mirror)

ServeLocal connects student volunteers with community-service opportunities —
free forever for students. This repo is the **public mirror** of the v2 build:
the complete engineering-process documentation plus the frontend source. The
full application (FastAPI/Postgres backend) lives in a **private** repo; its
security-relevant internals (auth, guardian-consent mechanics, rate limiting,
billing webhooks, deploy runbook, secret registry) are deliberately not
published for a platform that serves minors.

## What's here

| Path | What it is |
|---|---|
| `project-history/` | The whole-project chronological record (v1 → v2), append-only, with its script-generated HTML twin — every decision, bug, and pivot, dated |
| `docs/record_2026-07-07.md` | The v2 build log: per-task WHAT/WHY/HOW entries, honest about failures and abandoned approaches |
| `HANDOFF.md` | The living project snapshot (status + workstream table) |
| `PRD_ROADMAP.md` | The standing milestone plan the build executes against (append-mostly: dropped work is struck through with dated reasons, never erased) |
| `docs/research/` | Sourced research briefs that fed design decisions |
| `.claude/codebase-memory/` | Binned technical memory (architecture, conventions, gotchas…) — `security.md` intentionally omitted |
| `frontend/` | The Next.js 15 / React 19 / TypeScript frontend — served to every browser anyway, so public by definition |

## Why the process is documented like this

The point of this project isn't just a working app — it's a demonstrable
engineering process: an append-only record where mistakes stay visible, dated
decisions, verification pasted rather than claimed, and docs a fresh
collaborator (or a cheaper model) can execute from without the author filling
gaps from memory.

*The build log and history mention env-variable names (e.g. `STRIPE_SECRET_KEY`);
no secret values have ever been committed to either repo — a scanner gates every
commit.*
