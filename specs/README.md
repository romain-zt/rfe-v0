# Specs — Spec-Driven Development

Every non-trivial change starts with a spec **before** implementation.

## Spec format

Each spec follows this structure:

1. **Context** — what exists today, why the change is needed
2. **Acceptance criteria** — measurable "done" conditions
3. **API / Interface contracts** — exported types, function signatures, package entry points
4. **File structure** — expected directory tree after implementation
5. **Verification checklist** — commands to run, manual checks, build gates

## Naming

Specs are numbered sequentially: `NN-feature-name.md`

## Workflow

1. Write the spec
2. Review / refine (adjust scope, flag risks)
3. Implement against the spec
4. Verify every acceptance criterion
5. Mark spec as done in commit message

## Index

| Spec | Phase | Status |
|------|-------|--------|
| `00-monorepo-foundation.md` | Phase 1 | Done |
| `01-extract-design-tokens.md` | Phase 2 | Done |
| `02-extract-ui.md` | Phase 3 | Done |
| `03-extract-cms-package.md` | Phase 4 | Done |
| `03-split-payload-to-admin-app.md` | Phase 5 | Pending |
| `04-content-migration.md` | Phase 6 | Pending |
