# createFormalAgreement – Migration Reference for od-pdp

Comprehensive file inventory, flow, and full file contents for migrating the formal agreement layer to od-pdp service.

---

## Flow (as-is)

1. **Trigger**: `EnrollmentRequestedConsumer` receives `enrollment.requested` event → calls `enrollmentService.enrollAddress()`
2. **Generation**: `EnrollmentService.uploadDocuments()` → `DocumentGeneratorService.generateLegalDocuments()` → `createFormalAgreement()` (parallel with appointment mandate)
3. **Template**: `TemplateService.createFormalAgreement()` renders React `FormalAgreement` to HTML
4. **PDF**: `PdfService.getPdfBufferFromHtml()` → `PdfClient.convertHTML()` (external PDF service)
5. **Upload**: `DocumentStorageService.uploadLegalDocuments()` → `InternalStorageService.getUploadLinks()` + `uploadDocument()` → `DocumentClient` (document service API)
6. **Persistence**: `EnrollmentRepository.updateEnrollmentDocuments()` stores `formalAgreementInternalDocumentId`
7. **Event**: `EnrollmentDispatcher.sendEnrollmentCreatedEvent()` with `formalAgreementInternalDocumentId`

---

## Template

### `packages/enrollment-templates/src/formal-agreement/FormalAgreement.tsx`

```tsx
'use client';
/* eslint-disable max-lines */
import { Trans } from 'react-i18next';
import { previewI18n } from '../i18n.js';
import { Accent } from './components/Accent.js';
import { Cell } from './components/Cell.js';
import { NumberCell } from './components/NumberCell.js';
import { Red } from './components/Red.js';
import { SectionRow } from './components/SectionRow.js';
import { Underline } from './components/Underline.js';

const t = previewI18n.getFixedT(previewI18n.language, 'formalAgreement');

interface FormalAgreementProps {
  company: { businessName: string; siret: string; siren: string; headOffice: string };
  eAddress: string;
  secondaryEAddresses?: string[];
  additionalRoutingEAddresses?: string[];
  representative: { businessName: string; siren: string; headOffice: string; registrationNumber?: string };
  previousRepresentative?: { businessName: string; siren: string; registrationNumber: string };
  signatureDate: Date;
  eAddressEffectiveDate: Date;
  user: { firstName: string; lastName: string; position?: string };
  appointmentMandatId: string;
  companySignatureUrl?: string;
}

const Label = Underline;
const Value = Red;

export const FormalAgreement = ({
  company, previousRepresentative, appointmentMandatId, signatureDate,
  eAddressEffectiveDate, additionalRoutingEAddresses, secondaryEAddresses,
  eAddress, representative, user, companySignatureUrl,
}: FormalAgreementProps) => (
  <div style={{ fontFamily: 'Calibri, Arial, sans-serif', fontSize: 14, color: '#222', padding: 16 }}>
    <h1 style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 56 }}>{t('title')}</h1>
    <div style={{ display: 'grid', gridAutoFlow: 'row', gap: 4 }}>
      <SectionRow variant="primary"><NumberCell>1.</NumberCell>...company fields...</SectionRow>
      <SectionRow variant="secondary"><NumberCell>2.</NumberCell>...PDP fields...</SectionRow>
      <SectionRow variant="primary"><NumberCell>3.</NumberCell>...eAddressEffectiveDate...</SectionRow>
      <SectionRow variant="secondary"><NumberCell>4.</NumberCell>...eAddress, secondary, additional...</SectionRow>
      <SectionRow variant="primary"><NumberCell>5.</NumberCell>...previousRepresentative...</SectionRow>
      <SectionRow variant="secondary"><NumberCell>6.</NumberCell>...appointmentMandatId...</SectionRow>
      <SectionRow variant="primary"><NumberCell>7.</NumberCell>...user, signatureDate, companySignatureUrl...</SectionRow>
    </div>
  </div>
);
```

Full component: 7 numbered sections (company, PDP, effective date, addresses, old PDP, mandate id, signature). Uses `Trans` + i18n keys from `fr.json`, `Cell`/`Label`/`Value` for layout.

**Dependencies**: `Accent`, `Cell`, `NumberCell`, `Red`, `SectionRow`, `Underline`, `previewI18n`, `fr.json` (i18n).

### `packages/enrollment-templates/src/formal-agreement/fr.json`

```json
{
  "section-1": {
    "company-name": "Dénomination Sociale :",
    "postal-address": "Adresse postale",
    "siren-number": "N° de SIREN :",
    "title": "<bold>Assujetti donnant mandat à une PDP</bold> (désigné en <accent>2</accent>) pour inscrire une ou plusieurs adresses de facturation électronique de réception de facture dans l'annuaire PPF :"
  },
  "section-2": {
    "pdp-name": "Dénomination Sociale :",
    "pdp-registration-number": "N° de matricule* :",
    "pdp-siren-number": "N° de SIREN* :",
    "title": "<bold>PDP désignée par l'Assujetti</bold> (désigné en <accent>1</accent>) pour inscrire une ou plusieurs adresses de facturation électroniques de réception de factures dans l'Annuaire PPF :"
  },
  "section-3": {
    "effective-date": "Date effective",
    "title": "<bold>Date à partir de laquelle l'Assujetti (désigné en <accent>1</accent>) souhaite que l'exécution de ce mandat soit effective :</bold>"
  },
  "section-4": {
    "additional-electronic-addresses": "<label>Adresses électroniques additionnelles dans chaque établissement</label> (SIREN_SIRET_CODEROUTAGE, XXX tout CODE_ROUTAGE existant à venir)",
    "functional-electronic-addresses": "<label>Adresses électroniques fonctionnelles de la forme SIREN-SUFFIXE</label> <italic>(par exemple SIREN_ACHATTYPE1, SIREN_XXX signifiant toutes les adresses de ce type)</italic>",
    "main-electronic-address": "Mon adresse électronique principale (SIREN)",
    "secondary-electronic-addresses": "<label>Adresses électroniques secondaires d'établissements</label> (SIREN_SIRET, SIREN_XXX signifiant tous les SIRET existants à venir)",
    "title": "Périmètre des adresses électroniques de réception confiées à la PDP désignée"
  },
  "section-5": {
    "notice": "* Le numéro de SIREN est obligatoire si la PDP en a un. À défaut, le numéro de matricule est obligatoire",
    "old-pdp-name": "Dénomination Sociale :",
    "old-pdp-registration-number": "N° de matricule* :",
    "old-pdp-siren-number": "N° de SIREN* :",
    "title": "<bold>Ancien opérateur PDP</bold> en charge de tout ou partie des adresses de réception de factures décrite au <accent>4</accent>"
  },
  "section-6": {
    "title": "<bold>Numéro de mandat :</bold> <italic>(SIRENEntreprise_SIRENPdp_AAAAMMJJ_Compteur)</italic> :"
  },
  "section-7": {
    "date": "Date :",
    "first-name": "Prénom :",
    "last-name": "Nom :",
    "position": "Fonction :",
    "signature": "Signature :",
    "title": "<bold>Signature du représentant légal de l'Assujetti au <accent>1</accent> d'un représentant disposant d'une délégation</bold>"
  },
  "title": "Modèle d'accord formel de désignation de la plateforme de réception des factures et de demande de mise à jour des adresses de facturation électronique de réception de factures"
}
```

### `packages/enrollment-templates/src/index.ts`

```ts
export * from './appointment-mandate/AppointmentMandate.js';
export * from './formal-agreement/FormalAgreement.js';
```

### `src/driven/document/template.service.tsx`

```tsx
import React from 'react';
import { Injectable } from '@nestjs/common';
import { renderToStaticMarkup } from 'react-dom/server';
import { CreateLegalDocumentsPayload } from '@domain/enrollment.type';
import { AppointmentMandate, FormalAgreement } from '@kolecto/enrollment-templates';
import { DrivenPort } from '@domain/hexagonal.type';
import { KOLECT_SIGNATURE_BASE_64 } from '../../assets/base-64-assets';
import { DocumentError } from '@driven/document/document.error';

export interface FormalAgreementPayload extends Omit<CreateLegalDocumentsPayload, 'user'> {}

@Injectable()
export class TemplateService implements DrivenPort {
  static readonly KOLECTO_PDP_INFORMATION = {
    siren: '950955542',
    businessName: 'KOLECTO PDP',
    headOffice: '50 rue de la Boétie, 75008, Paris France',
    registrationNumber: '0039',
  };

  createFormalAgreement({ organization, address, startDate }: FormalAgreementPayload): string {
    try {
      const appointmentMandatDate = startDate.toISOString().slice(0, 10).replaceAll('-', '');
      return renderToStaticMarkup(
        <FormalAgreement
          company={{
            siren: organization.siren,
            siret: organization.siret,
            headOffice: organization.headOffice,
            businessName: organization.businessName,
          }}
          eAddress={address}
          representative={TemplateService.KOLECTO_PDP_INFORMATION}
          signatureDate={startDate}
          eAddressEffectiveDate={new Date('2026-04-12')}
          user={{
            firstName: 'Neïla',
            lastName: 'Choukri',
            position: 'Directrice Générale de Kolecto',
          }}
          appointmentMandatId={`${organization.siren}_${TemplateService.KOLECTO_PDP_INFORMATION.siren}_${appointmentMandatDate}_01`}
          companySignatureUrl={`data:image/png;base64,${KOLECT_SIGNATURE_BASE_64}`}
        />,
      );
    } catch (error) {
      throw new DocumentError(
        `Failed to render the appointment mandate for enrolling ${address} under the organization ${organization.businessName}.`,
        error,
      );
    }
  }
}
```

### `src/assets/base-64-assets.ts`

```ts
export const KOLECT_SIGNATURE_BASE_64 =
  'iVBORw0KGgoAAAANSUhEUgAAAd8AAADGCAYAAACTroq/...'; // Full base64 PNG (~15KB) - see file
```

---

## Generation

### `src/driven/document/document-generator.service.ts`

```ts
import { Injectable } from '@nestjs/common';
import { TemplateService } from '@driven/document/template.service';
import { PdfService } from '@driven/document/pdf.service';
import { CreateLegalDocumentsPayload } from '@domain/enrollment.type';
import { randomUUID } from 'node:crypto';
import {
  LegalDocuments,
  DocumentGeneratorServicePort,
  LegalDocumentType,
  LegalDocument,
} from '@domain/document-generator-service.port';

@Injectable()
export class DocumentGeneratorService implements DocumentGeneratorServicePort {
  constructor(
    private readonly templateService: TemplateService,
    private readonly pdfService: PdfService,
  ) {}

  async generateLegalDocuments(data: CreateLegalDocumentsPayload): Promise<LegalDocuments> {
    const [appointmentMandate, formalAgreement] = await Promise.all([
      this.createAppointmentMandate(data),
      this.createFormalAgreement(data),
    ]);
    return { appointmentMandate, formalAgreement };
  }

  private async createFormalAgreement(data: CreateLegalDocumentsPayload): Promise<LegalDocument> {
    const fileContentAsHTML = this.templateService.createFormalAgreement(data);
    const fileContentAsBuffer = await this.pdfService.getPdfBufferFromHtml(fileContentAsHTML);
    if (!fileContentAsBuffer) {
      throw new Error('Failed to generate formal agreement PDF');
    }
    return { content: fileContentAsBuffer, id: randomUUID(), name: LegalDocumentType.FORMAL_AGREEMENT };
  }
}
```

### `src/domain/document-generator-service.port.ts`

```ts
import { DrivenPort } from '@domain/hexagonal.type';
import { CreateLegalDocumentsPayload } from '@domain/enrollment.type';

export enum LegalDocumentType {
  APPOINTMENT_MANDATE = 'appointment-mandate',
  FORMAL_AGREEMENT = 'formal-agreement',
}

export interface LegalDocument {
  id: string;
  content: Buffer;
  name: LegalDocumentType;
}

export interface LegalDocuments {
  appointmentMandate: LegalDocument;
  formalAgreement: LegalDocument;
}

export abstract class DocumentGeneratorServicePort implements DrivenPort {
  abstract generateLegalDocuments(data: CreateLegalDocumentsPayload): Promise<LegalDocuments>;
}
```

### `src/driven/document/pdf.service.ts`

```ts
import { Injectable } from '@nestjs/common';
import { DrivenPort } from '@domain/hexagonal.type';
import { DocumentError } from '@driven/document/document.error';
import { PdfClient } from '@driven/http/pdf.client';

@Injectable()
export class PdfService implements DrivenPort {
  constructor(private readonly pdfClient: PdfClient) {}

  async getPdfBufferFromHtml(fileContent: string): Promise<Buffer | undefined> {
    if (!fileContent) {
      throw new DocumentError('HTML content is required to generate the PDF');
    }
    try {
      return await this.pdfClient.convertHTML({
        pdfa: 'PDF/A-3b',
        preferCssPageSize: true,
        files: { index: fileContent },
      });
    } catch (error) {
      throw new DocumentError('Failed to generate the PDF from the HTML', error);
    }
  }
}
```

### `src/driven/http/pdf.client.ts`

```ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import FormData from 'form-data';
import { HttpClient } from '@driven/http/http-client';
import { AxiosInstance } from 'axios';

interface ConvertHtmlParams {
  preferCssPageSize: boolean;
  pdfa: 'PDF/A-1b' | 'PDF/A-2b' | 'PDF/A-3b';
  files: { index: string };
}

@Injectable()
export class PdfClient {
  private readonly httpClient: AxiosInstance;

  constructor(private readonly config: ConfigService) {
    this.httpClient = new HttpClient({
      baseURL: config.getOrThrow('PDF_SERVICE_URL'),
      timeout: config.get<number>('PDF_SERVICE_TIMEOUT_MS'),
    }).axiosInstance;
  }

  async convertHTML({ pdfa, preferCssPageSize, files }: ConvertHtmlParams): Promise<Buffer> {
    const formData = new FormData();
    formData.append('pdfa', pdfa);
    formData.append('preferCssPageSize', `${preferCssPageSize}`);
    formData.append('files', files.index, 'index.html');
    const response = await this.httpClient.post<Buffer>('/forms/chromium/convert/html', formData, {
      headers: formData.getHeaders(),
      responseType: 'arraybuffer',
    });
    return response.data;
  }
}
```

---

## Upload

### `src/driven/document/document-storage.service.ts`

```ts
import { Injectable, Logger } from '@nestjs/common';
import {
  ArchiveDocumentParams,
  CreateInternalLegalDocumentResult,
  CreateLegalDocumentResult,
  DocumentStorageServicePort,
  DownloadDocumentParams,
  UploadLegalDocumentsPayload,
} from '@domain/document-storage-service.port';
import { InternalStorageService } from '@driven/document/internal-storage.service';
import { extractErrorStack } from '@shared/utils';

@Injectable()
export class DocumentStorageService implements DocumentStorageServicePort {
  private readonly logger = new Logger(DocumentStorageService.name);

  constructor(private readonly internalStorageService: InternalStorageService) {}

  async uploadLegalDocuments(payload: UploadLegalDocumentsPayload): Promise<CreateLegalDocumentResult> {
    return await this.uploadToInternalStorage(payload);
  }

  async uploadToInternalStorage({
    userId,
    organizationId,
    documents: { appointmentMandate, formalAgreement },
  }: UploadLegalDocumentsPayload): Promise<CreateInternalLegalDocumentResult> {
    try {
      const files = [appointmentMandate, formalAgreement];
      const links = await this.internalStorageService.getUploadLinks({
        userId,
        organizationId,
        files,
      });
      const [appointmentMandateInternalDocumentId, formalAgreementInternalDocumentId] = await Promise.all(
        files.map(file => this.internalStorageService.uploadDocument(file.content, links[file.id])),
      );
      return { appointmentMandateInternalDocumentId, formalAgreementInternalDocumentId };
    } catch (error) {
      this.logger.error('Failed to upload documents to internal storage', extractErrorStack(error), {
        organizationId,
        userId,
      });
      throw error;
    }
  }
  // downloadDocument, archiveDocument...
}
```

### `src/driven/document/internal-storage.service.ts`

```ts
import { Injectable } from '@nestjs/common';
import { DrivenPort } from '@domain/hexagonal.type';
import { DocumentError } from '@driven/document/document.error';
import { DocumentClient } from '@driven/http/document.client';
import { LegalDocument } from '@domain/document-generator-service.port';
import { ArchiveDocumentParams, DownloadDocumentParams } from '@domain/document-storage-service.port';

export enum DocumentMimeType {
  PDF = 'application/pdf',
}

export interface UploadDocumentsParams {
  organizationId: string;
  userId: string;
  files: LegalDocument[];
}

interface UploadLink {
  url: string;
  documentId: string;
  fields: Record<string, string>;
}

@Injectable()
export class InternalStorageService implements DrivenPort {
  constructor(private readonly documentClient: DocumentClient) {}

  async uploadDocument(fileContent: Buffer, link: UploadLink): Promise<string> {
    try {
      await this.documentClient.uploadDocument(fileContent, {
        ...link,
        mimeType: 'application/pdf',
      });
      return link.documentId;
    } catch (error) {
      throw new DocumentError(`Failed to upload document ${link.documentId}`, error);
    }
  }

  async getUploadLinks({ files, organizationId, userId }: UploadDocumentsParams): Promise<Record<string, UploadLink>> {
    try {
      const { entity } = await this.documentClient.getUploadLinks(organizationId, {
        createdBy: userId,
        isHistorical: true,
        files: files.reduce(
          (acc, { id, name, content }) => ({
            ...acc,
            [id]: {
              fileSize: content.byteLength,
              fileName: `${name}.pdf`,
              mimeType: DocumentMimeType.PDF,
              externalId: undefined,
              requiresOCR: false,
              useCase: `enrollment-${name}`,
            },
          }),
          {},
        ),
      });
      return entity;
    } catch (error) {
      throw new DocumentError(`Failed to get upload links for organization ${organizationId}`, error);
    }
  }
}
```

### `src/driven/http/document.client.ts`

```ts
import { Injectable } from '@nestjs/common';
import FormData from 'form-data';
import { HttpClient } from '@driven/http/http-client';
import { ConfigService } from '@nestjs/config';
import { AxiosInstance } from 'axios';
import { ArchiveDocumentParams, DownloadDocumentParams } from '@domain/document-storage-service.port';

interface File {
  fileSize: number;
  fileName: string;
  mimeType: string;
  externalId?: string;
  requiresOCR: boolean;
  useCase: string;
}

export interface UploadDocumentsParams {
  createdBy: string;
  isHistorical: boolean;
  files: Record<string, File>;
}

interface UploadLink {
  url: string;
  documentId: string;
  mimeType: string;
  fields: Record<string, string>;
}

@Injectable()
export class DocumentClient {
  private readonly httpClient: AxiosInstance;

  constructor(private readonly config: ConfigService) {
    this.httpClient = new HttpClient({
      baseURL: config.getOrThrow('DOCUMENT_SERVICE_URL'),
      timeout: config.get<number>('DOCUMENT_SERVICE_TIMEOUT_MS'),
    }).axiosInstance;
  }

  async uploadDocument(fileContent: Buffer, link: UploadLink): Promise<void> {
    const formData = new FormData();
    formData.append('Content-Type', link.mimeType);
    for (const [key, value] of Object.entries(link.fields)) {
      formData.append(key, value);
    }
    formData.append('file', fileContent);
    await this.httpClient.post(link.url, formData, {
      headers: { ...formData.getHeaders() },
    });
  }

  async getUploadLinks(organizationId: string, params: UploadDocumentsParams): Promise<{ outcome: string; entity: Record<string, UploadLink> }> {
    const { data } = await this.httpClient.post(
      `/v1/organizations/${organizationId}/documents/upload-links`,
      params,
    );
    return data;
  }
  // archiveDocument, downloadDocument...
}
```

### `src/domain/document-storage-service.port.ts`

```ts
import { DrivenPort } from '@domain/hexagonal.type';
import { LegalDocuments } from '@domain/document-generator-service.port';
import { EnrollmentDocuments } from '@domain/enrollment.type';

export interface CreateLegalDocumentResult extends EnrollmentDocuments {}
export interface CreateInternalLegalDocumentResult extends Pick<
  CreateLegalDocumentResult,
  'appointmentMandateInternalDocumentId' | 'formalAgreementInternalDocumentId'
> {}

export interface UploadLegalDocumentsPayload {
  documents: LegalDocuments;
  organizationId: string;
  userId: string;
}

export interface ArchiveDocumentParams {
  organizationId: string;
  documentId: string;
  userId: string;
}

export interface DownloadDocumentParams {
  organizationId: string;
  documentId: string;
}

export abstract class DocumentStorageServicePort implements DrivenPort {
  abstract uploadLegalDocuments(payload: UploadLegalDocumentsPayload): Promise<CreateLegalDocumentResult>;
  abstract uploadToInternalStorage(payload: UploadLegalDocumentsPayload): Promise<CreateInternalLegalDocumentResult>;
  abstract downloadDocument(params: DownloadDocumentParams): Promise<Buffer>;
  abstract archiveDocument(params: ArchiveDocumentParams): Promise<void>;
}
```

---

## Domain & Types

### `src/domain/enrollment.type.ts` (excerpt)

```ts
export interface EnrollmentInternalDocuments {
  appointmentMandateInternalDocumentId: string;
  formalAgreementInternalDocumentId: string;
}

export type EnrollmentDocuments = EnrollmentInternalDocuments;

export interface CreateLegalDocumentsPayload {
  address: string;
  startDate: Date;
  organization: Omit<EnrollAddressOrganization, 'isKYC' | 'vatPaymentChoice' | 'vatNumber'>;
  user: Omit<EnrollAddressUser, 'email'>;
}
```

### `src/domain/enrollment.service.ts` (uploadDocuments)

```ts
  private async uploadDocuments(
    addressEnrollment: AddressEnrollment,
  ): Promise<[LegalDocuments, CreateLegalDocumentResult]> {
    const generatedDocuments = await this.documentGeneratorService.generateLegalDocuments({
      user: addressEnrollment.user,
      address: addressEnrollment.address,
      organization: addressEnrollment.organization,
      startDate: new Date(),
    });

    if (
      addressEnrollment.status === 'IN_PROGRESS' &&
      addressEnrollment.documents?.appointmentMandateInternalDocumentId
    ) {
      return [generatedDocuments, addressEnrollment.documents];
    }

    const uploadedDocuments = await this.documentStorageService.uploadLegalDocuments({
      organizationId: addressEnrollment.organization.id,
      userId: addressEnrollment.user.id,
      documents: generatedDocuments,
    });

    await this.enrollmentRepository.updateEnrollmentDocuments({
      organizationId: addressEnrollment.organization.id,
      documentsIds: uploadedDocuments,
    });

    return [generatedDocuments, uploadedDocuments];
  }
```

### `src/domain/enrollment-repository.port.ts` (excerpt)

```ts
export interface UpdateEnrollmentDocumentsCommand {
  organizationId: string;
  documentsIds: EnrollmentDocuments;
}

export interface UpdateOrganizationIdCommand {
  newOrganizationId: string;
  oldOrganizationId: string;
  documents?: {
    appointmentMandateInternalDocumentId: string;
    formalAgreementInternalDocumentId: string;
  };
}
```

---

## Persistence

### `src/driven/drizzle/schema/schema.ts` (excerpt)

```ts
formalAgreementExternalDocumentId: drizzlePgCore.varchar('formal_agreement_external_document_id', {
  length: 255,
}),
formalAgreementInternalDocumentId: drizzlePgCore.uuid('formal_agreement_internal_document_id'),
```

### `src/driven/drizzle/enrollment.repository.ts` (excerpt)

```ts
  async updateEnrollmentDocuments({ organizationId, documentsIds }: UpdateEnrollmentDocumentsCommand) {
    await this.database
      .update(organizationEnrollmentsTable)
      .set(documentsIds)
      .where(eq(organizationEnrollmentsTable.organizationId, organizationId));
  }
```

### `src/driven/drizzle/schema/migrations/20251127154513_add_formal_agreement_fields.sql`

```sql
ALTER TABLE "enrollment"."organization_enrollment" ADD COLUMN "formal_agreement_external_document_id" varchar(255);--> statement-breakpoint
ALTER TABLE "enrollment"."organization_enrollment" ADD COLUMN "formal_agreement_internal_document_id" uuid;
```

---

## Events

### `src/driven/eventbridge/events/enrollment-created.dto.ts`

```ts
class EnrollmentDocuments {
  @IsString()
  @IsNotEmpty()
  appointmentMandateInternalDocumentId: string;

  @IsString()
  @IsNotEmpty()
  formalAgreementInternalDocumentId: string;
}
```

### `src/driven/eventbridge/events/address-migrated.dto.ts`

```ts
class MigratedEnrollmentDocuments {
  @IsString()
  @IsNotEmpty()
  appointmentMandateInternalDocumentId: string;

  @IsString()
  @IsNotEmpty()
  formalAgreementInternalDocumentId: string;
}
```

### `src/driving/nest/sqs/enrollment-requested.consumer.ts`

```ts
import { SQSClient } from '@aws-sdk/client-sqs';
import { EnrollmentServicePort } from '@domain/enrollment-service.port';
import { EnrollmentRequestedDto } from '@driving/nest/sqs/dto/enrollment.dto';
import { SqsConsumer } from '@driving/nest/sqs/sqs.consumer';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

@Injectable()
export class EnrollmentRequestedConsumer extends SqsConsumer implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly enrollmentService: EnrollmentServicePort,
    sqsClient: SQSClient,
  ) {
    super('ENROLLMENT_REQUESTED_QUEUE_URL', sqsClient, 'EnrollmentRequestedConsumer');
  }

  async messageHandler(event: unknown): Promise<void> {
    const { detail } = await EnrollmentRequestedDto.parseAndValidate(event);
    await this.enrollmentService.enrollAddress(detail);
  }
}
```

---

## Module Wiring

### `src/driven/document/document.module.ts`

```ts
import { Module } from '@nestjs/common';
import { TemplateService } from '@driven/document/template.service';
import { DocumentStorageServicePort } from '@domain/document-storage-service.port';
import { PdfService } from '@driven/document/pdf.service';
import { ConfigModule } from '@nestjs/config';
import { InternalStorageService } from '@driven/document/internal-storage.service';
import { DocumentStorageService } from '@driven/document/document-storage.service';
import { HttpClient } from '@driven/http/http-client';
import { HttpModule as NestHttpModule } from '@nestjs/axios';
import { HttpModule } from '@driven/http/http.module';
import { DocumentGeneratorService } from '@driven/document/document-generator.service';
import { DocumentGeneratorServicePort } from '@domain/document-generator-service.port';

@Module({
  imports: [ConfigModule, NestHttpModule, HttpModule],
  providers: [
    { provide: DocumentStorageServicePort, useClass: DocumentStorageService },
    { provide: DocumentGeneratorServicePort, useClass: DocumentGeneratorService },
    PdfService,
    InternalStorageService,
    TemplateService,
    HttpClient,
  ],
  exports: [DocumentStorageServicePort, DocumentGeneratorServicePort],
})
export class DocumentModule {}
```

---

## External Dependencies

- **PDF service**: `PDF_SERVICE_URL` – POST `/forms/chromium/convert/html`, HTML → PDF (Chromium, PDF/A-3b)
- **Document service**: `DOCUMENT_SERVICE_URL` – POST `/v1/organizations/:id/documents/upload-links`, upload to returned URL
- **Package**: `@kolecto/enrollment-templates` – `FormalAgreement` component, i18n, components (Accent, Cell, NumberCell, Red, SectionRow, Underline)

---

## Config

- `PDF_SERVICE_URL`, `PDF_SERVICE_TIMEOUT_MS`
- `DOCUMENT_SERVICE_URL`, `DOCUMENT_SERVICE_TIMEOUT_MS`
