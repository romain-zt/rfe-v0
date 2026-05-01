import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_media_block_image_fit" AS ENUM('cover', 'contain');
  CREATE TYPE "public"."enum_pages_blocks_media_block_image_fit_mobile" AS ENUM('cover', 'contain');
  CREATE TYPE "public"."enum_pages_hero_image_fit" AS ENUM('cover', 'contain');
  CREATE TYPE "public"."enum_pages_hero_image_fit_mobile" AS ENUM('cover', 'contain');
  CREATE TYPE "public"."enum__pages_v_blocks_media_block_image_fit" AS ENUM('cover', 'contain');
  CREATE TYPE "public"."enum__pages_v_blocks_media_block_image_fit_mobile" AS ENUM('cover', 'contain');
  CREATE TYPE "public"."enum__pages_v_version_hero_image_fit" AS ENUM('cover', 'contain');
  CREATE TYPE "public"."enum__pages_v_version_hero_image_fit_mobile" AS ENUM('cover', 'contain');
  ALTER TABLE "pages_blocks_media_block" ADD COLUMN "image_fit" "enum_pages_blocks_media_block_image_fit" DEFAULT 'cover';
  ALTER TABLE "pages_blocks_media_block" ADD COLUMN "image_fit_mobile" "enum_pages_blocks_media_block_image_fit_mobile";
  ALTER TABLE "pages" ADD COLUMN "hero_image_fit" "enum_pages_hero_image_fit" DEFAULT 'cover';
  ALTER TABLE "pages" ADD COLUMN "hero_image_fit_mobile" "enum_pages_hero_image_fit_mobile";
  ALTER TABLE "_pages_v_blocks_media_block" ADD COLUMN "image_fit" "enum__pages_v_blocks_media_block_image_fit" DEFAULT 'cover';
  ALTER TABLE "_pages_v_blocks_media_block" ADD COLUMN "image_fit_mobile" "enum__pages_v_blocks_media_block_image_fit_mobile";
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_image_fit" "enum__pages_v_version_hero_image_fit" DEFAULT 'cover';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_image_fit_mobile" "enum__pages_v_version_hero_image_fit_mobile";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_media_block" DROP COLUMN "image_fit";
  ALTER TABLE "pages_blocks_media_block" DROP COLUMN "image_fit_mobile";
  ALTER TABLE "pages" DROP COLUMN "hero_image_fit";
  ALTER TABLE "pages" DROP COLUMN "hero_image_fit_mobile";
  ALTER TABLE "_pages_v_blocks_media_block" DROP COLUMN "image_fit";
  ALTER TABLE "_pages_v_blocks_media_block" DROP COLUMN "image_fit_mobile";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_image_fit";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_image_fit_mobile";
  DROP TYPE "public"."enum_pages_blocks_media_block_image_fit";
  DROP TYPE "public"."enum_pages_blocks_media_block_image_fit_mobile";
  DROP TYPE "public"."enum_pages_hero_image_fit";
  DROP TYPE "public"."enum_pages_hero_image_fit_mobile";
  DROP TYPE "public"."enum__pages_v_blocks_media_block_image_fit";
  DROP TYPE "public"."enum__pages_v_blocks_media_block_image_fit_mobile";
  DROP TYPE "public"."enum__pages_v_version_hero_image_fit";
  DROP TYPE "public"."enum__pages_v_version_hero_image_fit_mobile";`)
}
