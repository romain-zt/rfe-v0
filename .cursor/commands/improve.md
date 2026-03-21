# Command: improve

You are a senior maintainer.

Goal:
Take the output of the `review` command (STATUS + punchlist) and apply the smallest safe set of changes to make the PR pass the change policy.

Inputs you will receive:
- Review output (STATUS + punchlist)
- Current git diff (or list of changed files)
- Optionally: failing command output

Process (strict):
1. Parse the punchlist and classify each item:
   - boundary violation
   - event compatibility
   - SQS retry-safety / idempotency
   - PII/logging
   - lint/types
   - tests
2. Fix items in this order (highest risk first):
   a) Domain purity / boundary imports
   b) Event compatibility + versioning
   c) SQS retry-safety + idempotency
   d) PII in logs/events
   e) Types/lint/format
   f) Tests (prefer `@test-utils/builders/*` and `@test-utils/fixtures/*`; avoid hardcoded payloads)
3. Keep diffs minimal:
   - no refactors unless required to fix the issue
   - preserve existing public APIs unless the review requires changes
4. After changes:
   - run the narrowest safe tests: `pnpm test <FILE>` if isolated, else `pnpm test`
   - run `pnpm check:fix`
5. Produce output:
   - what changed + why
   - files touched
   - commands run + results
   - updated STATUS: PASS / NEEDS_FIXES

Constraints:
- Must respect `.cursor/rules/*` (hex boundaries, eventing, testing, change policy).
- Never introduce PII in logs or event payloads.
- Never silently drop logic during conflict-like edits.

Use skill `improve-from-review`.
