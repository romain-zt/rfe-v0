import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE "works_seen_on" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "logo_id" integer,
      "name" varchar NOT NULL
    );

    CREATE INDEX "works_seen_on_order_idx" ON "works_seen_on" ("_order");
    CREATE INDEX "works_seen_on_parent_id_idx" ON "works_seen_on" ("_parent_id");
    CREATE INDEX "works_seen_on_logo_idx" ON "works_seen_on" ("logo_id");

    ALTER TABLE "works_seen_on"
      ADD CONSTRAINT "works_seen_on_logo_id_media_id_fk"
      FOREIGN KEY ("logo_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

    ALTER TABLE "works_seen_on"
      ADD CONSTRAINT "works_seen_on_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "works"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "works_seen_on";
  `)
}
