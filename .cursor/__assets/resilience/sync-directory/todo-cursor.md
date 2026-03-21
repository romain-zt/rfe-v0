# Sync-directory resilience – implementation steps

## Target flow (from target.jpg)

- **Event 1 Start** → Cron triggers sync run
- **Search directory changes** → Serensia API (platform member id, status SUBMITTED → directory changes)
- **Create subscriptions** → Serensia API (webhook subscriptions)
- **Persist** → Event 1 Done, Event 2 Start (UPDATE address status ENROLLED, store event records)
- **Emit EventBridge event** → Event 2 Done (org id, address, status)

---

## 1. Schema: extend `enrollmentEventTable` for sync stages

**Files:** `src/driven/drizzle/schema/schema.ts`

- Add new event types: `SYNC_DIRECTORY_EVENT_1_START`, `SYNC_DIRECTORY_EVENT_1_DONE`, `SYNC_DIRECTORY_EVENT_2_START`, `SYNC_DIRECTORY_EVENT_2_DONE`
- Add optional `sync_run_id` (uuid) to correlate events within a run
- Add optional `event_bridge_detail_type` and `event_bridge_emitted_at` for Event 2 Done (idempotency/retry)
- Migration: `pnpm migration:create extend-enrollment-event-for-sync-resilience`

---

## 2. Domain: sync run and event stages

**Files:** `src/domain/enrollment/`

- Add `SyncDirectoryEventStage` enum (EVENT_1_START, EVENT_1_DONE, EVENT_2_START, EVENT_2_DONE)
- Extend `EnrollmentEventSource` or add `SyncDirectoryEventType` for new types
- Port: `SyncDirectoryEventRepositoryPort` – insert event, find incomplete runs, mark Event 2 Done
- Keep domain pure (no Drizzle/Nest imports except `@Injectable()`)

---

## 3. Driven: repository and EventBridge

**Files:** `src/driven/drizzle/`, `src/driven/eventbridge/`

- Implement `SyncDirectoryEventRepositoryPort` in Drizzle (insert, query by sync_run_id, by stage)
- Extend `EnrollmentDispatcherPort` or add `EnrollmentDispatcherResilientPort`:
  - Emit EventBridge + persist Event 2 Done per event (or batch with idempotency key)
- Wire in `DrizzlePersistenceModule`, `EventBridgeModule`

---

## 4. Cron: Event 1 Start

**Files:** `src/driving/nest/cron/serensia-directory.cron.ts`

- Before `hasDirectoryChanges()`, create sync run (insert EVENT_1_START with `sync_run_id`)
- Pass `sync_run_id` into `syncDirectoryChanges()`

---

## 5. Service: split flow (Event 1 vs Event 2)

**Files:** `src/domain/enrollment/enrollment.service.ts`, `src/domain/enrollment/enrollment.service.port.ts`

- **Event 1** (search + create subscriptions + persist):
  - Search directory changes (Serensia)
  - Create webhook subscriptions (Serensia)
  - Persist: `updateStatuses` + insert EVENT_1_DONE
  - Return `eventsToEmit` (org id, address, status) without emitting yet
- **Event 2** (emit EventBridge):
  - For each event: insert EVENT_2_START, emit EventBridge, insert EVENT_2_DONE
  - Or: batch emit, then batch insert EVENT_2_DONE with idempotency

---

## 6. Recovery: retry Event 2

**Files:** `src/driving/nest/cron/` or new `SyncDirectoryRecoveryCron`

- Cron or worker: find runs with EVENT_2_START but no EVENT_2_DONE (or EVENT_1_DONE without EVENT_2_START)
- Re-emit EventBridge for pending events (idempotent)
- Mark EVENT_2_DONE after successful emit

---

## 7. Tests

**Files:** `src/component-tests/serensia-directory.spec.ts`, `src/domain/enrollment/enrollment.service.test.ts`, `src/driven/drizzle/*.repository.test.ts`

- Assert EVENT_1_START, EVENT_1_DONE, EVENT_2_START, EVENT_2_DONE are persisted in correct order
- Assert recovery cron re-emits and marks EVENT_2_DONE
- Assert idempotency (duplicate emit does not duplicate side effects)

---

## Related files summary

| Area    | Files                                                                             |
| ------- | --------------------------------------------------------------------------------- |
| Schema  | `schema.ts`, migrations                                                           |
| Domain  | `enrollment.service.ts`, `enrollment.service.port.ts`, new port for sync events   |
| Driven  | `enrollment.repository.ts`, new sync-event repository, `enrollment.dispatcher.ts` |
| Driving | `serensia-directory.cron.ts`, possibly new recovery cron                          |
| Tests   | `serensia-directory.spec.ts`, `enrollment.service.test.ts`, repository tests      |
