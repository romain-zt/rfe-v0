---
1- Dès la réception du webhook (après validation plateforme + récup contexte enrollment) :

Persister event/requête tel quel (evt 1 start 'WH_INVOICE_RECEIVED' — INSERT member id, platform, flow id, status RECEIVED)

Remplacer le check d'idempotence actuel (`findByPlatformExternalId`)

Regarder dans `handleInboundInvoiceReception` dans inbound-invoice.service.ts

 

2- Après la récupération de la facture + PDF (Serensia) et l'upload du document (Document) + persistence de l'inbound invoice

Persister event update (evt 1 done 'WH_INVOICE_PROCESSED')

Regarder après le `internalDocumentClient.uploadDocument` + `inboundInvoiceRepository.createInboundInvoice`

 

3- Après l'émission de l'event sur EventBridge

Persister event update (evt 2 done 'WH_INVOICE_EMITTED')

Regarder après le `inboundInvoiceDispatcher.sendInboundInvoiceReceivedEvent`
---
