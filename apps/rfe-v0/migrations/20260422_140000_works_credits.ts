import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_works_credits_role" AS ENUM('director','writer','ep','producer','star','showrunner','co-producer','creator','other');

    CREATE TABLE "works_credits" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "role" "enum_works_credits_role" NOT NULL,
      "imdb_url" varchar,
      "note" varchar,
      "is_headline" boolean DEFAULT false
    );

    CREATE INDEX "works_credits_order_idx" ON "works_credits" ("_order");
    CREATE INDEX "works_credits_parent_id_idx" ON "works_credits" ("_parent_id");

    ALTER TABLE "works_credits"
      ADD CONSTRAINT "works_credits_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "works"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "works_credits";
    DROP TYPE IF EXISTS "public"."enum_works_credits_role";
  `)
}
