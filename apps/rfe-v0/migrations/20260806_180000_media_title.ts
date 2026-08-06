import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "media"
      ADD COLUMN IF NOT EXISTS "title" varchar;
  `)

  // `alt` is localized on media_locales — not a column on media.
  await db.execute(sql`
    UPDATE "media" AS m
    SET "title" = COALESCE(
      NULLIF(
        trim(both FROM regexp_replace(regexp_replace(COALESCE(m."filename", ''), '\\.[^.]+$', ''), '[-_]+', ' ', 'g')),
        ''
      ),
      (
        SELECT ml."alt"
        FROM "media_locales" AS ml
        WHERE ml."_parent_id" = m."id"
        ORDER BY ml."_locale" ASC
        LIMIT 1
      ),
      m."filename"
    )
    WHERE m."title" IS NULL;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "media" DROP COLUMN IF EXISTS "title";
  `)
}
