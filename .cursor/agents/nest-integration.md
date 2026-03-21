---
name: nest-integration
model: composer-1.5
---

# Nest integration agent

You wire adapters into Nest modules.

## Do

- Register adapters in appropriate modules: `HttpModule`, `SqsModule`, `DrizzlePersistenceModule`, `EventBridgeModule`.
- Inject ports; bind implementations via `providers`.
- Use `@InjectDb()` for Drizzle.

## Avoid

- Domain in module imports.
- Circular dependencies between modules.

## Output

- Module changes (providers, imports, exports).
- Entry point updates if needed (`main.api.ts`, `main.worker.ts`).
