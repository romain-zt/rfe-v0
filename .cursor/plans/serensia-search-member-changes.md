# Serensia: Search Member Directory Changes — Implementation Plan

**Scope**: First step only. Webhook creation and challenge endpoint are separate tickets.

**Flow**: Cron → for each Serensia SUBMITTED enrollment with `externalId` → GET directory changes → compute status → update DB + emit `od-pdp.enrollment-updated` when ENROLLED/REJECTED.

---

## 1. File List

| Layer | Files |
|-------|-------|
| **Domain** | `enrollment.type.ts` (add APPROVED), `enrollment.repository.port.ts` (new method), `serensia.client.port.ts` (extend), `serensia.service.ts` + `serensia.service.port.ts` (resolution + sync, under `domain/pdp/serensia/`) |
| **Driving** | `cron/serensia-directory.cron.ts`, `cron/cron.module.ts` |
| **Driven** | `enrollment.repository.ts` (new method), `serensia.client.ts` (extend), `serensia.types.ts` (add types), `schema.ts` (APPROVED), migration |
| **Tests** | `serensia.service.test.ts`, `enrollment.repository.test.ts` (extend), `serensia.client.spec.ts` (extend), `serensia-directory.spec.ts` (component) |

---

## 2. Ports

| Port | Change |
|------|--------|
| `EnrollmentRepositoryPort` | Add `findSubmittedSerensiaEnrollmentsWithExternalId(): Promise<SubmittedSerensiaEnrollment[]>` |
| `SerensiaApiClientPort` | Add `searchDirectoryChanges(memberId: string): Promise<DirectoryChangesResponse>` |
| `SerensiaServicePort` | `syncDirectoryChanges(): Promise<void>` (in `domain/pdp/serensia/`) |

---

## 3. Implementation Order

### Step 1 — Add APPROVED status

- `enrollment.type.ts`: add `Approved = 'APPROVED'` to `AddressStatus`
- Drizzle schema: add `'APPROVED'` to `address.status` enum
- Migration: `pnpm migration:create add-approved-status`

### Step 2 — Repository: find submitted Serensia enrollments

- `enrollment.repository.port.ts`: add `SubmittedSerensiaEnrollment { address, organizationId, externalId }` and `findSubmittedSerensiaEnrollmentsWithExternalId()`
- `enrollment.repository.ts`: implement; query `address` JOIN `platform_enrollment` WHERE `platform = 'SERENSIA'` AND `address.status = 'SUBMITTED'` AND `platform_enrollment.external_id IS NOT NULL`
- `enrollment.repository.test.ts`: add tests for new method (fixtures with SERENSIA, SUBMITTED, externalId)

### Step 3 — Serensia client: search directory changes

- `serensia.types.ts`: add `DirectoryChangesResponse`, `MemberAddressingPlanChangeDto`, PPF/Peppol status types (aligned with OpenAPI)
- `serensia.client.port.ts`: add `searchDirectoryChanges(memberId: string): Promise<DirectoryChangesResponse>`
- `serensia.client.ts`: implement `GET /members/{memberId}/addressing-plan/changes`
- `serensia.client.spec.ts`: add `searchDirectoryChanges` tests (MSW mock, response mapping)

### Step 4 — Domain: SerensiaService (resolution + sync)

- New: `domain/pdp/serensia/serensia.service.port.ts` — `syncDirectoryChanges(): Promise<void>`
- New: `domain/pdp/serensia/serensia.service.ts`: depends on `EnrollmentRepositoryPort`, `SerensiaApiClientPort`, `EnrollmentDispatcherPort`
  - Fetch submitted Serensia enrollments with externalId
  - For each: call `searchDirectoryChanges(externalId)`, run `resolveDirectoryStatus(items)` (private helper)
  - Rules: REJECTED (any rejectedByPpf/rejectedByPeppolSmp), ENROLLED (both registerStructure+repossessMember done), APPROVED (approvedByPpf), else SUBMITTED
  - REJECTED/ENROLLED: `updateMany` + `sendEnrollmentUpdatedEvents`; APPROVED: `updateMany` only
- New: `domain/pdp/serensia/serensia.service.test.ts`: resolution branches + sync flow (mocked ports)

### Step 5 — Cron (minimal logic)

- New: `driving/nest/cron/serensia-directory.cron.ts` — injects `SerensiaServicePort`, calls `syncDirectoryChanges()`
- New: `cron.module.ts`: wires `SerensiaService`, `EnrollmentRepository`, `SerensiaApiClient`, `EnrollmentDispatcher`, `DrizzlePersistenceModule`, `SerensiaModule`

### Step 7 — Wiring and bootstrap

- `main.api.ts`: import `CronModule` (or add CronModule to HttpModule if shared)
- Ensure worker does not run cron (only API process)

### Step 8 — Component test

- `component-tests/serensia-directory.spec.ts`: MSW mock Serensia API; seed DB with Serensia SUBMITTED + externalId; trigger cron; assert address status update + EventBridge `od-pdp.enrollment-updated`

**Definition of done**: `pnpm test` + `pnpm check:fix` pass.

---

## 4. Reference Skills

- **add-usecase** — domain service + port
- **add-driven-adapter** — extend Serensia client, repository
- **add-drizzle-migration** — APPROVED status
- **add-eventbridge-dispatch** — reuse existing `EnrollmentDispatcher`

---

## 5. Out of Scope (Step 2)

- Create webhook subscription
- GET webhook challenge endpoint
- `pdp:incoming_invoice:created` / `pdp:invoice:status_updated` handling

---

## 6. Resolution Logic Reference

| Condition | New status | Emit event |
|-----------|-----------|------------|
| Any `rejectedByPpf` or `rejectedByPeppolSmp` | REJECTED | Yes |
| `registerStructure` + `repossessMember` both: PPF ∈ {noChangeRequired, appliedInPpf}, Peppol ∈ {noChangeRequired, appliedInPeppolSmp} | ENROLLED | Yes |
| Same as ENROLLED but at least one PPF = approvedByPpf | APPROVED | No |
| Else | SUBMITTED | No (no update) |
