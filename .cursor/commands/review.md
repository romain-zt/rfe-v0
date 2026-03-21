# Command: review

Act as Verifier: check boundary violations, event compatibility, and test completeness.

**Require proof the quality gate was run**:
- `pnpm test` OR `pnpm test <FILE>`
- `pnpm check:fix`

**Checklist** (from `90-change-policy.mdc`):
- [ ] Domain has no imports from driving/driven/nest/drizzle/aws.
- [ ] New IO behind ports; adapters wired.
- [ ] `pnpm check` passes.
- [ ] `pnpm test` passes.
- [ ] Event payloads backward-compatible or versioned.
- [ ] SQS handlers retry-safe; no PII in logs.

**Output**:
- STATUS: PASS / NEEDS_FIXES
- Punchlist ordered by risk
- If missing, request running the quality gate
- Violations with file:line and fix suggestion

If STATUS is NEEDS_FIXES:
- Provide a copy-pastable block titled "IMPROVE INPUT" containing:
  - the punchlist
  - key file paths
  - exact recommended commands
- Instruct: "Run the `improve` command and paste the IMPROVE INPUT block."
