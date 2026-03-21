# Skill: Add Drizzle migration

## Input
- Schema change (new table, column, index, etc.)

## Process
1. Edit `src/driven/drizzle/schema/schema.ts`.
2. Run `pnpm migration:create <descriptive-name>`.
3. Review generated SQL in `src/driven/drizzle/schema/migrations/`.
4. Run `pnpm migration:check` to ensure no drift.
5. Update repository if mapping changes.
6. Add/update `*repository.test.ts` if behavior changes.

## Output
- Schema change in `schema.ts`
- New migration file in `migrations/`
- Repository + test updates if needed

## Tests to run
- `pnpm migration:check`
- `pnpm test src/driven/drizzle/*.repository.test.ts`
- `pnpm check`
