import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_works_production_stage" AS ENUM('produced', 'in-production', 'paid-development', 'movies-development', 'series-development');
    ALTER TABLE "works" ADD COLUMN "production_stage" "enum_works_production_stage";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "works" DROP COLUMN "production_stage";
    DROP TYPE "public"."enum_works_production_stage";
  `)
}
