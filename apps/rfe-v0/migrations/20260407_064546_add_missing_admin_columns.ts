import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_config_typography_brand_font" AS ENUM('Sackers Gothic', 'Cinzel', 'Playfair Display', 'Cormorant Garamond', 'Bodoni Moda', 'DM Serif Display', 'Josefin Sans', 'Italiana', 'Marcellus', 'Tenor Sans', 'Poiret One');
  CREATE TYPE "public"."enum_site_config_typography_sans_font" AS ENUM('Inter', 'DM Sans', 'Plus Jakarta Sans', 'Outfit', 'Space Grotesk', 'Montserrat', 'Poppins', 'Nunito Sans', 'Raleway', 'Open Sans', 'Lato', 'Roboto', 'Work Sans', 'Source Sans 3', 'Figtree');
  CREATE TYPE "public"."enum_site_config_typography_serif_font" AS ENUM('Fraunces', 'Lora', 'Merriweather', 'EB Garamond', 'Libre Baskerville', 'Crimson Pro', 'Bitter', 'Playfair Display', 'Cormorant Garamond', 'Noto Serif', 'Source Serif 4', 'IBM Plex Serif');
  CREATE TYPE "public"."enum_site_config_admin_ai_model" AS ENUM('gpt-4o', 'gpt-4o-mini', 'gpt-4.1', 'gpt-4.1-mini', 'gpt-4.1-nano');
  ALTER TABLE "site_config" ALTER COLUMN "typography_brand_font" SET DEFAULT 'Sackers Gothic'::"public"."enum_site_config_typography_brand_font";
  ALTER TABLE "site_config" ALTER COLUMN "typography_brand_font" SET DATA TYPE "public"."enum_site_config_typography_brand_font" USING "typography_brand_font"::"public"."enum_site_config_typography_brand_font";
  ALTER TABLE "site_config" ALTER COLUMN "typography_sans_font" SET DEFAULT 'Inter'::"public"."enum_site_config_typography_sans_font";
  ALTER TABLE "site_config" ALTER COLUMN "typography_sans_font" SET DATA TYPE "public"."enum_site_config_typography_sans_font" USING "typography_sans_font"::"public"."enum_site_config_typography_sans_font";
  ALTER TABLE "site_config" ALTER COLUMN "typography_serif_font" SET DEFAULT 'Fraunces'::"public"."enum_site_config_typography_serif_font";
  ALTER TABLE "site_config" ALTER COLUMN "typography_serif_font" SET DATA TYPE "public"."enum_site_config_typography_serif_font" USING "typography_serif_font"::"public"."enum_site_config_typography_serif_font";
  ALTER TABLE "site_config" ADD COLUMN "admin_openai_api_key" varchar;
  ALTER TABLE "site_config" ADD COLUMN "admin_ai_model" "enum_site_config_admin_ai_model" DEFAULT 'gpt-4o';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_config" ALTER COLUMN "typography_brand_font" SET DATA TYPE varchar;
  ALTER TABLE "site_config" ALTER COLUMN "typography_brand_font" SET DEFAULT 'Sackers Gothic';
  ALTER TABLE "site_config" ALTER COLUMN "typography_sans_font" SET DATA TYPE varchar;
  ALTER TABLE "site_config" ALTER COLUMN "typography_sans_font" SET DEFAULT 'Inter';
  ALTER TABLE "site_config" ALTER COLUMN "typography_serif_font" SET DATA TYPE varchar;
  ALTER TABLE "site_config" ALTER COLUMN "typography_serif_font" SET DEFAULT 'Fraunces';
  ALTER TABLE "site_config" DROP COLUMN "admin_openai_api_key";
  ALTER TABLE "site_config" DROP COLUMN "admin_ai_model";
  DROP TYPE "public"."enum_site_config_typography_brand_font";
  DROP TYPE "public"."enum_site_config_typography_sans_font";
  DROP TYPE "public"."enum_site_config_typography_serif_font";
  DROP TYPE "public"."enum_site_config_admin_ai_model";`)
}
