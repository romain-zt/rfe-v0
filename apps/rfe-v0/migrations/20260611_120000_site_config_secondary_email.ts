import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_config"
      ADD COLUMN "contact_secondary_email" varchar DEFAULT 'kara@rohmfeiferentertainment.com';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_config" DROP COLUMN IF EXISTS "contact_secondary_email";
  `)
}
