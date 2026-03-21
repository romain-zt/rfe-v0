# Command: fix

Fix failing tests or type/lint issues with minimal changes. Do not refactor unless required.

**Process**:
1. Run `pnpm check` and `pnpm test`; capture errors.
2. For domain violations: remove offending imports; move IO behind ports.
3. For test failures: fix assertion or implementation; ensure tests are meaningful.
4. For lint: apply suggested fixes; respect project style.

**After fixes**:
- Rerun: `pnpm test` OR `pnpm test <FILE>`
- Rerun: `pnpm check:fix`

**Output**:
- What was failing and why
- Minimal patch applied
- Commands run + results
