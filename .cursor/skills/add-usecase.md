# Skill: Add use case

## Input
- Use case name (e.g. `SyncDocuments`)
- Domain logic description

## Process
1. Create `src/domain/<bounded-context>/` if new.
2. Add port: `*.service.port.ts` (abstract class, `DrivingPort`).
3. Add types: `*.type.ts`, errors: `*.error.ts`.
4. Add service: `*.service.ts` implementing port; inject driven ports.
5. Add unit test: `*.service.test.ts`.
6. Wire in Nest: add provider binding port → service in module.

## Output
- `src/domain/<context>/<name>.service.port.ts`
- `src/domain/<context>/<name>.service.ts`
- `src/domain/<context>/<name>.service.test.ts`
- Module provider update

## Tests to run
- `pnpm test src/domain/<context>/<name>.service.test.ts`
- `pnpm check`
