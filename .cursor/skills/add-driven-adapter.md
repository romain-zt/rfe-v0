# Skill: Add driven adapter

## Input
- Port from `src/domain/**/*.port.ts`
- Adapter type: drizzle repo, HTTP client, EventBridge dispatcher

## Process
1. Ensure port exists in domain.
2. **Drizzle**: Add schema in `src/driven/drizzle/schema/schema.ts` if needed; add `*repository.ts` implementing port; add `*repository.test.ts`.
3. **HTTP client**: Add `src/driven/http/<name>/` with `*.client.ts`, `*.client.test.ts`; implement port.
4. **EventBridge**: Add `src/driven/eventbridge/<name>.dispatcher.ts`; extend base `EventBridgeDispatcher`; implement port.
5. Register in Nest module; export provider.
6. Add migration if schema changed: `pnpm migration:create <name>`.

## Output
- Adapter file(s) in `src/driven/`
- Module provider + export
- Migration (if Drizzle)

## Tests to run
- `pnpm test src/driven/<adapter>/*.test.ts`
- `pnpm check`
- `pnpm migration:check` (if schema)
