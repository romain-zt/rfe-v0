diff --git a/services/od-pdp/package.json b/services/od-pdp/package.json
index ede9f59084..dc0e61d6aa 100644
--- a/services/od-pdp/package.json
+++ b/services/od-pdp/package.json
@@ -30,6 +30,7 @@
"@aws-sdk/client-s3": "3.701.0",
"@aws-sdk/client-sqs": "3.363.0",
"@kolecto/datadog-tracing": "1.0.2",

- "@kolecto/enrollment-templates": "^1.1.2",
  "@nestjs/common": "^11.1.6",
  "@nestjs/config": "^4.0.2",
  "@nestjs/core": "^11.1.6",
  @@ -40,11 +41,14 @@
  "class-validator": "0.14.2",
  "dd-trace": "^5.83.0",
  "drizzle-orm": "0.35.1",
- "form-data": "4.0.5",
  "fast-xml-parser": "5.3.5",
  "fastify": "5.4.0",
  "nest-winston": "^1.10.2",
  "openpgp": "6.2.2",
  "pg": "8.12.0",
- "react": "19.2.0",
- "react-dom": "19.2.0",
  "reflect-metadata": "^0.2.2",
  "rxjs": "^7.8.2",
  "sqs-consumer": "^14.0.0",
  @@ -60,6 +64,8 @@
  "@swc/core": "^1.13.2",
  "@types/node": "^22.10.7",
  "@types/pg": "8.11.10",
- "@types/react": "18.3.26",
- "@types/react-dom": "18.3.7",
  "@types/supertest": "^6.0.2",
  "@vitest/coverage-v8": "^3.2.4",
  "@vitest/ui": "^3.2.4",
  diff --git a/services/od-pdp/src/assets/base-64-assets.ts b/services/od-pdp/src/assets/base-64-assets.ts
  new file mode 100644
  index 0000000000..bd0590f617
  --- /dev/null
  +++ b/services/od-pdp/src/assets/base-64-assets.ts
  @@ -0,0 +1,2 @@
  +export const KOLECT_SIGNATURE_BASE_64 =
- 'SIGNATUREHERE';
  diff --git a/services/od-pdp/src/component-tests/enrollment.spec.ts b/services/od-pdp/src/component-tests/enrollment.spec.ts
  index abf94970f3..11c926ed4c 100644
  --- a/services/od-pdp/src/component-tests/enrollment.spec.ts
  +++ b/services/od-pdp/src/component-tests/enrollment.spec.ts
  @@ -9,7 +9,11 @@ import {
  addressTable,
  enrollmentEventTable,
  } from '@driven/drizzle/schema/schema';
  -import { EnrollmentAddressMigratedDto, EnrollmentCreatedDto } from '@driving/nest/sqs/dto/enrollment.dto';
  +import {
- EnrollmentAddressMigratedDto,
- EnrollmentCreatedDto,
- EnrollmentCreatedRawDetail,
  +} from '@driving/nest/sqs/dto/enrollment.dto';
  import { randomUUID } from 'node:crypto';
  import { eq } from 'drizzle-orm';
  import { AddressStatus, Platform, VatPaymentChoice } from '@domain/enrollment/enrollment.type';
  @@ -47,7 +51,7 @@ describe('Enrollment Controller', () => {
  describe('EnrollmentConsumer', () => {
  it('should enroll on DOXALLIA when no feature flags are enabled', async () => {

*      const event: RawEventBridgeMessage<EnrollmentCreatedDto> = {

-      const event: RawEventBridgeMessage<EnrollmentCreatedRawDetail> = {
           source: 'kolecto.enrollment',
           'detail-type': EnrollmentCreatedDto.detailType,
           detail: {
  @@ -71,7 +75,6 @@ describe('Enrollment Controller', () => {
  },
  documents: {
  appointmentMandateInternalDocumentId: randomUUID(),

*            formalAgreementInternalDocumentId: randomUUID(),
             },
           },
         };
  @@ -90,7 +93,8 @@ describe('Enrollment Controller', () => {
  siret: event.detail.organization.siret,
  name: event.detail.organization.businessName,
  ...event.detail.features,
*        ...event.detail.documents,

-        appointmentMandateInternalDocumentId: event.detail.documents.appointmentMandateInternalDocumentId,
-        formalAgreementInternalDocumentId: expect.any(String),
           appointmentMandateExternalDocumentId: expect.any(String),
           formalAgreementExternalDocumentId: expect.any(String),
         });
  @@ -116,7 +120,7 @@ describe('Enrollment Controller', () => {
  });
  it('should enroll on SERENSIA when force serensia flag is enabled', async () => {

*      const event: RawEventBridgeMessage<EnrollmentCreatedDto> = {

-      const event: RawEventBridgeMessage<EnrollmentCreatedRawDetail> = {
           source: 'kolecto.enrollment',
           'detail-type': EnrollmentCreatedDto.detailType,
           detail: {
  @@ -140,7 +144,6 @@ describe('Enrollment Controller', () => {
  },
  documents: {
  appointmentMandateInternalDocumentId: randomUUID(),

*            formalAgreementInternalDocumentId: randomUUID(),
             },
           },
         };
  @@ -159,7 +162,8 @@ describe('Enrollment Controller', () => {
  siret: event.detail.organization.siret,
  name: event.detail.organization.businessName,
  ...event.detail.features,
*        ...event.detail.documents,

-        appointmentMandateInternalDocumentId: event.detail.documents.appointmentMandateInternalDocumentId,
-        formalAgreementInternalDocumentId: expect.any(String),
           appointmentMandateExternalDocumentId: expect.any(String),
           formalAgreementExternalDocumentId: expect.any(String),
         });
  diff --git a/services/od-pdp/src/component-tests/utils/msw-handlers.ts b/services/od-pdp/src/component-tests/utils/msw-handlers.ts
  index 6fe2304eeb..50c1483890 100644
  --- a/services/od-pdp/src/component-tests/utils/msw-handlers.ts
  +++ b/services/od-pdp/src/component-tests/utils/msw-handlers.ts
  @@ -5,9 +5,11 @@ import {
  ODPDP_MULTIPLATFORM_ENROLLMENT,
  } from '@domain/feature-flag/feature-flag.constants';

+export const S3_SCALEWAY_URL = 'https://\*.s3.fr-par.scw.cloud';
export const FEATURE_FLAG_SERVICE_URL = 'http://feature-flag-service:8080';
export const DOCUMENT_SERVICE_URL = 'http://document-service:8080';
export const EXTERNAL_DOCUMENT_SERVICE_URL = 'http://external-document-service:8080';
+export const PDF_SERVICE_URL = 'http://pdf-service:8080';
export const ORG_NO_FLAGS = randomUUID();
export const ORG_MULTIPLATFORM = randomUUID();
export const ORG_FORCE_SERENSIA = randomUUID();
@@ -22,9 +24,7 @@ const featureFlagsByOrg: Record<string, Array<{ name: string; value: string }>>
};

export const createFeatureFlagHandlers = () => [

- // Note: some callers may accidentally duplicate the query string (e.g. `...?organizationId=...?...`).
- // Use a regexp so it matches whether MSW compares against pathname or full URL.
- http.get(/\/public\/flags/, ({ request }) => {

* http.get(`${FEATURE_FLAG_SERVICE_URL}/public/flags`, ({ request }) => {
  const url = new URL(request.url);
  const rawOrganizationId = url.searchParams.get('organizationId') ?? '';
  const organizationId = rawOrganizationId.split('?')[0] ?? '';
  @@ -34,12 +34,27 @@ export const createFeatureFlagHandlers = () => [
  ];

export const createDocumentClientHandlers = () => [

- http.post(
- `${process.env.DOCUMENT_SERVICE_URL!}/v1/organizations/:organizationId/documents/upload-links`,
- async ({ request }) => {
-      const body = (await request.json()) as { files?: Record<string, unknown> };
-      const fileId = body.files ? Object.keys(body.files)[0] : randomUUID();
-      const documentId = randomUUID();
-      const uploadUrl = 'https://test-bucket-pa.s3.fr-par.scw.cloud/upload';
-      return HttpResponse.json({
-        outcome: 'success',
-        entity: {
-          [fileId]: { url: uploadUrl, documentId, mimeType: 'application/pdf', fields: {} },
-        },
-      });
- },
- ),
  http.get(`${process.env.DOCUMENT_SERVICE_URL!}/v1/organizations/:organizationId/documents/:documentId`, () => {
  return new HttpResponse(
  JSON.stringify({
  outcome: 'success',
  entity: {

*          url: `${process.env.DOCUMENT_SERVICE_URL!}/kolecto-documents/test.pdf`,

-          url: `${process.env.DOCUMENT_SERVICE_URL!}/*/*`,
             originalName: 'test.pdf',
             mimeType: 'application/pdf',
             size: 1024,
  @@ -49,21 +64,40 @@ export const createDocumentClientHandlers = () => [
  );
  }),

* http.get(`${process.env.DOCUMENT_SERVICE_URL!}/kolecto-documents/*`, () => {

- http.get(`${process.env.DOCUMENT_SERVICE_URL!}/v1/documents/:documentId`, () => {
- const body = new TextEncoder().encode('mock-document-content').buffer;
-
- return HttpResponse.arrayBuffer(body, {
-      status: 200,
-      headers: {
-        'Content-Type': 'application/pdf',
-      },
- });
- }),
-
- http.get(`${process.env.DOCUMENT_SERVICE_URL!}/*/*`, () => {
  return new HttpResponse(new TextEncoder().encode('mock-document-content'), {
  headers: {
  'Content-Type': 'application/pdf',
  },
  });
  }),
  +];

* http.post('https://_.amazonaws.com/_', () => {
* return HttpResponse.text('', { status: 204 });
  +export const createPdfClientHandlers = () => [

- http.post(`${process.env.PDF_SERVICE_URL!}/forms/chromium/convert/html`, () => {
- return new HttpResponse(new TextEncoder().encode('mock-pdf-bytes'), {
-      status: 200,
-      headers: { 'Content-Type': 'application/pdf' },
- });
  }),
  ];

export const createExternalDocumentClientHandler = () => [

- http.put(`https://kolecto-pa-dev-consent.s3.fr-par.scw.cloud/*/*/*`, () => {

* http.post(`${S3_SCALEWAY_URL}/*`, () => {
* return HttpResponse.text('', { status: 204 });
* }),
* http.put(`${S3_SCALEWAY_URL}/*`, () => {
  return HttpResponse.text('', { status: 204 });
  }),
  ];
  diff --git a/services/od-pdp/src/component-tests/utils/test-launcher.ts b/services/od-pdp/src/component-tests/utils/test-launcher.ts
  index 4032d156d7..b6aa202d7b 100644
  --- a/services/od-pdp/src/component-tests/utils/test-launcher.ts
  +++ b/services/od-pdp/src/component-tests/utils/test-launcher.ts
  @@ -18,14 +18,13 @@ import {
  createExternalDocumentClientHandler,
  createFeatureFlagHandlers,
  createPassthroughHandlers,
* createPdfClientHandlers,
  DOCUMENT_SERVICE_URL,
  EXTERNAL_DOCUMENT_SERVICE_URL,
  FEATURE_FLAG_SERVICE_URL,
* PDF_SERVICE_URL,
  } from './msw-handlers';
  import { PUBLIC_KEY } from '@test-utils/fixtures/pgp-keys.fixture';
  -import { InternalDocumentClientPort } from '@domain/internal-document/internal-document.client.port';
  -import { ExternalDocumentClientPort } from '@domain/external-document/external-document.client.port';

- export const eventBridgeBusName = 'kolecto-event-bus';
  export const enrollmentSqsQueueUrl = 'http://localstack:4566/queue/us-east-1/000000000000/EnrollmentQueue';

@@ -45,11 +44,13 @@ export const setupMswServer = (): SetupServerApi => {
process.env.FEATURE_FLAG_SERVICE_URL = FEATURE_FLAG_SERVICE_URL;
process.env.DOCUMENT_SERVICE_URL = DOCUMENT_SERVICE_URL;
process.env.EXTERNAL_DOCUMENT_SERVICE_URL = EXTERNAL_DOCUMENT_SERVICE_URL;

- process.env.PDF_SERVICE_URL = PDF_SERVICE_URL;

  const server = setupServer(
  ...createFeatureFlagHandlers(),
  ...createDocumentClientHandlers(),
  ...createExternalDocumentClientHandler(),

- ...createPdfClientHandlers(),
  ...createPassthroughHandlers(),
  );

@@ -76,10 +77,6 @@ export const startHttpModule = async (): Promise<{
.useValue(databaseClient)
.overrideProvider(EventBusClient)
.useValue(eventBridgeClient)

- .overrideProvider(InternalDocumentClientPort)
- .useValue(mock<InternalDocumentClientPort>())
- .overrideProvider(ExternalDocumentClientPort)
- .useValue(mock<ExternalDocumentClientPort>())
  .compile();

const app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter(), { rawBody: true });
@@ -125,13 +122,6 @@ export const startSqsModule = async (): Promise<{
}
});

- const internalDocumentClientMock = mock<InternalDocumentClientPort>();
- internalDocumentClientMock.downloadDocument.mockResolvedValue(Buffer.from('mock-document-content'));
- const externalDocumentClientMock = mock<ExternalDocumentClientPort>();
- externalDocumentClientMock.uploadDocument.mockImplementation(
- async (doc, orgId) => await Promise.resolve(`${orgId}/${doc.name}/${doc.id}`),
- );
- const moduleRef = await Test.createTestingModule({ imports: [SqsModule] })
  .overrideProvider(DB_PROVIDER)
  .useValue(databaseClient)
  @@ -139,10 +129,6 @@ export const startSqsModule = async (): Promise<{
  .useValue(eventBridgeClient)
  .overrideProvider(SQSClient)
  .useValue(sqsClientMock)
- .overrideProvider(InternalDocumentClientPort)
- .useValue(internalDocumentClientMock)
- .overrideProvider(ExternalDocumentClientPort)
- .useValue(externalDocumentClientMock)
  .compile();

const app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
diff --git a/services/od-pdp/src/domain/document/document-generator-service.port.ts b/services/od-pdp/src/domain/document/document-generator-service.port.ts
new file mode 100644
index 0000000000..39fb362645
--- /dev/null
+++ b/services/od-pdp/src/domain/document/document-generator-service.port.ts
@@ -0,0 +1,16 @@
+import { DrivenPort } from '@domain/hexagonal';

- +export interface FormalAgreementPayload {
- organization: { siren: string; siret: string; businessName: string };
- address: string;
- startDate: Date;
  +}
- +export interface GeneratedDocument {
- content: Buffer;
- fileName: string;
  +}
- +export abstract class DocumentGeneratorServicePort implements DrivenPort {
- abstract generateFormalAgreement(payload: FormalAgreementPayload): Promise<GeneratedDocument>;
  +}
  diff --git a/services/od-pdp/src/domain/document/document.service.port.ts b/services/od-pdp/src/domain/document/document.service.port.ts
  index 6b89d567fa..f2d08d2e56 100644
  --- a/services/od-pdp/src/domain/document/document.service.port.ts
  +++ b/services/od-pdp/src/domain/document/document.service.port.ts
  @@ -1,10 +1,18 @@
  import { Platform } from '@domain/enrollment/enrollment.type';
  import { LegalDocument, LegalDocumentType } from '@domain/external-document/external-document.client.port';
  import { DrivingPort } from '@domain/hexagonal';
  +import type { FormalAgreementPayload } from '@domain/document/document-generator-service.port';

export abstract class DocumentServicePort implements DrivingPort {

- // Internal documents (kolecto/services/document)
  abstract downloadInternal(documentId: string): Promise<Buffer>;
-
- // External documents (plateforme agréé)
  abstract uploadExternal(file: LegalDocument, organizationId: string, platform: Platform): Promise<string>;
-
- abstract generateAndUploadFormalAgreement(
- payload: FormalAgreementPayload & { organizationId: string },
- ): Promise<string>;
  }

export interface SyncDocumentsResult {
diff --git a/services/od-pdp/src/domain/document/document.service.ts b/services/od-pdp/src/domain/document/document.service.ts
index e640a1f977..b0bf55c54e 100644
--- a/services/od-pdp/src/domain/document/document.service.ts
+++ b/services/od-pdp/src/domain/document/document.service.ts
@@ -1,5 +1,9 @@
import { Injectable } from '@nestjs/common';
import { DocumentServicePort } from './document.service.port';
+import {

- DocumentGeneratorServicePort,
- type FormalAgreementPayload,
  +} from '@domain/document/document-generator-service.port';
  import { InternalDocumentClientPort } from '@domain/internal-document/internal-document.client.port';
  import { ExternalDocumentClientPort, LegalDocument } from '@domain/external-document/external-document.client.port';
  import { Platform } from '@domain/enrollment/enrollment.type';
  @@ -9,6 +13,7 @@ export class DocumentService implements DocumentServicePort {
  constructor(
  private readonly internalDocumentClient: InternalDocumentClientPort,
  private readonly externalDocumentClient: ExternalDocumentClientPort,
- private readonly documentGenerator: DocumentGeneratorServicePort,
  ) {}

async downloadInternal(documentId: string): Promise<Buffer> {
@@ -18,4 +23,15 @@ export class DocumentService implements DocumentServicePort {
async uploadExternal(file: LegalDocument, organizationId: string, platform: Platform): Promise<string> {
return this.externalDocumentClient.uploadDocument(file, organizationId, platform);
}

-
- async generateAndUploadFormalAgreement(
- payload: FormalAgreementPayload & { organizationId: string },
- ): Promise<string> {
- const { content, fileName } = await this.documentGenerator.generateFormalAgreement(payload);
- return this.internalDocumentClient.uploadDocument({
-      organizationId: payload.organizationId,
-      fileName,
-      fileContent: content,
- });
- }
  }
  diff --git a/services/od-pdp/src/domain/document/document.test.ts b/services/od-pdp/src/domain/document/document.test.ts
  index 160199522b..c5ad0bfca5 100644
  --- a/services/od-pdp/src/domain/document/document.test.ts
  +++ b/services/od-pdp/src/domain/document/document.test.ts
  @@ -1,6 +1,7 @@
  import { beforeEach, describe, expect, it, vi } from 'vitest';
  import { mock, mockClear } from 'vitest-mock-extended';
  import { DocumentService } from './document.service';
  +import { DocumentGeneratorServicePort } from '@domain/document/document-generator-service.port';
  import { InternalDocumentClientPort } from '@domain/internal-document/internal-document.client.port';
  import { ExternalDocumentClientPort, LegalDocumentType } from '@domain/external-document/external-document.client.port';
  import { Platform } from '@domain/enrollment/enrollment.type';
  @@ -8,12 +9,14 @@ import { Platform } from '@domain/enrollment/enrollment.type';
  describe('DocumentService', () => {
  const internalDocumentClient = mock<InternalDocumentClientPort>();
  const externalDocumentClient = mock<ExternalDocumentClientPort>();
- const documentGenerator = mock<DocumentGeneratorServicePort>();

* const service = new DocumentService(internalDocumentClient, externalDocumentClient);

- const service = new DocumentService(internalDocumentClient, externalDocumentClient, documentGenerator);

  beforeEach(() => {
  mockClear(internalDocumentClient);
  mockClear(externalDocumentClient);

- mockClear(documentGenerator);
  vi.clearAllMocks();
  });

@@ -50,4 +53,28 @@ describe('DocumentService', () => {
expect(result).toBe(externalPath);
});
});

-
- describe('generateAndUploadFormalAgreement', () => {
- it('should generate and upload formal agreement', async () => {
-      const payload = {
-        organization: { siren: '123', siret: '12345678901234', businessName: 'Acme' },
-        address: '123_456',
-        startDate: new Date('2025-01-01'),
-        organizationId: 'org-456',
-      };
-      const generated = { content: Buffer.from('pdf'), fileName: 'formal-agreement.pdf' };
-      documentGenerator.generateFormalAgreement.mockResolvedValue(generated);
-      internalDocumentClient.uploadDocument.mockResolvedValue('doc-formal-789');
-
-      const result = await service.generateAndUploadFormalAgreement(payload);
-
-      expect(documentGenerator.generateFormalAgreement).toHaveBeenCalledWith(payload);
-      expect(internalDocumentClient.uploadDocument).toHaveBeenCalledWith({
-        organizationId: payload.organizationId,
-        fileName: generated.fileName,
-        fileContent: generated.content,
-      });
-      expect(result).toBe('doc-formal-789');
- });
- });
  });
  diff --git a/services/od-pdp/src/domain/enrollment/enrollment.repository.port.ts b/services/od-pdp/src/domain/enrollment/enrollment.repository.port.ts
  index d883f7d80a..b96774325a 100644
  --- a/services/od-pdp/src/domain/enrollment/enrollment.repository.port.ts
  +++ b/services/od-pdp/src/domain/enrollment/enrollment.repository.port.ts
  @@ -22,11 +22,15 @@ export abstract class EnrollmentRepositoryPort implements DrivenPort {
  ): Promise<void>;
  }

+export interface CreateEnrollmentDocuments extends Documents {

- formalAgreementInternalDocumentId: string;
  +}
- export interface CreateEnrollmentInput {
  address: string;
  platform: Platform;
  features: Features;

* documents: Documents;

- documents: CreateEnrollmentDocuments;
  organization: Organization;
  startDate: Date;
  endDate?: Date;
  diff --git a/services/od-pdp/src/domain/enrollment/enrollment.service.test.ts b/services/od-pdp/src/domain/enrollment/enrollment.service.test.ts
  index 891c8deec2..69823d5cd3 100644
  --- a/services/od-pdp/src/domain/enrollment/enrollment.service.test.ts
  +++ b/services/od-pdp/src/domain/enrollment/enrollment.service.test.ts
  @@ -19,6 +19,7 @@ describe('EnrollmentService', () => {
  const mockPlatformRouterServicePickEnrollmentPlatform = vi.fn();
  const mockDocumentServiceDownloadInternal = vi.fn();
  const mockDocumentServiceUploadExternal = vi.fn();
- const mockDocumentServiceGenerateAndUploadFormalAgreement = vi.fn();
  const service = new EnrollmentService(
  {
  @@ -37,6 +38,7 @@ describe('EnrollmentService', () => {
  {
  downloadInternal: mockDocumentServiceDownloadInternal,
  uploadExternal: mockDocumentServiceUploadExternal,
-      generateAndUploadFormalAgreement: mockDocumentServiceGenerateAndUploadFormalAgreement,
  } as unknown as DocumentServicePort,
  );

@@ -46,13 +48,16 @@ describe('EnrollmentService', () => {
mockPlatformRouterServicePickEnrollmentPlatform.mockResolvedValue(Platform.DOXALLIA);
mockDocumentServiceDownloadInternal.mockClear();
mockDocumentServiceUploadExternal.mockClear();

- mockDocumentServiceGenerateAndUploadFormalAgreement.mockClear();

- mockDocumentServiceGenerateAndUploadFormalAgreement.mockResolvedValue(randomUUID());
  mockDocumentServiceDownloadInternal.mockResolvedValue(Buffer.from('pdf'));
  mockDocumentServiceUploadExternal.mockResolvedValueOnce('ext-am-id').mockResolvedValueOnce('ext-fa-id');
  });

describe('enrollAddress', () => {
it('should successfully enroll organization address', async () => {

-      const formalAgreementDocId = randomUUID();
         const input: EnrollAddressInput = {
           organization: {
             id: randomUUID(),
  @@ -72,7 +77,7 @@ describe('EnrollmentService', () => {
  },
  documents: {
  appointmentMandateInternalDocumentId: randomUUID(),

*          formalAgreementInternalDocumentId: randomUUID(),

-          formalAgreementInternalDocumentId: formalAgreementDocId,
           },
           startDate: new Date(),
           endDate: new Date(),
  @@ -87,7 +92,10 @@ describe('EnrollmentService', () => {
  organization: input.organization,
  address: input.address,
  features: input.features,

*          documents: input.documents,

-          documents: {
-            appointmentMandateInternalDocumentId: input.documents.appointmentMandateInternalDocumentId,
-            formalAgreementInternalDocumentId: formalAgreementDocId,
-          },
             startDate: input.startDate,
             endDate: input.endDate,
             platform: Platform.DOXALLIA,
  diff --git a/services/od-pdp/src/domain/enrollment/enrollment.service.ts b/services/od-pdp/src/domain/enrollment/enrollment.service.ts
  index e5ea9250a3..2cb3221711 100644
  --- a/services/od-pdp/src/domain/enrollment/enrollment.service.ts
  +++ b/services/od-pdp/src/domain/enrollment/enrollment.service.ts
  @@ -29,17 +29,18 @@ export class EnrollmentService implements EnrollmentServicePort {
  await this.enrollmentRepository.create({
  ...input,
-      documents: {
-        appointmentMandateInternalDocumentId: input.documents.appointmentMandateInternalDocumentId,
-        formalAgreementInternalDocumentId: input.documents.formalAgreementInternalDocumentId,
-      },
       platform,
       eventRawData: JSON.stringify(input),
  });

* const internalDocuments = [
*      input.documents.appointmentMandateInternalDocumentId,
*      input.documents.formalAgreementInternalDocumentId,
* ];
* const [appointmentMandateInternalDocument, formalAgreementInternalDocument] = await Promise.all(
*      internalDocuments.map(documentId => this.documentService.downloadInternal(documentId)),
* );

- const [appointmentMandateInternalDocument, formalAgreementInternalDocument] = await Promise.all([
-      this.documentService.downloadInternal(input.documents.appointmentMandateInternalDocumentId),
-      this.documentService.downloadInternal(input.documents.formalAgreementInternalDocumentId),
- ]);
  const externalDocuments = [
  {
  diff --git a/services/od-pdp/src/domain/internal-document/internal-document.client.port.ts b/services/od-pdp/src/domain/internal-document/internal-document.client.port.ts
  index fffd7fe19c..016f41fd63 100644
  --- a/services/od-pdp/src/domain/internal-document/internal-document.client.port.ts
  +++ b/services/od-pdp/src/domain/internal-document/internal-document.client.port.ts
  @@ -1,5 +1,12 @@
  import { DrivenPort } from '@domain/hexagonal';

+export interface UploadDocumentParams {

- organizationId: string;
- fileName: string;
- fileContent: Buffer;
  +}
- export abstract class InternalDocumentClientPort implements DrivenPort {
  abstract downloadDocument(documentId: string): Promise<Buffer>;
- abstract uploadDocument(params: UploadDocumentParams): Promise<string>;
  }
  diff --git a/services/od-pdp/src/domain/internal-document/internal-document.error.ts b/services/od-pdp/src/domain/internal-document/internal-document.error.ts
  index a93b3ba4e9..1bb5730847 100644
  --- a/services/od-pdp/src/domain/internal-document/internal-document.error.ts
  +++ b/services/od-pdp/src/domain/internal-document/internal-document.error.ts
  @@ -4,3 +4,10 @@ export class InternalDocumentDownloadError extends Error {
  this.name = 'InternalDocumentDownloadError';
  }
  }
- +export class InternalDocumentUploadError extends Error {
- constructor(cause?: string) {
- super(`Failed to upload internal document - cause : ${cause}`);
- this.name = 'InternalDocumentUploadError';
- }
  +}
  diff --git a/services/od-pdp/src/driven/document/document-generator.service.test.ts b/services/od-pdp/src/driven/document/document-generator.service.test.ts
  new file mode 100644
  index 0000000000..abf4ea4b96
  --- /dev/null
  +++ b/services/od-pdp/src/driven/document/document-generator.service.test.ts
  @@ -0,0 +1,35 @@
  +import { beforeEach, describe, expect, it, vi } from 'vitest';
  +import { mock } from 'vitest-mock-extended';
  +import { DocumentGeneratorService } from './document-generator.service';
  +import { TemplateService } from './template.service';
  +import { PdfService } from './pdf.service';
  +import { FormalAgreementPayload } from '@domain/document/document-generator-service.port';
- +describe('DocumentGeneratorService', () => {
- const templateService = mock<TemplateService>();
- const pdfService = mock<PdfService>();
- const service = new DocumentGeneratorService(templateService, pdfService);
-
- const payload: FormalAgreementPayload = {
- organization: { siren: '123', siret: '12345678901234', businessName: 'Test Org' },
- address: '123456789',
- startDate: new Date('2025-01-01'),
- };
-
- beforeEach(() => {
- vi.clearAllMocks();
- templateService.createFormalAgreement.mockReturnValue('<html>formal</html>');
- pdfService.getPdfBufferFromHtml.mockResolvedValue(Buffer.from('pdf-content'));
- });
-
- it('should generate formal agreement by combining template and PDF', async () => {
- const result = await service.generateFormalAgreement(payload);
-
- expect(templateService.createFormalAgreement).toHaveBeenCalledWith(payload);
- expect(pdfService.getPdfBufferFromHtml).toHaveBeenCalledWith('<html>formal</html>');
- expect(result).toEqual({
-      content: Buffer.from('pdf-content'),
-      fileName: 'formal-agreement.pdf',
- });
- });
  +});
  diff --git a/services/od-pdp/src/driven/document/document-generator.service.ts b/services/od-pdp/src/driven/document/document-generator.service.ts
  new file mode 100644
  index 0000000000..2e2fd6f992
  --- /dev/null
  +++ b/services/od-pdp/src/driven/document/document-generator.service.ts
  @@ -0,0 +1,25 @@
  +import { Injectable } from '@nestjs/common';
  +import {
- DocumentGeneratorServicePort,
- FormalAgreementPayload,
- GeneratedDocument,
  +} from '@domain/document/document-generator-service.port';
  +import { TemplateService } from './template.service';
  +import { PdfService } from './pdf.service';
- +@Injectable()
  +export class DocumentGeneratorService implements DocumentGeneratorServicePort {
- constructor(
- private readonly templateService: TemplateService,
- private readonly pdfService: PdfService,
- ) {}
-
- async generateFormalAgreement(payload: FormalAgreementPayload): Promise<GeneratedDocument> {
- const html = this.templateService.createFormalAgreement(payload);
- const content = await this.pdfService.getPdfBufferFromHtml(html);
- return {
-      content,
-      fileName: 'formal-agreement.pdf',
- };
- }
  +}
  diff --git a/services/od-pdp/src/driven/document/document.error.ts b/services/od-pdp/src/driven/document/document.error.ts
  new file mode 100644
  index 0000000000..275f4c14bb
  --- /dev/null
  +++ b/services/od-pdp/src/driven/document/document.error.ts
  @@ -0,0 +1,9 @@
  +export class DocumentError extends Error {
- constructor(message: string, cause?: unknown) {
- super(message);
- this.name = 'DocumentError';
- if (cause instanceof Error) {
-      this.cause = cause;
- }
- }
  +}
  diff --git a/services/od-pdp/src/driven/document/pdf.service.ts b/services/od-pdp/src/driven/document/pdf.service.ts
  new file mode 100644
  index 0000000000..6202095f4c
  --- /dev/null
  +++ b/services/od-pdp/src/driven/document/pdf.service.ts
  @@ -0,0 +1,27 @@
  +import { Injectable } from '@nestjs/common';
  +import { DocumentError } from './document.error';
  +import { PdfClient } from '@driven/http/pdf/pdf.client';
- +@Injectable()
  +export class PdfService {
- constructor(private readonly pdfClient: PdfClient) {}
-
- async getPdfBufferFromHtml(fileContent: string): Promise<Buffer> {
- if (!fileContent) {
-      throw new DocumentError('HTML content is required to generate the PDF');
- }
- try {
-      const buffer = await this.pdfClient.convertHTML({
-        pdfa: 'PDF/A-3b',
-        preferCssPageSize: true,
-        files: { index: fileContent },
-      });
-      if (!buffer) {
-        throw new DocumentError('PDF service returned empty buffer');
-      }
-      return buffer;
- } catch (error) {
-      throw new DocumentError('Failed to generate the PDF from the HTML', error);
- }
- }
  +}
  diff --git a/services/od-pdp/src/driven/document/template.service.tsx b/services/od-pdp/src/driven/document/template.service.tsx
  new file mode 100644
  index 0000000000..4cfe551e78
  --- /dev/null
  +++ b/services/od-pdp/src/driven/document/template.service.tsx
  @@ -0,0 +1,49 @@
  +import React from 'react';
  +import { Injectable } from '@nestjs/common';
  +import { renderToStaticMarkup } from 'react-dom/server';
  +import { FormalAgreement } from '@kolecto/enrollment-templates';
  +import { FormalAgreementPayload } from '@domain/document/document-generator-service.port';
  +import { KOLECT_SIGNATURE_BASE_64 } from '../../assets/base-64-assets';
  +import { DocumentError } from './document.error';
- +const KOLECTO_PDP_INFORMATION = {
- siren: '950955542',
- businessName: 'KOLECTO PDP',
- headOffice: '50 rue de la Boétie, 75008, Paris France',
- registrationNumber: '0039',
  +};
- +@Injectable()
  +export class TemplateService {
- createFormalAgreement({ organization, address, startDate }: FormalAgreementPayload): string {
- try {
-      const appointmentMandatDate = startDate.toISOString().slice(0, 10).replaceAll('-', '');
-      return renderToStaticMarkup(
-        <FormalAgreement
-          company={{
-            siren: organization.siren,
-            siret: organization.siret,
-            headOffice: '',
-            businessName: organization.businessName,
-          }}
-          eAddress={address}
-          representative={KOLECTO_PDP_INFORMATION}
-          signatureDate={startDate}
-          eAddressEffectiveDate={new Date('2026-04-12')}
-          user={{
-            firstName: 'Neïla',
-            lastName: 'Choukri',
-            position: 'Directrice Générale de Kolecto',
-          }}
-          appointmentMandatId={`${organization.siren}_${KOLECTO_PDP_INFORMATION.siren}_${appointmentMandatDate}_01`}
-          companySignatureUrl={`data:image/png;base64,${KOLECT_SIGNATURE_BASE_64}`}
-        />,
-      );
- } catch (error) {
-      throw new DocumentError(
-        `Failed to render the formal agreement for enrolling ${address} under the organization ${organization.businessName}.`,
-        error,
-      );
- }
- }
  +}
  diff --git a/services/od-pdp/src/driven/http/internal-document/internal-document.client.test.ts b/services/od-pdp/src/driven/http/internal-document/internal-document.client.test.ts
  index 1fa544b435..d3cc8c7c22 100644
  --- a/services/od-pdp/src/driven/http/internal-document/internal-document.client.test.ts
  +++ b/services/od-pdp/src/driven/http/internal-document/internal-document.client.test.ts
  @@ -3,15 +3,34 @@ import { InternalDocumentClient } from './internal-document.client';
  import { setupServer } from 'msw/node';
  import { http, HttpResponse } from 'msw';

-const DOCUMENT_SERVICE_URL = 'http://document-service.dev.internal.kolecto.fr';
+const DOCUMENT_SERVICE_URL = 'http://127.0.0.1:9876';
const DOCUMENT_ID = 'doc-123';
+const UPLOADED_DOC_ID = 'uploaded-doc-456';
const DOCUMENT_CONTENT = Buffer.from('pdf-content');
const DOCUMENT_SERVICE_TIMEOUT_MS = '5000';
+const ORG_ID = 'org-789';

const server = setupServer(
http.get(`${DOCUMENT_SERVICE_URL}/v1/documents/${DOCUMENT_ID}`, () => {
return HttpResponse.arrayBuffer(DOCUMENT_CONTENT.buffer);
}),

- http.post(`${DOCUMENT_SERVICE_URL}/v1/organizations/:orgId/documents/upload-links`, async ({ request }) => {
- const body = (await request.json()) as { files: Record<string, unknown> };
- const fileId = Object.keys(body.files ?? {})[0] ?? 'fallback';
- const uploadUrl = `${DOCUMENT_SERVICE_URL}/v1/upload/presigned`;
- return HttpResponse.json({
-      outcome: 'ok',
-      entity: {
-        [fileId]: {
-          url: uploadUrl,
-          documentId: UPLOADED_DOC_ID,
-          mimeType: 'application/pdf',
-          fields: { key: 'value' },
-        },
-      },
- });
- }),
- http.post(`${DOCUMENT_SERVICE_URL}/v1/upload/presigned`, () => HttpResponse.json({})),
  );

describe('InternalDocumentClient', () => {
@@ -48,4 +67,16 @@ describe('InternalDocumentClient', () => {

     await expect(client.downloadDocument('unknown')).rejects.toThrow();

});

-
- it('should upload a document and return document id', async () => {
- const client = new InternalDocumentClient();
-
- const result = await client.uploadDocument({
-      organizationId: ORG_ID,
-      fileName: 'formal-agreement.pdf',
-      fileContent: DOCUMENT_CONTENT,
- });
-
- expect(result).toBe(UPLOADED_DOC_ID);
- });
  });
  diff --git a/services/od-pdp/src/driven/http/internal-document/internal-document.client.ts b/services/od-pdp/src/driven/http/internal-document/internal-document.client.ts
  index ca971b96c4..f83baecc9b 100644
  --- a/services/od-pdp/src/driven/http/internal-document/internal-document.client.ts
  +++ b/services/od-pdp/src/driven/http/internal-document/internal-document.client.ts
  @@ -1,10 +1,26 @@
  import axios, { type AxiosInstance } from 'axios';
  -import { InternalDocumentClientPort } from '@domain/internal-document/internal-document.client.port';
  +import FormData from 'form-data';
  +import { randomUUID } from 'node:crypto';
  +import {
- InternalDocumentClientPort,
- UploadDocumentParams,
  +} from '@domain/internal-document/internal-document.client.port';
  import { getEnvOrDefault, getEnvOrThrow } from '../../../env-vars';
  import { Injectable } from '@nestjs/common';
  -import { InternalDocumentDownloadError } from '@domain/internal-document/internal-document.error';
  +import {
- InternalDocumentDownloadError,
- InternalDocumentUploadError,
  +} from '@domain/internal-document/internal-document.error';
  import { extractErrorStack } from '@shared/utils';

+const UPLOAD_USER_ID = 'od-pdp-service';
+const MIME_PDF = 'application/pdf';

- +interface UploadLinkResponse {
- outcome: string;
- entity: Record<string, { url: string; documentId: string; mimeType: string; fields: Record<string, string> }>;
  +}
- @Injectable()
  export class InternalDocumentClient implements InternalDocumentClientPort {
  private readonly httpClient: AxiosInstance;
  @@ -16,6 +32,47 @@ export class InternalDocumentClient implements InternalDocumentClientPort {
  });
  }
- async uploadDocument({ organizationId, fileName, fileContent }: UploadDocumentParams): Promise<string> {
- const fileId = randomUUID();
- const useCase = `enrollment-${fileName.replace(/\.pdf$/i, '')}`;
- try {
-      const { data } = await this.httpClient.post<UploadLinkResponse>(
-        `/v1/organizations/${organizationId}/documents/upload-links`,
-        {
-          createdBy: UPLOAD_USER_ID,
-          isHistorical: true,
-          files: {
-            [fileId]: {
-              fileSize: fileContent.byteLength,
-              fileName,
-              mimeType: MIME_PDF,
-              externalId: undefined,
-              requiresOCR: false,
-              useCase,
-            },
-          },
-        },
-      );
-      const link = data.entity?.[fileId];
-      if (!link?.url || !link.documentId) {
-        throw new Error('Invalid upload link response');
-      }
-      const formData = new FormData();
-      formData.append('Content-Type', link.mimeType ?? MIME_PDF);
-      for (const [key, value] of Object.entries(link.fields ?? {})) {
-        formData.append(key, value);
-      }
-      formData.append('file', fileContent);
-      await this.httpClient.post(link.url, formData, {
-        headers: formData.getHeaders(),
-      });
-      return link.documentId;
- } catch (error) {
-      const cause = extractErrorStack(error);
-      throw new InternalDocumentUploadError(cause);
- }
- }
- async downloadDocument(documentId: string): Promise<Buffer> {
  try {
  const { data } = await this.httpClient.get<ArrayBuffer>(`/v1/documents/${documentId}`, {
  diff --git a/services/od-pdp/src/driven/http/pdf/pdf.client.ts b/services/od-pdp/src/driven/http/pdf/pdf.client.ts
  new file mode 100644
  index 0000000000..0c9cdc44de
  --- /dev/null
  +++ b/services/od-pdp/src/driven/http/pdf/pdf.client.ts
  @@ -0,0 +1,35 @@
  +import { Injectable } from '@nestjs/common';
  +import FormData from 'form-data';
  +import axios, { type AxiosInstance } from 'axios';
  +import { getEnvOrDefault, getEnvOrThrow } from '../../../env-vars';
- +interface ConvertHtmlParams {
- preferCssPageSize: boolean;
- pdfa: 'PDF/A-1b' | 'PDF/A-2b' | 'PDF/A-3b';
- files: { index: string };
  +}
- +@Injectable()
  +export class PdfClient {
- private readonly httpClient: AxiosInstance;
-
- constructor() {
- this.httpClient = axios.create({
-      baseURL: getEnvOrThrow('PDF_SERVICE_URL'),
-      timeout: Number(getEnvOrDefault('PDF_SERVICE_TIMEOUT_MS', '30000')),
- });
- }
-
- async convertHTML({ pdfa, preferCssPageSize, files }: ConvertHtmlParams): Promise<Buffer> {
- const formData = new FormData();
- formData.append('pdfa', pdfa);
- formData.append('preferCssPageSize', `${preferCssPageSize}`);
- formData.append('files', files.index, 'index.html');
-
- const response = await this.httpClient.post<ArrayBuffer>('/forms/chromium/convert/html', formData, {
-      headers: formData.getHeaders(),
-      responseType: 'arraybuffer',
- });
- return Buffer.from(response.data);
- }
  +}
  diff --git a/services/od-pdp/src/driving/nest/http/http.module.ts b/services/od-pdp/src/driving/nest/http/http.module.ts
  index 0b48bd3b78..7770179a04 100644
  --- a/services/od-pdp/src/driving/nest/http/http.module.ts
  +++ b/services/od-pdp/src/driving/nest/http/http.module.ts
  @@ -13,6 +13,11 @@ import { PlatformRouterPort } from '@domain/platform-router/platform-router.port
  import { PlatformRouterService } from '@domain/platform-router/platform-router.service';
  import { DocumentServicePort } from '@domain/document/document.service.port';
  import { DocumentService } from '@domain/document/document.service';
  +import { DocumentGeneratorServicePort } from '@domain/document/document-generator-service.port';
  +import { DocumentGeneratorService } from '@driven/document/document-generator.service';
  +import { TemplateService } from '@driven/document/template.service';
  +import { PdfService } from '@driven/document/pdf.service';
  +import { PdfClient } from '@driven/http/pdf/pdf.client';
  import { InternalDocumentClientPort } from '@domain/internal-document/internal-document.client.port';
  import { InternalDocumentClient } from '@driven/http/internal-document/internal-document.client';
  import { ExternalDocumentClientPort } from '@domain/external-document/external-document.client.port';
  @@ -25,6 +30,10 @@ import { ExternalDocumentClient } from '@driven/http/external-document/external-
  { provide: APP_INTERCEPTOR, useClass: LoggerInterceptor },
  { provide: EnrollmentServicePort, useClass: EnrollmentService },
  { provide: PlatformRouterPort, useClass: PlatformRouterService },
- { provide: DocumentGeneratorServicePort, useClass: DocumentGeneratorService },
- TemplateService,
- PdfService,
- PdfClient,
  { provide: InternalDocumentClientPort, useClass: InternalDocumentClient },
  { provide: ExternalDocumentClientPort, useClass: ExternalDocumentClient },
  { provide: DocumentServicePort, useClass: DocumentService },
  diff --git a/services/od-pdp/src/driving/nest/sqs/dto/enrollment.dto.ts b/services/od-pdp/src/driving/nest/sqs/dto/enrollment.dto.ts
  index e0b488dd0e..b835220bfb 100644
  --- a/services/od-pdp/src/driving/nest/sqs/dto/enrollment.dto.ts
  +++ b/services/od-pdp/src/driving/nest/sqs/dto/enrollment.dto.ts
  @@ -88,6 +88,11 @@ export class EnrollmentCreatedDto {
  }
  }

+/\*_ Raw inbound payload: formalAgreementInternalDocumentId may be missing (consumer enriches before validation) _/
+export type EnrollmentCreatedRawDetail = Omit<EnrollmentCreatedDto, 'documents'> & {

- documents: { appointmentMandateInternalDocumentId: string; formalAgreementInternalDocumentId?: string };
  +};
- export class EnrollmentAddressMigratedDto {
  static readonly detailType = 'address.migrated';

diff --git a/services/od-pdp/src/driving/nest/sqs/enrollment.consumer.ts b/services/od-pdp/src/driving/nest/sqs/enrollment.consumer.ts
index be94f9756d..c5add57d7b 100644
--- a/services/od-pdp/src/driving/nest/sqs/enrollment.consumer.ts
+++ b/services/od-pdp/src/driving/nest/sqs/enrollment.consumer.ts
@@ -30,7 +30,8 @@ export class EnrollmentConsumer extends SqsConsumer implements OnModuleInit, OnM
}

private async handleEnrollmentCreated(detail: unknown): Promise<void> {

- const enrollmentCreatedDto = await EnrollmentCreatedDto.parseAndValidate(detail);

* const enrichedDetail = await this.enrichFormalAgreementIfMissing(detail);
* const enrollmentCreatedDto = await EnrollmentCreatedDto.parseAndValidate(enrichedDetail);
  await this.enrollmentService.enrollAddress(enrollmentCreatedDto);
  }

@@ -38,4 +39,27 @@ export class EnrollmentConsumer extends SqsConsumer implements OnModuleInit, OnM
const enrollmentAddressMigratedDto = await EnrollmentAddressMigratedDto.parseAndValidate(detail);
await this.enrollmentService.migrateAddress(enrollmentAddressMigratedDto);
}

-
- private async enrichFormalAgreementIfMissing(detail: unknown): Promise<unknown> {
- const d = detail as {
-      documents?: { formalAgreementInternalDocumentId?: string };
-      organization?: { id: string; siren: string; siret: string; businessName: string };
-      address?: string;
-      startDate?: Date;
- };
- if (!d?.documents?.formalAgreementInternalDocumentId && d?.organization && d?.address && d?.startDate) {
-      const id = await this.DocumentService.generateAndUploadFormalAgreement({
-        organization: {
-          siren: d.organization.siren,
-          siret: d.organization.siret,
-          businessName: d.organization.businessName,
-        },
-        address: d.address,
-        startDate: d.startDate instanceof Date ? d.startDate : new Date(d.startDate),
-        organizationId: d.organization.id,
-      });
-      return { ...d, documents: { ...d.documents, formalAgreementInternalDocumentId: id } };
- }
- return detail;
- }
  }
  diff --git a/services/od-pdp/src/driving/nest/sqs/sqs.module.ts b/services/od-pdp/src/driving/nest/sqs/sqs.module.ts
  index e53ff198aa..3ff8b9354a 100644
  --- a/services/od-pdp/src/driving/nest/sqs/sqs.module.ts
  +++ b/services/od-pdp/src/driving/nest/sqs/sqs.module.ts
  @@ -13,6 +13,11 @@ import { PlatformRouterPort } from '@domain/platform-router/platform-router.port
  import { PlatformRouterService } from '@domain/platform-router/platform-router.service';
  import { DocumentServicePort } from '@domain/document/document.service.port';
  import { DocumentService } from '@domain/document/document.service';
  +import { DocumentGeneratorServicePort } from '@domain/document/document-generator-service.port';
  +import { DocumentGeneratorService } from '@driven/document/document-generator.service';
  +import { TemplateService } from '@driven/document/template.service';
  +import { PdfService } from '@driven/document/pdf.service';
  +import { PdfClient } from '@driven/http/pdf/pdf.client';
  import { InternalDocumentClientPort } from '@domain/internal-document/internal-document.client.port';
  import { InternalDocumentClient } from '@driven/http/internal-document/internal-document.client';
  import { ExternalDocumentClientPort } from '@domain/external-document/external-document.client.port';
  @@ -25,6 +30,10 @@ import { ExternalDocumentClient } from '@driven/http/external-document/external-
  EnrollmentConsumer,
  { provide: EnrollmentServicePort, useClass: EnrollmentService },
  { provide: PlatformRouterPort, useClass: PlatformRouterService },
- { provide: DocumentGeneratorServicePort, useClass: DocumentGeneratorService },
- TemplateService,
- PdfService,
- PdfClient,
  { provide: InternalDocumentClientPort, useClass: InternalDocumentClient },
  { provide: ExternalDocumentClientPort, useClass: ExternalDocumentClient },
  { provide: DocumentServicePort, useClass: DocumentService },
  diff --git a/services/od-pdp/tsconfig.json b/services/od-pdp/tsconfig.json
  index 682f964909..e01c4fe301 100644
  --- a/services/od-pdp/tsconfig.json
  +++ b/services/od-pdp/tsconfig.json
  @@ -19,6 +19,7 @@
  "incremental": true,
  "strictNullChecks": true,
  "forceConsistentCasingInFileNames": true,
- "jsx": "react-jsx",
  "noImplicitAny": false,
  "strictBindCallApply": false,
  "noFallthroughCasesInSwitch": false,
  @@ -35,6 +36,6 @@
  "@test-utils/_": ["./src/test-utils/_"]
  }
  },

* "include": ["drizzle*.config.ts", "src/**/*.ts", "src/**/*.json", "generated/**/*.ts"],

- "include": ["drizzle*.config.ts", "src/**/*.ts", "src/**/*.tsx", "src/**/*.json", "generated/**/*.ts"],
  "exclude": ["node_modules", "dist"]
  }
