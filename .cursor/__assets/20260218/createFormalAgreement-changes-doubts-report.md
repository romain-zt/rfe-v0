# createFormalAgreement Migration — Changes & Doubts Report

## Summary

Migration of formal agreement generation from enrollment service into od-pdp is complete. od-pdp now generates and uploads the formal agreement PDF itself when processing `enrollment.created` events.

---

## Changes Implemented

### Domain

| File | Change |
|------|--------|
| `document-generator-service.port.ts` | **NEW** — `FormalAgreementPayload`, `GeneratedDocument`, `DocumentGeneratorServicePort.generateFormalAgreement()` |
| `internal-document.client.port.ts` | `UploadDocumentParams`, `uploadDocument()` |
| `internal-document.error.ts` | `InternalDocumentUploadError` |
| `document.service.port.ts` | `generateAndUploadFormalAgreement()` |
| `document.service.ts` | Implements `generateAndUploadFormalAgreement` via `DocumentGeneratorServicePort` + `InternalDocumentClientPort` |
| `enrollment.type.ts` | `Documents.formalAgreementInternalDocumentId` optional |
| `enrollment.repository.port.ts` | `CreateEnrollmentDocuments` (extends `Documents` with required `formalAgreementInternalDocumentId`) |
| `enrollment.service.ts` | Calls `generateAndUploadFormalAgreement` before `create()`, uses returned ID |

### Driven Adapters

| File | Change |
|------|--------|
| `template.service.tsx` | **NEW** — Renders `FormalAgreement` via `renderToStaticMarkup` |
| `pdf.service.ts` | **NEW** — HTML → PDF via `PdfClient` |
| `document-generator.service.ts` | **NEW** — Implements `DocumentGeneratorServicePort` |
| `document.error.ts` | **NEW** — `DocumentError` |
| `pdf.client.ts` | **NEW** — HTTP client for `PDF_SERVICE_URL` |
| `internal-document.client.ts` | `uploadDocument()` — get upload links, upload to presigned URL |
| `base-64-assets.ts` | **NEW** — Kolecto signature PNG |

### Driving / Nest

| File | Change |
|------|--------|
| `enrollment.dto.ts` | `formalAgreementInternalDocumentId` optional (`@IsOptional()`) |
| `http.module.ts` | Providers: `DocumentGeneratorServicePort`, `TemplateService`, `PdfService`, `PdfClient` |
| `sqs.module.ts` | Same providers |

### Config / Build

| File | Change |
|------|--------|
| `tsconfig.json` | `jsx: "react-jsx"`, `src/**/*.tsx` in include |
| `package.json` | `@kolecto/enrollment-templates`, `react`, `react-dom`, `form-data`, `@types/react`, `@types/react-dom` |

### Tests

| File | Change |
|------|--------|
| `document.test.ts` | Mock `DocumentGeneratorServicePort`, test `generateAndUploadFormalAgreement` |
| `enrollment.service.test.ts` | Mock `generateAndUploadFormalAgreement`, documents without `formalAgreementInternalDocumentId` |
| `document-generator.service.test.ts` | `fileName: 'formal-agreement.pdf'` |
| `internal-document.client.test.ts` | Upload test, base URL `127.0.0.1:9876` |
| `msw-handlers.ts` | `PDF_SERVICE_URL`, `createPdfClientHandlers()` |
| `test-launcher.ts` | Mock `DocumentGeneratorServicePort`, `uploadDocument` returns `randomUUID()` |
| `enrollment.spec.ts` | Events without `formalAgreementInternalDocumentId`, assertions updated |

---

## Doubts & Considerations

### 1. Domain purity — `@nestjs/common`

**Observation:** `src/domain/` still imports `@Injectable` from `@nestjs/common` in `document.service.ts`, `enrollment.service.ts`, `platform-router.service.ts`.

**Impact:** Domain is coupled to Nest for DI.

**Recommendation:** Consider moving `@Injectable` to adapters only and keeping domain services framework-agnostic (e.g. plain classes, wired in adapters).

---

### 2. `headOffice` hardcoded

**Observation:** `TemplateService` passes `headOffice: ''` for the company. Per plan, `headOffice` is hardcoded in the adapter (empty string for now).

**Recommendation:** Add real head office when available (e.g. from organization payload or config).

---

### 3. `eAddressEffectiveDate` hardcoded

**Observation:** `TemplateService` uses `eAddressEffectiveDate: new Date('2026-04-12')`.

**Recommendation:** Decide if this should come from the enrollment payload or remain a constant.

---

### 4. Re-download after upload (V1)

**Observation:** Formal agreement is generated, uploaded, then re-downloaded for external platform upload.

**Impact:** Extra download call; acceptable for V1 per plan.

**Recommendation:** Later optimization: pass the generated buffer through to `uploadExternal` instead of re-downloading.

---

### 5. `EnrollmentAddressMigratedDto` — `formalAgreementInternalDocumentId`

**Observation:** `EnrollmentAddressMigratedDto` still uses `EnrollmentDocumentsDto` with optional `formalAgreementInternalDocumentId`. Migration events may include both document IDs.

**Status:** Backward compatible; optional field is fine.

---

### 6. Env vars for production

**Required:**
- `PDF_SERVICE_URL` — PDF conversion service
- `DOCUMENT_SERVICE_URL` — Document service (upload links + download)
- `DOCUMENT_SERVICE_TIMEOUT_MS` (optional, default 10000)
- `PDF_SERVICE_TIMEOUT_MS` (optional, default 30000)

---

## Verification Checklist

- [x] `pnpm check:fix` passes
- [x] `pnpm test` passes (66 tests)
- [x] Inbound `formalAgreementInternalDocumentId` optional
- [x] Outbound event payloads unchanged
- [x] Domain has no imports from `driven/`, `driving/`, `drizzle`, `aws`
- [ ] Domain still imports `@nestjs/common` (see Doubt #1)

---

## Files Touched (by step)

**Step 1:** `document-generator-service.port.ts`, `internal-document.client.port.ts`, `document.service.port.ts`, `document.service.ts`  
**Step 2:** `template.service.tsx`, `pdf.service.ts`, `document-generator.service.ts`, `pdf.client.ts`, `document.error.ts`, `base-64-assets.ts`, `tsconfig.json`, `package.json`  
**Step 3:** `internal-document.client.ts`, `internal-document.error.ts`, `internal-document.client.test.ts`  
**Step 4:** `document.service.port.ts`, `document.service.ts`, `enrollment.service.ts`, `enrollment.type.ts`, `enrollment.repository.port.ts`, `document-generator.service.ts`, `document.test.ts`, `enrollment.service.test.ts`  
**Step 5:** `enrollment.dto.ts`, `http.module.ts`, `sqs.module.ts`, `msw-handlers.ts`, `test-launcher.ts`, `enrollment.spec.ts`
