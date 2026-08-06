import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Production-safe / additive-only:
 * - Adds nullable `media.title` if missing (no rewrite of existing columns)
 * - Backfills ONLY rows where title IS NULL
 * - Never touches filename, urls, sizes, S3 objects, or media_locales.alt
 * - Never deletes rows
 *
 * Safe to re-run after the failed deploy: ADD COLUMN IF NOT EXISTS no-ops if
 * the column already exists; UPDATE is guarded by WHERE title IS NULL.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "media"
      ADD COLUMN IF NOT EXISTS "title" varchar;
  `)

  // Filename-only backfill — do not join locales (avoids localized-column pitfalls).
  // Empty/null filename → leave title null; Media.beforeChange fills on next edit.
  await db.execute(sql`
    UPDATE "media"
    SET "title" = NULLIF(
      trim(
        both FROM regexp_replace(
          regexp_replace(COALESCE("filename", ''), '\\.[^.]+$', ''),
          '[-_]+',
          ' ',
          'g'
        )
      ),
      ''
    )
    WHERE "title" IS NULL
      AND "filename" IS NOT NULL;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Do NOT run in production. Drops only the additive title column.
  await db.execute(sql`
    ALTER TABLE "media" DROP COLUMN IF EXISTS "title";
  `)
}
