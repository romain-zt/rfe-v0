import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_config" ADD COLUMN "ui_work_view" varchar DEFAULT 'View';
  ALTER TABLE "site_config" ADD COLUMN "ui_development_films" varchar DEFAULT 'Films';
  ALTER TABLE "site_config" ADD COLUMN "ui_development_series" varchar DEFAULT 'Series';
  ALTER TABLE "site_config" ADD COLUMN "ui_development_unscripted" varchar DEFAULT 'Unscripted';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_config" DROP COLUMN "ui_work_view";
  ALTER TABLE "site_config" DROP COLUMN "ui_development_films";
  ALTER TABLE "site_config" DROP COLUMN "ui_development_series";
  ALTER TABLE "site_config" DROP COLUMN "ui_development_unscripted";`)
}
