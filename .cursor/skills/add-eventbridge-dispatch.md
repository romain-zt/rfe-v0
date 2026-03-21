# Skill: Add EventBridge dispatch

## Input
- Event name (e.g. `enrollment-updated`)
- Payload shape (backward-compatible)

## Process
1. Add or extend dispatcher port in `src/domain/**/*.dispatcher.port.ts`.
2. Add or extend dispatcher in `src/driven/eventbridge/` implementing port.
3. Use `EventBridgeDispatcher.sendEvents(DETAIL_TYPE, payload)`.
4. Detail type: `od-pdp.<event-name>`.
5. Wire in module; inject in domain service.
6. Document payload schema; prefer additive changes.

## Output
- Port (if new)
- `src/driven/eventbridge/<name>.dispatcher.ts`
- Module provider
- Call site in domain service

## Tests to run
- `pnpm test` (mock EventBridge in unit tests)
- Component test with `TestEventBridgeClient` if needed
