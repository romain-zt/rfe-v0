import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Migration: Platforms collection + richText description
 *
 * UP:
 *  1. Create `platforms` table (idempotent).
 *  2. Migrate existing `works_seen_on` rows → deduplicated `platforms` records (if table exists).
 *  3. Create `works_rels` join table (idempotent).
 *  4. Populate `works_rels` from `works_seen_on` data (if table still exists).
 *  5. Drop `works_seen_on`.
 *  6. Convert `works.description` varchar → jsonb (Lexical paragraph node).
 *  7. Add `platforms_id` column to `payload_locked_documents_rels`.
 *
 * All DDL operations are wrapped to be safe on re-run.
 *
 * DOWN:
 *  Reverses all steps.
 */

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. Platforms table
  await db.execute(sql`
    DO $$
    BEGIN
      CREATE TABLE IF NOT EXISTS "platforms" (
        "id"         serial PRIMARY KEY NOT NULL,
        "name"       varchar NOT NULL,
        "logo_id"    integer,
        "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
        "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
      );
    EXCEPTION WHEN duplicate_table OR unique_violation THEN NULL;
    END
    $$;
  `)

  // 2. Migrate existing works_seen_on → platforms (only when works_seen_on still exists)
  await db.execute(sql`
    DO $$
    BEGIN
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'works_seen_on') THEN
        INSERT INTO "platforms" ("name", "logo_id")
        SELECT DISTINCT ON ("name") "name", "logo_id"
        FROM "works_seen_on"
        ORDER BY "name", "logo_id" NULLS LAST
        ON CONFLICT DO NOTHING;
      END IF;
    END
    $$;
  `)

  // 3. works_rels join table
  await db.execute(sql`
    DO $$
    BEGIN
      CREATE TABLE IF NOT EXISTS "works_rels" (
        "id"           serial PRIMARY KEY NOT NULL,
        "order"        integer,
        "parent_id"    integer NOT NULL,
        "path"         varchar NOT NULL,
        "platforms_id" integer
      );
    EXCEPTION WHEN duplicate_table OR unique_violation THEN NULL;
    END
    $$;
  `)

  // 4. Populate works_rels from works_seen_on (only when source table still exists)
  await db.execute(sql`
    DO $$
    BEGIN
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'works_seen_on') THEN
        INSERT INTO "works_rels" ("order", "parent_id", "path", "platforms_id")
        SELECT ws."_order", ws."_parent_id", 'seenOn', p."id"
        FROM "works_seen_on" ws
        JOIN "platforms" p ON p."name" = ws."name";
      END IF;
    END
    $$;
  `)

  // 5. Drop old inline array table
  await db.execute(sql`DROP TABLE IF EXISTS "works_seen_on";`)

  // 6. Convert works.description varchar → jsonb (Lexical paragraph node)
  // Only run when description column is still varchar (idempotent check via information_schema).
  await db.execute(sql`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'works' AND column_name = 'description'
          AND data_type IN ('character varying', 'text')
      ) THEN
        ALTER TABLE "works" ADD COLUMN IF NOT EXISTS "description_jsonb" jsonb;

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

        ALTER TABLE "works" DROP COLUMN "description";
        ALTER TABLE "works" RENAME COLUMN "description_jsonb" TO "description";
      END IF;
    END
    $$;
  `)

  // 7. Foreign key: platforms → media
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'platforms_logo_id_media_id_fk' AND table_name = 'platforms'
      ) THEN
        ALTER TABLE "platforms"
          ADD CONSTRAINT "platforms_logo_id_media_id_fk"
          FOREIGN KEY ("logo_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
      END IF;
    END
    $$;
  `)

  // Indexes for platforms
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "platforms_logo_idx"       ON "platforms" USING btree ("logo_id");
    CREATE INDEX IF NOT EXISTS "platforms_updated_at_idx" ON "platforms" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "platforms_created_at_idx" ON "platforms" USING btree ("created_at");
  `)

  // 8. Foreign keys for works_rels
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'works_rels_parent_fk' AND table_name = 'works_rels'
      ) THEN
        ALTER TABLE "works_rels"
          ADD CONSTRAINT "works_rels_parent_fk"
          FOREIGN KEY ("parent_id") REFERENCES "works"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'works_rels_platforms_fk' AND table_name = 'works_rels'
      ) THEN
        ALTER TABLE "works_rels"
          ADD CONSTRAINT "works_rels_platforms_fk"
          FOREIGN KEY ("platforms_id") REFERENCES "platforms"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END
    $$;
  `)

  // Indexes for works_rels
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "works_rels_order_idx"        ON "works_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "works_rels_parent_idx"       ON "works_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "works_rels_path_idx"         ON "works_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "works_rels_platforms_id_idx" ON "works_rels" USING btree ("platforms_id");
  `)

  // 9. Add platforms_id to payload_locked_documents_rels
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      ADD COLUMN IF NOT EXISTS "platforms_id" integer;
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'payload_locked_documents_rels_platforms_fk'
          AND table_name = 'payload_locked_documents_rels'
      ) THEN
        ALTER TABLE "payload_locked_documents_rels"
          ADD CONSTRAINT "payload_locked_documents_rels_platforms_fk"
          FOREIGN KEY ("platforms_id") REFERENCES "platforms"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END
    $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_platforms_id_idx"
      ON "payload_locked_documents_rels" USING btree ("platforms_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Remove platforms from payload_locked_documents_rels
  await db.execute(sql`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'payload_locked_documents_rels_platforms_fk'
      ) THEN
        ALTER TABLE "payload_locked_documents_rels"
          DROP CONSTRAINT "payload_locked_documents_rels_platforms_fk";
      END IF;
    END
    $$;
  `)
  await db.execute(sql`
    DROP INDEX IF EXISTS "payload_locked_documents_rels_platforms_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "platforms_id";
  `)

  // Restore works_seen_on from works_rels
  await db.execute(sql`
    DO $$
    BEGIN
      CREATE TABLE IF NOT EXISTS "works_seen_on" (
        "_order"     integer NOT NULL,
        "_parent_id" integer NOT NULL,
        "id"         varchar PRIMARY KEY NOT NULL,
        "logo_id"    integer,
        "name"       varchar NOT NULL
      );
    EXCEPTION WHEN duplicate_table OR unique_violation THEN NULL;
    END
    $$;
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'works_rels') THEN
        INSERT INTO "works_seen_on" ("_order", "_parent_id", "id", "logo_id", "name")
        SELECT wr."order", wr."parent_id", gen_random_uuid()::varchar, p."logo_id", p."name"
        FROM "works_rels" wr
        JOIN "platforms" p ON p."id" = wr."platforms_id"
        WHERE wr."path" = 'seenOn';
      END IF;
    END
    $$;
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'works_seen_on_logo_id_media_id_fk'
      ) THEN
        ALTER TABLE "works_seen_on"
          ADD CONSTRAINT "works_seen_on_logo_id_media_id_fk"
          FOREIGN KEY ("logo_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
        ALTER TABLE "works_seen_on"
          ADD CONSTRAINT "works_seen_on_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "works"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END
    $$;
  `)

  await db.execute(sql`DROP TABLE IF EXISTS "works_rels";`)
  await db.execute(sql`DROP TABLE IF EXISTS "platforms";`)

  // Convert jsonb description back to varchar
  await db.execute(sql`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'works' AND column_name = 'description' AND data_type = 'jsonb'
      ) THEN
        ALTER TABLE "works" ADD COLUMN IF NOT EXISTS "description_varchar" varchar;
        UPDATE "works"
        SET "description_varchar" = (
          "description"->'root'->'children'->0->'children'->0->>'text'
        )
        WHERE "description" IS NOT NULL;
        ALTER TABLE "works" DROP COLUMN "description";
        ALTER TABLE "works" RENAME COLUMN "description_varchar" TO "description";
      END IF;
    END
    $$;
  `)
}
