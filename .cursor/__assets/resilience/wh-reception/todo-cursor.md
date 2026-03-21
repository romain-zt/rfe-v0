# Webhook reception resilience – implementation steps

## Current flow (fragile)

```
Webhook → verifySignature → findEnrollmentContext → idempotency check (findByPlatformExternalId)
  → fetchInboundInvoice (Serensia) → uploadDocument (Document) → createInboundInvoice (DB)
  → sendInboundInvoiceReceivedEvent (EventBridge)
```

**Problems:**
- No persistence before external calls → if Serensia/Document fails, webhook retry re-processes from scratch
- HTTP 200 only returned after full processing → slow webhook ack, risk of Serensia timeout & retry storm
- EventBridge emit failure = silent data loss (no retry mechanism)
- No stage tracking → can't recover partial failures

---

## Target flow (from target.jpg)

```
Webhook reception (member id, platform, flow id)
  │
  ├─ Event 1: Start
  │   ├─ Persist: check if flow id exists → INSERT (member id, platform, flow id, status RECEIVED)
  │   ├─ Get Invoice (Serensia) → invoice
  │   ├─ Get Invoice PDF (Serensia) → pdf invoice
  │   ├─ Upload Invoice PDF (Document) → invoice doc id
  │   └─ Event 1: Done
  │
  └─ Event 2: Start
      ├─ Emit EventBridge Event (invoice + invoice doc id)
      ├─ Persist: UPDATE status SENT + docID
      └─ Event 2: Done
```

**Key principles:**
- **Persist-first**: INSERT RECEIVED before any external call → webhook ack is fast, idempotency guaranteed at DB level
- **Two-phase**: Event 1 (fetch & upload) / Event 2 (emit & finalize) → each phase independently retryable
- **Stage tracking**: enrollmentEventTable records start/done per phase → recovery cron picks up orphans

---

## Step 1 – Schema: extend `enrollmentEventTable` for webhook reception stages

**Files:**
- `src/driven/drizzle/schema/schema.ts`
- New migration via `pnpm migration:create add-wh-reception-resilience`

**Actions:**

1.1. Add new event types to the `type` enum:
   - `WH_INVOICE_RECEIVED` (Event 1 Start – webhook persisted)
   - `WH_INVOICE_PROCESSED` (Event 1 Done – invoice fetched + PDF uploaded)
   - `WH_INVOICE_EMITTED` (Event 2 Done – EventBridge emitted + status SENT)

1.2. Add new columns to `enrollmentEventTable`:
   - `status` (text, nullable) – tracks processing status: `RECEIVED`, `PROCESSED`, `SENT`
   - `platformInvoiceExternalId` (text, nullable) – the "flow id" / Serensia invoiceId
   - `platform` (text, nullable) – `SERENSIA` / `DOXALLIA`
   - `platformEnrollmentExternalId` (text, nullable) – the "member id"
   - `documentId` (uuid, nullable) – the uploaded PDF document ID (filled at Event 1 Done)
   - `invoiceData` (text, nullable) – serialized invoice metadata from Serensia (filled at Event 1 Done)

1.3. Add index on `(platform, platformInvoiceExternalId)` for fast idempotency lookup.

1.4. Add a unique constraint on `(platform, platformInvoiceExternalId, type)` to prevent duplicate events per stage.

1.5. Create migration: `pnpm migration:create add-wh-reception-resilience`

> **Alternative**: if the table gets too wide, consider a separate `webhook_reception_event` table. Same structure but decoupled. Discuss tradeoff with team.

---

## Step 2 – Domain: webhook reception types and event repository port

**Files:**
- `src/domain/inbound-invoice/inbound-invoice-event.type.ts` (new)
- `src/domain/inbound-invoice/inbound-invoice-event.repository.port.ts` (new)

**Actions:**

2.1. Create `InboundInvoiceEventType` enum:
```ts
export enum InboundInvoiceEventType {
  WH_INVOICE_RECEIVED = 'WH_INVOICE_RECEIVED',
  WH_INVOICE_PROCESSED = 'WH_INVOICE_PROCESSED',
  WH_INVOICE_EMITTED = 'WH_INVOICE_EMITTED',
}
```

2.2. Create `InboundInvoiceEventStatus` enum:
```ts
export enum InboundInvoiceEventStatus {
  RECEIVED = 'RECEIVED',
  PROCESSED = 'PROCESSED',
  SENT = 'SENT',
}
```

2.3. Create `InboundInvoiceEventRepositoryPort` (DrivenPort):
```ts
abstract class InboundInvoiceEventRepositoryPort {
  // Persist-first: insert RECEIVED event, return event id. Idempotent on (platform, externalId).
  abstract insertReceivedEvent(input: InsertReceivedEventInput): Promise<{ id: string; alreadyExists: boolean }>;

  // After invoice fetch + PDF upload: update event to PROCESSED status
  abstract markProcessed(eventId: string, data: MarkProcessedInput): Promise<void>;

  // After EventBridge emit: update event to SENT status
  abstract markEmitted(eventId: string): Promise<void>;

  // Recovery: find events stuck in RECEIVED or PROCESSED (for retry cron)
  abstract findPendingEvents(): Promise<PendingWebhookEvent[]>;
}
```

2.4. Domain types for the port inputs:
- `InsertReceivedEventInput`: `{ platform, platformEnrollmentExternalId, platformInvoiceExternalId, organizationEnrollmentId, rawData }`
- `MarkProcessedInput`: `{ documentId, invoiceData }`
- `PendingWebhookEvent`: `{ id, type, status, platform, platformEnrollmentExternalId, platformInvoiceExternalId, organizationEnrollmentId, documentId?, invoiceData? }`

---

## Step 3 – Driven: implement event repository (Drizzle)

**Files:**
- `src/driven/drizzle/inbound-invoice-event.repository.ts` (new)
- `src/driven/drizzle/inbound-invoice-event.repository.test.ts` (new)
- `src/driven/drizzle/drizzle-persistence.module.ts` (update – register new repo)

**Actions:**

3.1. Implement `InboundInvoiceEventRepositoryPort`:
- `insertReceivedEvent`: INSERT into `enrollmentEventTable` with `type = WH_INVOICE_RECEIVED`, `status = RECEIVED`. Use `ON CONFLICT DO NOTHING` on `(platform, platformInvoiceExternalId, type)` → return `{ alreadyExists: true }` if no row inserted.
- `markProcessed`: UPDATE `status = PROCESSED`, `type = WH_INVOICE_PROCESSED`, set `documentId` and `invoiceData`.
- `markEmitted`: UPDATE `status = SENT`, `type = WH_INVOICE_EMITTED`.
- `findPendingEvents`: SELECT WHERE `type IN (WH_INVOICE_RECEIVED, WH_INVOICE_PROCESSED)` and `createdAt < now() - interval` (stale threshold, e.g. 5 min).

3.2. Wire in `DrizzlePersistenceModule` (add to providers + exports).

3.3. Write repository tests using `test-db.fixtures.ts` and `uniquePostgresDatabase`.

---

## Step 4 – Domain: refactor `InboundInvoiceService` for two-phase flow

**Files:**
- `src/domain/inbound-invoice/inbound-invoice.service.ts` (update)
- `src/domain/inbound-invoice/inbound-invoice.service.port.ts` (update)
- `src/domain/inbound-invoice/inbound-invoice.service.test.ts` (update)

**Actions:**

4.1. Inject `InboundInvoiceEventRepositoryPort` into `InboundInvoiceService`.

4.2. Refactor `handleInboundInvoiceReception` into two-phase flow:

**Phase 1 – Event 1 (called from webhook controller):**
```
validatePlatform(platform)
findEnrollmentContext(platform, memberId) → context
insertReceivedEvent(...) → { id, alreadyExists }
  if alreadyExists → return early (idempotent)
fetchInboundInvoice(memberId, invoiceId) → { invoice, pdfBuffer }
uploadDocument(pdfBuffer, ...) → documentId
markProcessed(eventId, { documentId, invoiceData })
createInboundInvoice(...)  // existing persistence in inbound_invoice + platform_inbound_invoice
```

> **Key change**: `insertReceivedEvent` happens BEFORE `fetchInboundInvoice`. This is the persist-first pattern.

**Phase 2 – Event 2 (called from same method or separate):**
```
sendInboundInvoiceReceivedEvent(...)  // EventBridge
markEmitted(eventId)
```

4.3. Update `InboundInvoiceServicePort` if new methods are exposed (e.g. `retryPendingWebhookEvents` for recovery cron).

4.4. Decide: should Phase 2 be synchronous (same HTTP request) or async?
- **Option A – Synchronous (simpler, recommended first):** Phase 1 + Phase 2 in sequence within `handleInboundInvoiceReception`. Recovery cron handles failures.
- **Option B – Async via SQS:** Phase 1 emits internal SQS message, Phase 2 is a separate consumer. More resilient but more complex.
- **Recommendation:** Start with Option A + recovery cron. Migrate to Option B if throughput requires it.

4.5. Update unit tests to verify:
- `insertReceivedEvent` is called before any external call
- Idempotency: if `alreadyExists`, no external calls made
- `markProcessed` is called after fetch + upload
- `markEmitted` is called after EventBridge emit
- Failure after RECEIVED but before PROCESSED leaves event in recoverable state

---

## Step 5 – Controller: no change needed (but verify)

**Files:**
- `src/driving/nest/http/event.controller.ts` (verify – no change expected)

**Actions:**

5.1. Verify `EventController.handleSerensiaIncomingInvoiceCreatedEvent` still calls `inboundInvoiceService.handleInboundInvoiceReception` – no controller change needed since the service handles the persist-first logic internally.

5.2. Consider: should the controller return HTTP 200 after Phase 1 only (before EventBridge emit)? If yes, Phase 2 must be async. For Option A (synchronous), controller stays as-is.

---

## Step 6 – Module wiring

**Files:**
- `src/driving/nest/inbound-invoice.module.ts` (update)

**Actions:**

6.1. Import and provide `InboundInvoiceEventRepositoryPort` → bound to `InboundInvoiceEventRepository`.

6.2. Ensure `DrizzlePersistenceModule` exports the new repository.

---

## Step 7 – Recovery: retry cron for stuck events

**Files:**
- `src/driving/nest/cron/inbound-invoice-recovery.cron.ts` (new)
- `src/driving/nest/cron/cron.module.ts` (update – register new cron)
- `src/domain/inbound-invoice/inbound-invoice.service.port.ts` (update – add `retryPendingWebhookEvents`)
- `src/domain/inbound-invoice/inbound-invoice.service.ts` (update – implement retry)

**Actions:**

7.1. New `InboundInvoiceRecoveryCron`:
- Runs every N minutes (e.g. 5 min)
- Calls `inboundInvoiceService.retryPendingWebhookEvents()`

7.2. `retryPendingWebhookEvents` implementation:
```
findPendingEvents() → pendingEvents
for each event:
  if status == RECEIVED:
    → retry Phase 1 (fetch, upload, markProcessed) then Phase 2 (emit, markEmitted)
  if status == PROCESSED:
    → retry Phase 2 only (emit, markEmitted)
```

7.3. Add a `maxRetries` or `retryCount` column to avoid infinite retries on permanently broken events.

7.4. Respect idempotency: re-upload to Document service should be idempotent (or check if documentId already set before re-uploading).

---

## Step 8 – Tests

**Files:**
- `src/domain/inbound-invoice/inbound-invoice.service.test.ts` (update)
- `src/driven/drizzle/inbound-invoice-event.repository.test.ts` (new)
- `src/component-tests/inbound-invoice.spec.ts` (new or update existing)

**Actions:**

8.1. **Unit tests** (`inbound-invoice.service.test.ts`):
- Happy path: RECEIVED → PROCESSED → EMITTED → SENT
- Idempotency: duplicate webhook → early return after `insertReceivedEvent`
- Failure after RECEIVED: verify event stays in RECEIVED, no external side effects lost
- Failure after PROCESSED: verify EventBridge not emitted, event stays in PROCESSED
- Retry: `retryPendingWebhookEvents` re-processes stuck events correctly

8.2. **Repository tests** (`inbound-invoice-event.repository.test.ts`):
- `insertReceivedEvent` → row created with correct status
- `insertReceivedEvent` duplicate → returns `alreadyExists: true`, no duplicate row
- `markProcessed` → status updated, documentId + invoiceData set
- `markEmitted` → status updated to SENT
- `findPendingEvents` → returns only stale RECEIVED/PROCESSED events

8.3. **Component tests** (`inbound-invoice.spec.ts`):
- Full flow with MSW mocking Serensia + Document
- Verify event table progression (RECEIVED → PROCESSED → SENT)
- Verify idempotency at HTTP level (duplicate webhook POST → 200, no duplicate processing)

---

## Step 9 – Quality gate

```bash
pnpm test                 # all tests pass
pnpm check:fix            # no lint/type issues
pnpm migration:check      # migration consistent with schema
```

---

## Related files summary

| Area    | Files                                                                                          |
| ------- | ---------------------------------------------------------------------------------------------- |
| Schema  | `schema.ts`, new migration                                                                     |
| Domain  | `inbound-invoice.service.ts`, `inbound-invoice.service.port.ts`, new event type + port         |
| Driven  | new `inbound-invoice-event.repository.ts`, `drizzle-persistence.module.ts`                     |
| Driving | `event.controller.ts` (verify), new `inbound-invoice-recovery.cron.ts`, `cron.module.ts`       |
| Module  | `inbound-invoice.module.ts`                                                                    |
| Tests   | `inbound-invoice.service.test.ts`, new repo test, component test                               |

---

## Open questions / decisions for team

1. **Separate table vs extend `enrollmentEventTable`?** – Extending is simpler but muddies enrollment events with invoice events. A separate `webhook_reception_event` table is cleaner but adds schema surface.

2. **Sync vs async Phase 2?** – Option A (sync + recovery cron) is recommended as a first step. Option B (SQS) can be added later if throughput demands it.

3. **Max retries / dead-letter?** – Should failed events be capped at N retries? Should we alert on stuck events?

4. **Admin endpoint for replay?** – Should we expose an admin endpoint to manually retry a stuck event by ID?
