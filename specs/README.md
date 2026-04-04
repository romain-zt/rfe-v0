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
| `00-monorepo-foundation.md` | Phase 1 | Pending |
| `01-extract-design-tokens.md` | Phase 2 | Pending |
| `02-extract-ui.md` | Phase 3 | Pending |
