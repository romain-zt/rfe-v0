# Skill: Improve From Review

## Input
- Review output (STATUS + punchlist + file:line)
- Current changes / diff context

## Process
1) Order issues by risk:
   - domain boundary violations
   - breaking event changes
   - SQS retry-safety + idempotency
   - PII logging
   - types/lint
   - tests
2) Apply minimal patch per issue.
3) Rerun quality gate:
   - `pnpm test` OR `pnpm test <FILE>`
   - `pnpm check:fix`
4) Output updated STATUS + what changed.

## Output
- Minimal patch summary
- Files touched
- Commands run + results
- Remaining issues (if any)
