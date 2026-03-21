---
1. Persister event/requête tel quel (evt 1 start 'SYNC_DIRECTORY_CHANGES_STARTED' -- Remplacer le logger.log actuel)
2. Récupérer la liste des changes (syncDirectoryChanges)
3. Créer les subscriptions
4. Persister les subscriptions
5. Persister event update (evt 1 done 'SYNC_DIRECTORY_CHANGES_DONE' / evt 2 start 'SYNC_DIRECTORY_CHANGES_EMIT_STARTED' -- Regarder niveau de .updateStatuses() dans enrollment.service)
6. Emettre l'event enrollment status changed sur Event Bridge
7. Persister event update (evt 2 done 'SYNC_DIRECTORY_CHANGES_EMIT_DONE' -- après le enrollmentDispatcher.sendEnrollmentUpdatedEvents)
---
