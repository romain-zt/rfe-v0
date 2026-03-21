# Command: implement

Follow the plan. Use skills from `.cursor/skills/`. Respect rules in `.cursor/rules/`.

**Process**:
1. Domain first (ports, types, services).
2. Driven adapters (repos, HTTP clients, EventBridge).
3. Driving adapters (controllers, SQS consumers).
4. Nest wiring.
5. Tests.

**Constraints**:
- Domain never imports driving/driven/nest/drizzle/aws.
- One focused change at a time.

**Before finishing this step**:
- Run: `pnpm test` OR `pnpm test <FILE>` (choose the narrowest that is safe)
- Run: `pnpm check:fix`
- If failures, fix minimally and rerun until green.

**Output**:
- Summary of changes
- Files touched
- Commands run + results
- Next step suggestion
