import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "media"
      ADD COLUMN IF NOT EXISTS "title" varchar;
  `)

  // Backfill display names from existing filenames for admin usability.
  await db.execute(sql`
    UPDATE "media"
    SET "title" = COALESCE(
      NULLIF(trim(both FROM regexp_replace(regexp_replace("filename", '\\.[^.]+$', ''), '[-_]+', ' ', 'g')), ''),
      "alt",
      "filename"
    )
    WHERE "title" IS NULL;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "media" DROP COLUMN IF EXISTS "title";
  `)
}
