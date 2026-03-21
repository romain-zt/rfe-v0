Enrollment FLOW to test :

1 - Enrollment submitted (od-pdp event received = enrollment.created)
-- 1.1 -> Handle formal agreement
-- 1.2 -> Create member
-- 1.3 -> Create member adressing plan
-- 1.4 -> Persist enrollment
-- 1.5 -> Handle legal docs and persist

2a - SERENSIA enrollment
-- 2a.1 -> CronJob sync dyrectory changes

---> Enrollment is REJECTED
-- 2a.2 -> Persist enrollment newStatus
-- 2a.3 -> Dispatch events

---> Enrollment is APPROOVED
-- 2a.2 -> Create webhook subscriptions
-- 2a.2 -> Persist enrollment newStatus

3 - SERENSIA inbound-invoice
-- 3.1 -> Event received from SERENSIA
