PRÉREQUIS DATA

Ajouter externalId (memberId Serensia) dans platform_enrollment

Backfill ou stocker ce memberId lors de l’enrollment

PHASE 1 — Directory changes via CRON

Infra

Installer @nestjs/schedule

DB

Migration : external_id dans platform_enrollment

Créer table addressing_plan_change

Créer repo drizzle associé

Domain addressing plan changes

Créer types domain

Créer repository port

Créer dispatcher port EventBridge

Implémenter AddressingPlanChangeService :

récupérer tous les membres Serensia

appeler API Serensia incremental sync

upsert DB

dispatcher events pour nouveaux changements

Serensia API

Ajouter client GET /members/{memberId}/addressing-plan/changes

Ajouter types de réponse

Enrollment repo

Ajouter findAllSerensiaMemberIds()

EventBridge

Dispatcher od-pdp.addressing-plan-change-detected

CRON worker

directory-change.cron.ts

CronModule + ScheduleModule.forRoot()

Brancher dans worker ou entrypoint dédié

PHASE 2 — Invoice webhook

Serensia API

Ajouter client createWebhookSubscription()

Domain webhook

Types webhook + invoice events

Repo webhook subscription

Service webhook :

register subscription

validation challenge

vérification signature

traitement events facture

dispatch events internes

DB

Créer table webhook_subscription

Repo drizzle associé

EventBridge

Dispatcher od-pdp.invoice-status-updated

HTTP endpoint

GET /webhooks/serensia/callback → validation challenge

POST /webhooks/serensia/callback → invoice updates + signature check

Webhook registration

Choisir stratégie (cron / admin endpoint / startup)

Stocker secret webhook en DB

Résultat attendu

Sync automatique des changements d’annuaire

Réception temps réel des statuts facture

Events envoyés dans EventBridge
