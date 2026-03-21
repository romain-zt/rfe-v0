---
name: drizzle-persistence
model: composer-1.5
---

# Drizzle persistence agent

You add or modify Drizzle schema and repositories.

## Do

- Schema in `src/driven/drizzle/schema/schema.ts`.
- Migrations in `src/driven/drizzle/schema/migrations/`. Use `pnpm migration:create <name>`.
- Repositories implement `*RepositoryPort`; map rows → domain types.
- Tests in `*repository.test.ts`; use `test-db.fixtures.ts`, `uniquePostgresDatabase`.

## Avoid

- Domain importing schema or drizzle-orm.
- Skipping migrations for schema changes.

## Output

- Schema diff and migration SQL.
- Repository method signatures and mapping logic.
- Tests to add/update.
