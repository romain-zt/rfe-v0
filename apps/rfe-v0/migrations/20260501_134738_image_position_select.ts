import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Convert `image_position` / `image_position_mobile` (and hero variants) from
 * free-text varchar to a 9-position enum: top-left | top | top-right | left |
 * center | right | bottom-left | bottom | bottom-right.
 *
 * Existing legacy values (`center center`, `center top`, `center 20%`, …) are
 * normalised in-place via a CASE expression before the column type is changed,
 * so no data is lost.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_media_block_image_position" AS ENUM('top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right');
  CREATE TYPE "public"."enum_pages_blocks_media_block_image_position_mobile" AS ENUM('top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right');
  CREATE TYPE "public"."enum_pages_hero_image_position" AS ENUM('top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right');
  CREATE TYPE "public"."enum_pages_hero_image_position_mobile" AS ENUM('top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right');
  CREATE TYPE "public"."enum__pages_v_blocks_media_block_image_position" AS ENUM('top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right');
  CREATE TYPE "public"."enum__pages_v_blocks_media_block_image_position_mobile" AS ENUM('top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right');
  CREATE TYPE "public"."enum__pages_v_version_hero_image_position" AS ENUM('top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right');
  CREATE TYPE "public"."enum__pages_v_version_hero_image_position_mobile" AS ENUM('top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right');

  ALTER TABLE "pages_blocks_media_block" ALTER COLUMN "image_position" DROP DEFAULT;
  ALTER TABLE "pages" ALTER COLUMN "hero_image_position" DROP DEFAULT;
  ALTER TABLE "_pages_v_blocks_media_block" ALTER COLUMN "image_position" DROP DEFAULT;
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_image_position" DROP DEFAULT;

  UPDATE "pages_blocks_media_block" SET "image_position" = (CASE
    WHEN "image_position" IS NULL OR "image_position" = '' THEN 'center'
    WHEN "image_position" IN ('top-left','top','top-right','left','center','right','bottom-left','bottom','bottom-right') THEN "image_position"
    WHEN "image_position" IN ('center center','50% 50%','50%') THEN 'center'
    WHEN "image_position" IN ('center top','center 0%','top center') THEN 'top'
    WHEN "image_position" IN ('center bottom','center 100%','bottom center') THEN 'bottom'
    WHEN "image_position" IN ('left center','center left') THEN 'left'
    WHEN "image_position" IN ('right center','center right') THEN 'right'
    WHEN "image_position" IN ('left top','top left') THEN 'top-left'
    WHEN "image_position" IN ('right top','top right') THEN 'top-right'
    WHEN "image_position" IN ('left bottom','bottom left') THEN 'bottom-left'
    WHEN "image_position" IN ('right bottom','bottom right') THEN 'bottom-right'
    WHEN "image_position" ~ '^center [0-9]+%?$' THEN (CASE
      WHEN cast(substring("image_position" FROM 'center ([0-9]+)') as integer) <= 25 THEN 'top'
      WHEN cast(substring("image_position" FROM 'center ([0-9]+)') as integer) >= 75 THEN 'bottom'
      ELSE 'center' END)
    ELSE 'center' END);

  UPDATE "pages_blocks_media_block" SET "image_position_mobile" = (CASE
    WHEN "image_position_mobile" IS NULL OR "image_position_mobile" = '' THEN NULL
    WHEN "image_position_mobile" IN ('top-left','top','top-right','left','center','right','bottom-left','bottom','bottom-right') THEN "image_position_mobile"
    WHEN "image_position_mobile" IN ('center center','50% 50%','50%') THEN 'center'
    WHEN "image_position_mobile" IN ('center top','center 0%','top center') THEN 'top'
    WHEN "image_position_mobile" IN ('center bottom','center 100%','bottom center') THEN 'bottom'
    WHEN "image_position_mobile" IN ('left center','center left') THEN 'left'
    WHEN "image_position_mobile" IN ('right center','center right') THEN 'right'
    WHEN "image_position_mobile" IN ('left top','top left') THEN 'top-left'
    WHEN "image_position_mobile" IN ('right top','top right') THEN 'top-right'
    WHEN "image_position_mobile" IN ('left bottom','bottom left') THEN 'bottom-left'
    WHEN "image_position_mobile" IN ('right bottom','bottom right') THEN 'bottom-right'
    WHEN "image_position_mobile" ~ '^center [0-9]+%?$' THEN (CASE
      WHEN cast(substring("image_position_mobile" FROM 'center ([0-9]+)') as integer) <= 25 THEN 'top'
      WHEN cast(substring("image_position_mobile" FROM 'center ([0-9]+)') as integer) >= 75 THEN 'bottom'
      ELSE 'center' END)
    ELSE 'center' END);

  UPDATE "pages" SET "hero_image_position" = (CASE
    WHEN "hero_image_position" IS NULL OR "hero_image_position" = '' THEN 'center'
    WHEN "hero_image_position" IN ('top-left','top','top-right','left','center','right','bottom-left','bottom','bottom-right') THEN "hero_image_position"
    WHEN "hero_image_position" IN ('center center','50% 50%','50%') THEN 'center'
    WHEN "hero_image_position" IN ('center top','center 0%','top center') THEN 'top'
    WHEN "hero_image_position" IN ('center bottom','center 100%','bottom center') THEN 'bottom'
    WHEN "hero_image_position" IN ('left center','center left') THEN 'left'
    WHEN "hero_image_position" IN ('right center','center right') THEN 'right'
    WHEN "hero_image_position" IN ('left top','top left') THEN 'top-left'
    WHEN "hero_image_position" IN ('right top','top right') THEN 'top-right'
    WHEN "hero_image_position" IN ('left bottom','bottom left') THEN 'bottom-left'
    WHEN "hero_image_position" IN ('right bottom','bottom right') THEN 'bottom-right'
    WHEN "hero_image_position" ~ '^center [0-9]+%?$' THEN (CASE
      WHEN cast(substring("hero_image_position" FROM 'center ([0-9]+)') as integer) <= 25 THEN 'top'
      WHEN cast(substring("hero_image_position" FROM 'center ([0-9]+)') as integer) >= 75 THEN 'bottom'
      ELSE 'center' END)
    ELSE 'center' END);

  UPDATE "pages" SET "hero_image_position_mobile" = (CASE
    WHEN "hero_image_position_mobile" IS NULL OR "hero_image_position_mobile" = '' THEN NULL
    WHEN "hero_image_position_mobile" IN ('top-left','top','top-right','left','center','right','bottom-left','bottom','bottom-right') THEN "hero_image_position_mobile"
    WHEN "hero_image_position_mobile" IN ('center center','50% 50%','50%') THEN 'center'
    WHEN "hero_image_position_mobile" IN ('center top','center 0%','top center') THEN 'top'
    WHEN "hero_image_position_mobile" IN ('center bottom','center 100%','bottom center') THEN 'bottom'
    WHEN "hero_image_position_mobile" IN ('left center','center left') THEN 'left'
    WHEN "hero_image_position_mobile" IN ('right center','center right') THEN 'right'
    WHEN "hero_image_position_mobile" IN ('left top','top left') THEN 'top-left'
    WHEN "hero_image_position_mobile" IN ('right top','top right') THEN 'top-right'
    WHEN "hero_image_position_mobile" IN ('left bottom','bottom left') THEN 'bottom-left'
    WHEN "hero_image_position_mobile" IN ('right bottom','bottom right') THEN 'bottom-right'
    WHEN "hero_image_position_mobile" ~ '^center [0-9]+%?$' THEN (CASE
      WHEN cast(substring("hero_image_position_mobile" FROM 'center ([0-9]+)') as integer) <= 25 THEN 'top'
      WHEN cast(substring("hero_image_position_mobile" FROM 'center ([0-9]+)') as integer) >= 75 THEN 'bottom'
      ELSE 'center' END)
    ELSE 'center' END);

  UPDATE "_pages_v_blocks_media_block" SET "image_position" = (CASE
    WHEN "image_position" IS NULL OR "image_position" = '' THEN 'center'
    WHEN "image_position" IN ('top-left','top','top-right','left','center','right','bottom-left','bottom','bottom-right') THEN "image_position"
    WHEN "image_position" IN ('center center','50% 50%','50%') THEN 'center'
    WHEN "image_position" IN ('center top','center 0%','top center') THEN 'top'
    WHEN "image_position" IN ('center bottom','center 100%','bottom center') THEN 'bottom'
    WHEN "image_position" IN ('left center','center left') THEN 'left'
    WHEN "image_position" IN ('right center','center right') THEN 'right'
    WHEN "image_position" IN ('left top','top left') THEN 'top-left'
    WHEN "image_position" IN ('right top','top right') THEN 'top-right'
    WHEN "image_position" IN ('left bottom','bottom left') THEN 'bottom-left'
    WHEN "image_position" IN ('right bottom','bottom right') THEN 'bottom-right'
    WHEN "image_position" ~ '^center [0-9]+%?$' THEN (CASE
      WHEN cast(substring("image_position" FROM 'center ([0-9]+)') as integer) <= 25 THEN 'top'
      WHEN cast(substring("image_position" FROM 'center ([0-9]+)') as integer) >= 75 THEN 'bottom'
      ELSE 'center' END)
    ELSE 'center' END);

  UPDATE "_pages_v_blocks_media_block" SET "image_position_mobile" = (CASE
    WHEN "image_position_mobile" IS NULL OR "image_position_mobile" = '' THEN NULL
    WHEN "image_position_mobile" IN ('top-left','top','top-right','left','center','right','bottom-left','bottom','bottom-right') THEN "image_position_mobile"
    WHEN "image_position_mobile" IN ('center center','50% 50%','50%') THEN 'center'
    WHEN "image_position_mobile" IN ('center top','center 0%','top center') THEN 'top'
    WHEN "image_position_mobile" IN ('center bottom','center 100%','bottom center') THEN 'bottom'
    WHEN "image_position_mobile" IN ('left center','center left') THEN 'left'
    WHEN "image_position_mobile" IN ('right center','center right') THEN 'right'
    WHEN "image_position_mobile" IN ('left top','top left') THEN 'top-left'
    WHEN "image_position_mobile" IN ('right top','top right') THEN 'top-right'
    WHEN "image_position_mobile" IN ('left bottom','bottom left') THEN 'bottom-left'
    WHEN "image_position_mobile" IN ('right bottom','bottom right') THEN 'bottom-right'
    WHEN "image_position_mobile" ~ '^center [0-9]+%?$' THEN (CASE
      WHEN cast(substring("image_position_mobile" FROM 'center ([0-9]+)') as integer) <= 25 THEN 'top'
      WHEN cast(substring("image_position_mobile" FROM 'center ([0-9]+)') as integer) >= 75 THEN 'bottom'
      ELSE 'center' END)
    ELSE 'center' END);

  UPDATE "_pages_v" SET "version_hero_image_position" = (CASE
    WHEN "version_hero_image_position" IS NULL OR "version_hero_image_position" = '' THEN 'center'
    WHEN "version_hero_image_position" IN ('top-left','top','top-right','left','center','right','bottom-left','bottom','bottom-right') THEN "version_hero_image_position"
    WHEN "version_hero_image_position" IN ('center center','50% 50%','50%') THEN 'center'
    WHEN "version_hero_image_position" IN ('center top','center 0%','top center') THEN 'top'
    WHEN "version_hero_image_position" IN ('center bottom','center 100%','bottom center') THEN 'bottom'
    WHEN "version_hero_image_position" IN ('left center','center left') THEN 'left'
    WHEN "version_hero_image_position" IN ('right center','center right') THEN 'right'
    WHEN "version_hero_image_position" IN ('left top','top left') THEN 'top-left'
    WHEN "version_hero_image_position" IN ('right top','top right') THEN 'top-right'
    WHEN "version_hero_image_position" IN ('left bottom','bottom left') THEN 'bottom-left'
    WHEN "version_hero_image_position" IN ('right bottom','bottom right') THEN 'bottom-right'
    WHEN "version_hero_image_position" ~ '^center [0-9]+%?$' THEN (CASE
      WHEN cast(substring("version_hero_image_position" FROM 'center ([0-9]+)') as integer) <= 25 THEN 'top'
      WHEN cast(substring("version_hero_image_position" FROM 'center ([0-9]+)') as integer) >= 75 THEN 'bottom'
      ELSE 'center' END)
    ELSE 'center' END);

  UPDATE "_pages_v" SET "version_hero_image_position_mobile" = (CASE
    WHEN "version_hero_image_position_mobile" IS NULL OR "version_hero_image_position_mobile" = '' THEN NULL
    WHEN "version_hero_image_position_mobile" IN ('top-left','top','top-right','left','center','right','bottom-left','bottom','bottom-right') THEN "version_hero_image_position_mobile"
    WHEN "version_hero_image_position_mobile" IN ('center center','50% 50%','50%') THEN 'center'
    WHEN "version_hero_image_position_mobile" IN ('center top','center 0%','top center') THEN 'top'
    WHEN "version_hero_image_position_mobile" IN ('center bottom','center 100%','bottom center') THEN 'bottom'
    WHEN "version_hero_image_position_mobile" IN ('left center','center left') THEN 'left'
    WHEN "version_hero_image_position_mobile" IN ('right center','center right') THEN 'right'
    WHEN "version_hero_image_position_mobile" IN ('left top','top left') THEN 'top-left'
    WHEN "version_hero_image_position_mobile" IN ('right top','top right') THEN 'top-right'
    WHEN "version_hero_image_position_mobile" IN ('left bottom','bottom left') THEN 'bottom-left'
    WHEN "version_hero_image_position_mobile" IN ('right bottom','bottom right') THEN 'bottom-right'
    WHEN "version_hero_image_position_mobile" ~ '^center [0-9]+%?$' THEN (CASE
      WHEN cast(substring("version_hero_image_position_mobile" FROM 'center ([0-9]+)') as integer) <= 25 THEN 'top'
      WHEN cast(substring("version_hero_image_position_mobile" FROM 'center ([0-9]+)') as integer) >= 75 THEN 'bottom'
      ELSE 'center' END)
    ELSE 'center' END);

  ALTER TABLE "pages_blocks_media_block" ALTER COLUMN "image_position" SET DATA TYPE "public"."enum_pages_blocks_media_block_image_position" USING "image_position"::"public"."enum_pages_blocks_media_block_image_position";
  ALTER TABLE "pages_blocks_media_block" ALTER COLUMN "image_position_mobile" SET DATA TYPE "public"."enum_pages_blocks_media_block_image_position_mobile" USING "image_position_mobile"::"public"."enum_pages_blocks_media_block_image_position_mobile";
  ALTER TABLE "pages" ALTER COLUMN "hero_image_position" SET DATA TYPE "public"."enum_pages_hero_image_position" USING "hero_image_position"::"public"."enum_pages_hero_image_position";
  ALTER TABLE "pages" ALTER COLUMN "hero_image_position_mobile" SET DATA TYPE "public"."enum_pages_hero_image_position_mobile" USING "hero_image_position_mobile"::"public"."enum_pages_hero_image_position_mobile";
  ALTER TABLE "_pages_v_blocks_media_block" ALTER COLUMN "image_position" SET DATA TYPE "public"."enum__pages_v_blocks_media_block_image_position" USING "image_position"::"public"."enum__pages_v_blocks_media_block_image_position";
  ALTER TABLE "_pages_v_blocks_media_block" ALTER COLUMN "image_position_mobile" SET DATA TYPE "public"."enum__pages_v_blocks_media_block_image_position_mobile" USING "image_position_mobile"::"public"."enum__pages_v_blocks_media_block_image_position_mobile";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_image_position" SET DATA TYPE "public"."enum__pages_v_version_hero_image_position" USING "version_hero_image_position"::"public"."enum__pages_v_version_hero_image_position";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_image_position_mobile" SET DATA TYPE "public"."enum__pages_v_version_hero_image_position_mobile" USING "version_hero_image_position_mobile"::"public"."enum__pages_v_version_hero_image_position_mobile";

  ALTER TABLE "pages_blocks_media_block" ALTER COLUMN "image_position" SET DEFAULT 'center'::"public"."enum_pages_blocks_media_block_image_position";
  ALTER TABLE "pages" ALTER COLUMN "hero_image_position" SET DEFAULT 'center'::"public"."enum_pages_hero_image_position";
  ALTER TABLE "_pages_v_blocks_media_block" ALTER COLUMN "image_position" SET DEFAULT 'center'::"public"."enum__pages_v_blocks_media_block_image_position";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_image_position" SET DEFAULT 'center'::"public"."enum__pages_v_version_hero_image_position";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_media_block" ALTER COLUMN "image_position" SET DATA TYPE varchar;
  ALTER TABLE "pages_blocks_media_block" ALTER COLUMN "image_position" SET DEFAULT 'center center';
  ALTER TABLE "pages_blocks_media_block" ALTER COLUMN "image_position_mobile" SET DATA TYPE varchar;
  ALTER TABLE "pages" ALTER COLUMN "hero_image_position" SET DATA TYPE varchar;
  ALTER TABLE "pages" ALTER COLUMN "hero_image_position" SET DEFAULT 'center center';
  ALTER TABLE "pages" ALTER COLUMN "hero_image_position_mobile" SET DATA TYPE varchar;
  ALTER TABLE "_pages_v_blocks_media_block" ALTER COLUMN "image_position" SET DATA TYPE varchar;
  ALTER TABLE "_pages_v_blocks_media_block" ALTER COLUMN "image_position" SET DEFAULT 'center center';
  ALTER TABLE "_pages_v_blocks_media_block" ALTER COLUMN "image_position_mobile" SET DATA TYPE varchar;
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_image_position" SET DATA TYPE varchar;
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_image_position" SET DEFAULT 'center center';
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_image_position_mobile" SET DATA TYPE varchar;
  DROP TYPE "public"."enum_pages_blocks_media_block_image_position";
  DROP TYPE "public"."enum_pages_blocks_media_block_image_position_mobile";
  DROP TYPE "public"."enum_pages_hero_image_position";
  DROP TYPE "public"."enum_pages_hero_image_position_mobile";
  DROP TYPE "public"."enum__pages_v_blocks_media_block_image_position";
  DROP TYPE "public"."enum__pages_v_blocks_media_block_image_position_mobile";
  DROP TYPE "public"."enum__pages_v_version_hero_image_position";
  DROP TYPE "public"."enum__pages_v_version_hero_image_position_mobile";`)
}
