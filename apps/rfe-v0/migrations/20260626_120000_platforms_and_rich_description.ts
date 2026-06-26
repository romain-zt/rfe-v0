import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Migration: Platforms collection + richText description
 *
 * UP:
 *  1. Create `platforms` table.
 *  2. Migrate existing `works_seen_on` rows → deduplicated `platforms` records.
 *  3. Create `works_rels` join table for the new seenOn→platforms relationship.
 *  4. Populate `works_rels` from old `works_seen_on` data (preserving order).
 *  5. Drop `works_seen_on`.
 *  6. Convert `works.description` varchar → jsonb (Lexical paragraph node).
 *  7. Add `platforms_id` column to `payload_locked_documents_rels`.
 *
 * DOWN:
 *  Reverses all steps.
 */

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`

    -- 1. Platforms table
    CREATE TABLE IF NOT EXISTS "platforms" (
      "id"         serial PRIMARY KEY NOT NULL,
      "name"       varchar NOT NULL,
      "logo_id"    integer,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    -- 2. Migrate existing seen_on data into platforms (deduplicated by name).
    --    If works_seen_on doesn't exist yet (fresh DB) this is a no-op.
    INSERT INTO "platforms" ("name", "logo_id")
    SELECT DISTINCT ON ("name") "name", "logo_id"
    FROM "works_seen_on"
    ORDER BY "name", "logo_id" NULLS LAST
    ON CONFLICT DO NOTHING;

    -- 3. Works_rels join table for seenOn → platforms relationship
    CREATE TABLE IF NOT EXISTS "works_rels" (
      "id"           serial PRIMARY KEY NOT NULL,
      "order"        integer,
      "parent_id"    integer NOT NULL,
      "path"         varchar NOT NULL,
      "platforms_id" integer
    );

    -- 4. Populate works_rels from works_seen_on (preserving per-work order)
    INSERT INTO "works_rels" ("order", "parent_id", "path", "platforms_id")
    SELECT ws."_order", ws."_parent_id", 'seenOn', p."id"
    FROM "works_seen_on" ws
    JOIN "platforms" p ON p."name" = ws."name";

    -- 5. Drop the old inline array table
    DROP TABLE IF EXISTS "works_seen_on";

    -- 6a. Add a temp jsonb column to hold the converted rich-text
    ALTER TABLE "works" ADD COLUMN IF NOT EXISTS "description_jsonb" jsonb;

    -- 6b. Convert varchar description → minimal Lexical paragraph node (data preserved)
    UPDATE "works"
    SET "description_jsonb" = CASE
      WHEN "description" IS NULL OR "description" = ''
        THEN NULL
      ELSE jsonb_build_object(
        'root', jsonb_build_object(
          'type', 'root',
          'format', '',
          'indent', 0,
          'version', 1,
          'direction', 'ltr',
          'children', jsonb_build_array(
            jsonb_build_object(
              'type', 'paragraph',
              'format', '',
              'indent', 0,
              'version', 1,
              'direction', 'ltr',
              'children', jsonb_build_array(
                jsonb_build_object(
                  'type', 'text',
                  'format', 0,
                  'style', '',
                  'detail', 0,
                  'mode', 'normal',
                  'text', "description",
                  'version', 1
                )
              )
            )
          )
        )
      )
    END;

    -- 6c. Replace varchar column with jsonb
    ALTER TABLE "works" DROP COLUMN IF EXISTS "description";
    ALTER TABLE "works" RENAME COLUMN "description_jsonb" TO "description";

    -- Foreign keys and indexes for platforms
    ALTER TABLE "platforms"
      ADD CONSTRAINT "platforms_logo_id_media_id_fk"
      FOREIGN KEY ("logo_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

    CREATE INDEX IF NOT EXISTS "platforms_logo_idx"       ON "platforms" USING btree ("logo_id");
    CREATE INDEX IF NOT EXISTS "platforms_updated_at_idx" ON "platforms" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "platforms_created_at_idx" ON "platforms" USING btree ("created_at");

    -- Foreign keys and indexes for works_rels
    ALTER TABLE "works_rels"
      ADD CONSTRAINT "works_rels_parent_fk"
      FOREIGN KEY ("parent_id") REFERENCES "works"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

    ALTER TABLE "works_rels"
      ADD CONSTRAINT "works_rels_platforms_fk"
      FOREIGN KEY ("platforms_id") REFERENCES "platforms"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

    CREATE INDEX IF NOT EXISTS "works_rels_order_idx"        ON "works_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "works_rels_parent_idx"       ON "works_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "works_rels_path_idx"         ON "works_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "works_rels_platforms_id_idx" ON "works_rels" USING btree ("platforms_id");

    -- 7. Add platforms_id to payload_locked_documents_rels
    ALTER TABLE "payload_locked_documents_rels"
      ADD COLUMN IF NOT EXISTS "platforms_id" integer;

    ALTER TABLE "payload_locked_documents_rels"
      ADD CONSTRAINT "payload_locked_documents_rels_platforms_fk"
      FOREIGN KEY ("platforms_id") REFERENCES "platforms"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_platforms_id_idx"
      ON "payload_locked_documents_rels" USING btree ("platforms_id");

  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`

    -- Reverse 7: remove platforms from payload_locked_documents_rels
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_platforms_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_platforms_id_idx";
    ALTER TABLE "payload_locked_documents_rels"
      DROP COLUMN IF EXISTS "platforms_id";

    -- Reverse 3 + 4: restore works_seen_on from works_rels
    CREATE TABLE IF NOT EXISTS "works_seen_on" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "logo_id"    integer,
      "name"       varchar NOT NULL
    );

    INSERT INTO "works_seen_on" ("_order", "_parent_id", "id", "logo_id", "name")
    SELECT
      wr."order",
      wr."parent_id",
      gen_random_uuid()::varchar,
      p."logo_id",
      p."name"
    FROM "works_rels" wr
    JOIN "platforms" p ON p."id" = wr."platforms_id"
    WHERE wr."path" = 'seenOn';

    ALTER TABLE "works_seen_on"
      ADD CONSTRAINT "works_seen_on_logo_id_media_id_fk"
      FOREIGN KEY ("logo_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    ALTER TABLE "works_seen_on"
      ADD CONSTRAINT "works_seen_on_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "works"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

    DROP TABLE IF EXISTS "works_rels";
    DROP TABLE IF EXISTS "platforms";

    -- Reverse 6: convert jsonb description back to varchar (extract first text node)
    ALTER TABLE "works" ADD COLUMN IF NOT EXISTS "description_varchar" varchar;

    UPDATE "works"
    SET "description_varchar" = (
      "description"->'root'->'children'->0->'children'->0->>'text'
    )
    WHERE "description" IS NOT NULL;

    ALTER TABLE "works" DROP COLUMN IF EXISTS "description";
    ALTER TABLE "works" RENAME COLUMN "description_varchar" TO "description";

  `)
}
