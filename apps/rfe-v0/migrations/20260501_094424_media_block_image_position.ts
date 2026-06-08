import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_media_block"
      ADD COLUMN IF NOT EXISTS "image_position" varchar DEFAULT 'center center';

    ALTER TABLE "_pages_v_blocks_media_block"
      ADD COLUMN IF NOT EXISTS "image_position" varchar DEFAULT 'center center';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_media_block" DROP COLUMN IF EXISTS "image_position";
    ALTER TABLE "_pages_v_blocks_media_block" DROP COLUMN IF EXISTS "image_position";
  `)
}
