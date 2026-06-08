import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_media_block" ADD COLUMN "media_mobile_id" integer;
  ALTER TABLE "pages_blocks_media_block" ADD COLUMN "image_position_mobile" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_media_mobile_id" integer;
  ALTER TABLE "pages" ADD COLUMN "hero_image_position_mobile" varchar;
  ALTER TABLE "_pages_v_blocks_media_block" ADD COLUMN "media_mobile_id" integer;
  ALTER TABLE "_pages_v_blocks_media_block" ADD COLUMN "image_position_mobile" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_media_mobile_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_image_position_mobile" varchar;
  ALTER TABLE "pages_blocks_media_block" ADD CONSTRAINT "pages_blocks_media_block_media_mobile_id_media_id_fk" FOREIGN KEY ("media_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_media_mobile_id_media_id_fk" FOREIGN KEY ("hero_media_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_block" ADD CONSTRAINT "_pages_v_blocks_media_block_media_mobile_id_media_id_fk" FOREIGN KEY ("media_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_media_mobile_id_media_id_fk" FOREIGN KEY ("version_hero_media_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_media_block_media_mobile_idx" ON "pages_blocks_media_block" USING btree ("media_mobile_id");
  CREATE INDEX "pages_hero_hero_media_mobile_idx" ON "pages" USING btree ("hero_media_mobile_id");
  CREATE INDEX "_pages_v_blocks_media_block_media_mobile_idx" ON "_pages_v_blocks_media_block" USING btree ("media_mobile_id");
  CREATE INDEX "_pages_v_version_hero_version_hero_media_mobile_idx" ON "_pages_v" USING btree ("version_hero_media_mobile_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_media_block" DROP CONSTRAINT "pages_blocks_media_block_media_mobile_id_media_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_hero_media_mobile_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_media_block" DROP CONSTRAINT "_pages_v_blocks_media_block_media_mobile_id_media_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_hero_media_mobile_id_media_id_fk";
  
  DROP INDEX "pages_blocks_media_block_media_mobile_idx";
  DROP INDEX "pages_hero_hero_media_mobile_idx";
  DROP INDEX "_pages_v_blocks_media_block_media_mobile_idx";
  DROP INDEX "_pages_v_version_hero_version_hero_media_mobile_idx";
  ALTER TABLE "pages_blocks_media_block" DROP COLUMN "media_mobile_id";
  ALTER TABLE "pages_blocks_media_block" DROP COLUMN "image_position_mobile";
  ALTER TABLE "pages" DROP COLUMN "hero_media_mobile_id";
  ALTER TABLE "pages" DROP COLUMN "hero_image_position_mobile";
  ALTER TABLE "_pages_v_blocks_media_block" DROP COLUMN "media_mobile_id";
  ALTER TABLE "_pages_v_blocks_media_block" DROP COLUMN "image_position_mobile";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_media_mobile_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_image_position_mobile";`)
}
