import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_config"
      ADD COLUMN IF NOT EXISTS "email_enabled" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "email_provider" varchar DEFAULT 'gmail',
      ADD COLUMN IF NOT EXISTS "email_smtp_host" varchar DEFAULT 'smtp.gmail.com',
      ADD COLUMN IF NOT EXISTS "email_smtp_port" numeric DEFAULT 465,
      ADD COLUMN IF NOT EXISTS "email_secure" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "email_username" varchar,
      ADD COLUMN IF NOT EXISTS "email_smtp_password" varchar,
      ADD COLUMN IF NOT EXISTS "email_from_email" varchar,
      ADD COLUMN IF NOT EXISTS "email_from_name" varchar DEFAULT 'RFE',
      ADD COLUMN IF NOT EXISTS "email_reply_to" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_config"
      DROP COLUMN IF EXISTS "email_reply_to",
      DROP COLUMN IF EXISTS "email_from_name",
      DROP COLUMN IF EXISTS "email_from_email",
      DROP COLUMN IF EXISTS "email_smtp_password",
      DROP COLUMN IF EXISTS "email_username",
      DROP COLUMN IF EXISTS "email_secure",
      DROP COLUMN IF EXISTS "email_smtp_port",
      DROP COLUMN IF EXISTS "email_smtp_host",
      DROP COLUMN IF EXISTS "email_provider",
      DROP COLUMN IF EXISTS "email_enabled";
  `)
}
