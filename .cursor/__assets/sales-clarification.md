Retour event vente
-> Min Status (+description/reason)

## TODO od-pdp :

1. Recevoir event + payload (CF. Figma)
2. Persister event/payload
3. Générer FactureX metadata et créer le PDF final (dl de services/document + meta) ??
4. Récupérer le invoiceId en appelant Serensia avec le fileId
5. Persister "serensia invoiceId"
6. Mettre à jour le statut de invoice selon notre besoin (cf flow status)
7. Emettre event "HANDLED_INVOICE" ou autre pour que vente ai l'info (Que mettre dans l'event ?)

- Mettre à jour le handleSerensiaInvoiceStatusUpdatedEvent de event.controller pour bien gérer les factures de ventes
  (MàJ status / emit des bons events)

  ***

FactureX généré par SERENSIA = KO (en tous cas non déserializable de notre côté)
Si facture créée avc un amountPaid SERENSIA s'en moque (et le statut reste NONE alors qu'un paiement est déclaré)
--> Mais ok si on apply via PUT la OK
Pour B2C errorMessage : "Could not find the buyer SIREN"

WARN: Je me suis fait ban à cause des montants / mauvais payload

---

## VENDEUR

distributorId: 611618
memberId: 1938316
memberName: RPI-Seller
siren: 792959109

1 ->
{
"invoiceNo": "FAC-2026-004",
"invoicingFramework": "b1Goods",
"counterparty": {
"id": "993244128",
"name": "Romain Piv Ach",
"address": {
"address": "12 Rue de la Paix",
"l1": "String SAS",
"city": "Paris",
"postalCode": "75002",
"country": "FR"
},
"contact": {
"name": "Jean Dupont",
"phone": "+33 1 23 45 67 89",
"email": "jean.dupont@string-sas.fr"
},
"electronicAddress": "romain@yopmail.com"
},
"tradeLineItems": [
{
"lineID": 5084,
"name": "Feuilles",
"billedQuantity": 10,
"chargeAmount": 100,
"vatRate": 20,
"description": "feuilles desc"
},
{
"lineID": 3222,
"name": "filtres",
"billedQuantity": 5,
"chargeAmount": 50,
"vatRate": 20,
"description": "string"
}
],
"issueDate": "2026-03-10T10:12:33.821Z",
"paymentDueDate": "2026-03-10T22:32:18.397Z",
"autoSend": true
}

RESPONSE:
fileId: 1938991 -> resultingDocumentId: 1939017

2 ->
{
"invoiceId": 1939017,
"processingType": "b2B",
"displayName": "string-seller ref/FAC-2026-004",
"receptionDate": "2026-03-10T16:15:21.6966811",
"madeAvailableDate": "2026-03-10T16:15:43.4280631",
"invoiceNumber": "FAC-2026-004",
"type": "invoice",
"direction": "outgoing",
"memberRole": "seller",
"memberAddressingLine": "792959108",
"counterpartyAddressingLine": "993244128",
"issueDate": "2026-03-10T00:00:00",
"paymentDeadlineDate": "2026-03-10T00:00:00",
"referenceInvoiceNumber": null,
"referenceInvoiceDate": null,
"totalAmountWithoutVat": 1250.0000000000000000000,
"totalAmount": 1500.0000000000000000000,
"totalToPay": 1500.0000000000000000000,
"paidAmount": 0.0000000000000000000,
"isFullyPaid": false,
"remainingAmount": 1500.0000000000000000000,
"monetaryUnit": "EUR",
"seller": {
"companyId": 1936560,
"name": "string-seller",
"siren": "792959108",
"vatNumber": null,
"companyLegalType": "unknown",
"address": {
"address": "",
"l1": "",
"l2": null,
"l3": null,
"l4": null,
"l5": null,
"l6": null,
"city": "",
"postalCode": "",
"country": "FR"
},
"contact": {
"id": 1936561,
"name": null,
"phone": null,
"email": null,
"isInvoiceRecipient": false
},
"isBlacklisted": false
},
"buyer": {
"companyId": 1936489,
"name": "string",
"siren": "993244128",
"vatNumber": null,
"companyLegalType": "unknown",
"address": {
"address": "",
"l1": "",
"l2": null,
"l3": null,
"l4": null,
"l5": null,
"l6": null,
"city": "",
"postalCode": "",
"country": ""
},
"contact": {
"id": 1936490,
"name": null,
"phone": null,
"email": null,
"isInvoiceRecipient": false
},
"isBlacklisted": false
},
"status": "madeAvailable"
}

//efb72289-e44d-4721-a17b-5f306fdc73b1
