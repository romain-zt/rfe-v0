import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_size" AS ENUM('full', 'half', 'oneThird', 'twoThirds');
  CREATE TYPE "public"."enum_pages_blocks_content_section_tone" AS ENUM('default', 'deep', 'charcoal', 'slate', 'warm', 'cool', 'ember', 'dusk');
  CREATE TYPE "public"."enum_pages_blocks_media_block_size" AS ENUM('full', 'contained');
  CREATE TYPE "public"."enum_pages_blocks_cta_links_appearance" AS ENUM('default', 'outline', 'gold');
  CREATE TYPE "public"."enum_pages_blocks_cta_section_tone" AS ENUM('default', 'deep', 'charcoal', 'warm');
  CREATE TYPE "public"."enum_pages_blocks_two_column_layout_section_tone" AS ENUM('default', 'deep', 'charcoal', 'slate', 'warm', 'cool');
  CREATE TYPE "public"."enum_pages_blocks_works_grid_source_type" AS ENUM('all', 'pick', 'group');
  CREATE TYPE "public"."enum_pages_blocks_works_grid_category" AS ENUM('film', 'series', 'unscripted');
  CREATE TYPE "public"."enum_pages_blocks_works_grid_section_tone" AS ENUM('default', 'charcoal', 'deep');
  CREATE TYPE "public"."enum_pages_blocks_works_scroll_items_size" AS ENUM('large', 'medium', 'small');
  CREATE TYPE "public"."enum_pages_blocks_works_scroll_source_type" AS ENUM('all', 'pick', 'group', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_works_scroll_section_tone" AS ENUM('default', 'warm', 'charcoal');
  CREATE TYPE "public"."enum_pages_blocks_featured_work_layout" AS ENUM('split', 'overlay');
  CREATE TYPE "public"."enum_pages_blocks_featured_work_section_tone" AS ENUM('default', 'deep', 'charcoal', 'warm', 'ember', 'dusk');
  CREATE TYPE "public"."enum_pages_blocks_team_showcase_section_tone" AS ENUM('default', 'charcoal', 'deep', 'warm');
  CREATE TYPE "public"."enum_pages_blocks_press_list_section_tone" AS ENUM('default', 'charcoal', 'deep', 'slate', 'warm');
  CREATE TYPE "public"."enum_pages_hero_type" AS ENUM('cinematic', 'page', 'minimal');
  CREATE TYPE "public"."enum_pages_meta_json_ld_type" AS ENUM('WebPage', 'ItemPage', 'AboutPage', 'ContactPage', 'CollectionPage');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_size" AS ENUM('full', 'half', 'oneThird', 'twoThirds');
  CREATE TYPE "public"."enum__pages_v_blocks_content_section_tone" AS ENUM('default', 'deep', 'charcoal', 'slate', 'warm', 'cool', 'ember', 'dusk');
  CREATE TYPE "public"."enum__pages_v_blocks_media_block_size" AS ENUM('full', 'contained');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_links_appearance" AS ENUM('default', 'outline', 'gold');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_section_tone" AS ENUM('default', 'deep', 'charcoal', 'warm');
  CREATE TYPE "public"."enum__pages_v_blocks_two_column_layout_section_tone" AS ENUM('default', 'deep', 'charcoal', 'slate', 'warm', 'cool');
  CREATE TYPE "public"."enum__pages_v_blocks_works_grid_source_type" AS ENUM('all', 'pick', 'group');
  CREATE TYPE "public"."enum__pages_v_blocks_works_grid_category" AS ENUM('film', 'series', 'unscripted');
  CREATE TYPE "public"."enum__pages_v_blocks_works_grid_section_tone" AS ENUM('default', 'charcoal', 'deep');
  CREATE TYPE "public"."enum__pages_v_blocks_works_scroll_items_size" AS ENUM('large', 'medium', 'small');
  CREATE TYPE "public"."enum__pages_v_blocks_works_scroll_source_type" AS ENUM('all', 'pick', 'group', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_works_scroll_section_tone" AS ENUM('default', 'warm', 'charcoal');
  CREATE TYPE "public"."enum__pages_v_blocks_featured_work_layout" AS ENUM('split', 'overlay');
  CREATE TYPE "public"."enum__pages_v_blocks_featured_work_section_tone" AS ENUM('default', 'deep', 'charcoal', 'warm', 'ember', 'dusk');
  CREATE TYPE "public"."enum__pages_v_blocks_team_showcase_section_tone" AS ENUM('default', 'charcoal', 'deep', 'warm');
  CREATE TYPE "public"."enum__pages_v_blocks_press_list_section_tone" AS ENUM('default', 'charcoal', 'deep', 'slate', 'warm');
  CREATE TYPE "public"."enum__pages_v_version_hero_type" AS ENUM('cinematic', 'page', 'minimal');
  CREATE TYPE "public"."enum__pages_v_version_meta_json_ld_type" AS ENUM('WebPage', 'ItemPage', 'AboutPage', 'ContactPage', 'CollectionPage');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('en');
  CREATE TYPE "public"."enum_works_tags" AS ENUM('Drama', 'Thriller', 'True Crime', 'Unscripted');
  CREATE TYPE "public"."enum_works_category" AS ENUM('film', 'series', 'unscripted');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TABLE "pages_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_pages_blocks_content_columns_size" DEFAULT 'full'
  );
  
  CREATE TABLE "pages_blocks_content_columns_locales" (
  	"rich_text" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_tone" "enum_pages_blocks_content_section_tone",
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"size" "enum_pages_blocks_media_block_size" DEFAULT 'full',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_media_block_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"is_external" boolean DEFAULT false,
  	"appearance" "enum_pages_blocks_cta_links_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_cta_links_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_tone" "enum_pages_blocks_cta_section_tone",
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_locales" (
  	"rich_text" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_two_column_layout" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"left_media_id" integer,
  	"right_media_id" integer,
  	"reverse_on_mobile" boolean DEFAULT false,
  	"section_tone" "enum_pages_blocks_two_column_layout_section_tone",
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_two_column_layout_locales" (
  	"left_column" jsonb,
  	"right_column" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_works_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source_type" "enum_pages_blocks_works_grid_source_type" DEFAULT 'all',
  	"works_group_id" integer,
  	"show_filters" boolean DEFAULT true,
  	"show_subcategory_tabs" boolean DEFAULT false,
  	"category" "enum_pages_blocks_works_grid_category",
  	"limit" numeric DEFAULT 100,
  	"section_tone" "enum_pages_blocks_works_grid_section_tone",
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_works_grid_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_works_scroll_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"work_id" integer,
  	"media_id" integer,
  	"size" "enum_pages_blocks_works_scroll_items_size" DEFAULT 'large'
  );
  
  CREATE TABLE "pages_blocks_works_scroll_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_works_scroll" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source_type" "enum_pages_blocks_works_scroll_source_type" DEFAULT 'all',
  	"works_group_id" integer,
  	"cta_url" varchar DEFAULT '/our-work',
  	"section_tone" "enum_pages_blocks_works_scroll_section_tone" DEFAULT 'warm',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_works_scroll_locales" (
  	"title" varchar DEFAULT 'Our Work',
  	"cta_label" varchar DEFAULT 'View All',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_featured_work" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"work_id" integer,
  	"override_poster_id" integer,
  	"external_url" varchar,
  	"layout" "enum_pages_blocks_featured_work_layout" DEFAULT 'split',
  	"section_tone" "enum_pages_blocks_featured_work_section_tone" DEFAULT 'deep',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_featured_work_locales" (
  	"quote" varchar,
  	"attribution" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_team_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"show_bios" boolean DEFAULT true,
  	"show_photos" boolean DEFAULT true,
  	"section_tone" "enum_pages_blocks_team_showcase_section_tone" DEFAULT 'charcoal',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_team_showcase_locales" (
  	"title" varchar,
  	"intro_text" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_press_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"limit" numeric DEFAULT 100,
  	"show_view_all" boolean DEFAULT false,
  	"view_all_url" varchar DEFAULT '/press',
  	"section_tone" "enum_pages_blocks_press_list_section_tone" DEFAULT 'charcoal',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_press_list_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_contact_info" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"show_email" boolean DEFAULT true,
  	"show_phone" boolean DEFAULT true,
  	"show_address" boolean DEFAULT true,
  	"show_socials" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_contact_info_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_contact_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"recipient_email" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_contact_form_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"name_label" varchar DEFAULT 'Name',
  	"email_label" varchar DEFAULT 'Email',
  	"message_label" varchar DEFAULT 'Message',
  	"submit_label" varchar DEFAULT 'Send',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_legal_sections_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_legal_sections_sections_locales" (
  	"title" varchar,
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_legal_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"hero_type" "enum_pages_hero_type" DEFAULT 'page',
  	"hero_media_id" integer,
  	"hero_image_position" varchar DEFAULT 'center center',
  	"meta_canonical_url" varchar,
  	"meta_json_ld_type" "enum_pages_meta_json_ld_type" DEFAULT 'WebPage',
  	"meta_json_ld_custom" jsonb,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_locales" (
  	"hero_headline" varchar,
  	"hero_subtitle" varchar,
  	"hero_label" varchar,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"meta_keywords" varchar,
  	"slug" varchar DEFAULT '',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"works_id" integer
  );
  
  CREATE TABLE "_pages_v_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__pages_v_blocks_content_columns_size" DEFAULT 'full',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content_columns_locales" (
  	"rich_text" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"section_tone" "enum__pages_v_blocks_content_section_tone",
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"size" "enum__pages_v_blocks_media_block_size" DEFAULT 'full',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_media_block_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"is_external" boolean DEFAULT false,
  	"appearance" "enum__pages_v_blocks_cta_links_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_links_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"section_tone" "enum__pages_v_blocks_cta_section_tone",
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_locales" (
  	"rich_text" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_two_column_layout" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"left_media_id" integer,
  	"right_media_id" integer,
  	"reverse_on_mobile" boolean DEFAULT false,
  	"section_tone" "enum__pages_v_blocks_two_column_layout_section_tone",
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_two_column_layout_locales" (
  	"left_column" jsonb,
  	"right_column" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_works_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"source_type" "enum__pages_v_blocks_works_grid_source_type" DEFAULT 'all',
  	"works_group_id" integer,
  	"show_filters" boolean DEFAULT true,
  	"show_subcategory_tabs" boolean DEFAULT false,
  	"category" "enum__pages_v_blocks_works_grid_category",
  	"limit" numeric DEFAULT 100,
  	"section_tone" "enum__pages_v_blocks_works_grid_section_tone",
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_works_grid_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_works_scroll_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"work_id" integer,
  	"media_id" integer,
  	"size" "enum__pages_v_blocks_works_scroll_items_size" DEFAULT 'large',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_works_scroll_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_works_scroll" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"source_type" "enum__pages_v_blocks_works_scroll_source_type" DEFAULT 'all',
  	"works_group_id" integer,
  	"cta_url" varchar DEFAULT '/our-work',
  	"section_tone" "enum__pages_v_blocks_works_scroll_section_tone" DEFAULT 'warm',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_works_scroll_locales" (
  	"title" varchar DEFAULT 'Our Work',
  	"cta_label" varchar DEFAULT 'View All',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_featured_work" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"work_id" integer,
  	"override_poster_id" integer,
  	"external_url" varchar,
  	"layout" "enum__pages_v_blocks_featured_work_layout" DEFAULT 'split',
  	"section_tone" "enum__pages_v_blocks_featured_work_section_tone" DEFAULT 'deep',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_featured_work_locales" (
  	"quote" varchar,
  	"attribution" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_team_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"show_bios" boolean DEFAULT true,
  	"show_photos" boolean DEFAULT true,
  	"section_tone" "enum__pages_v_blocks_team_showcase_section_tone" DEFAULT 'charcoal',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_team_showcase_locales" (
  	"title" varchar,
  	"intro_text" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_press_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"limit" numeric DEFAULT 100,
  	"show_view_all" boolean DEFAULT false,
  	"view_all_url" varchar DEFAULT '/press',
  	"section_tone" "enum__pages_v_blocks_press_list_section_tone" DEFAULT 'charcoal',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_press_list_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_contact_info" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"show_email" boolean DEFAULT true,
  	"show_phone" boolean DEFAULT true,
  	"show_address" boolean DEFAULT true,
  	"show_socials" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact_info_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_contact_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"recipient_email" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact_form_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"name_label" varchar DEFAULT 'Name',
  	"email_label" varchar DEFAULT 'Email',
  	"message_label" varchar DEFAULT 'Message',
  	"submit_label" varchar DEFAULT 'Send',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_legal_sections_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_legal_sections_sections_locales" (
  	"title" varchar,
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_legal_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_hero_type" "enum__pages_v_version_hero_type" DEFAULT 'page',
  	"version_hero_media_id" integer,
  	"version_hero_image_position" varchar DEFAULT 'center center',
  	"version_meta_canonical_url" varchar,
  	"version_meta_json_ld_type" "enum__pages_v_version_meta_json_ld_type" DEFAULT 'WebPage',
  	"version_meta_json_ld_custom" jsonb,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__pages_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_hero_headline" varchar,
  	"version_hero_subtitle" varchar,
  	"version_hero_label" varchar,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"version_meta_keywords" varchar,
  	"version_slug" varchar DEFAULT '',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"works_id" integer
  );
  
  CREATE TABLE "works_groups" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "works_groups_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"works_id" integer
  );
  
  CREATE TABLE "works_tags" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_works_tags",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "works" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"year" numeric NOT NULL,
  	"poster_id" integer,
  	"description" varchar,
  	"video_url" varchar,
  	"category" "enum_works_category",
  	"subcategory" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_keywords" varchar,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "team_members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"bio" varchar NOT NULL,
  	"photo_id" integer,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "press_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"source" varchar NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"url" varchar NOT NULL,
  	"description" varchar,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"prefix" varchar DEFAULT 'media',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_poster_url" varchar,
  	"sizes_poster_width" numeric,
  	"sizes_poster_height" numeric,
  	"sizes_poster_mime_type" varchar,
  	"sizes_poster_filesize" numeric,
  	"sizes_poster_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"works_groups_id" integer,
  	"works_id" integer,
  	"team_members_id" integer,
  	"press_items_id" integer,
  	"users_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_config_about_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "site_config_legal_sections_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "site_config_legal_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "site_config" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand_name" varchar DEFAULT 'RFE' NOT NULL,
  	"brand_tagline" varchar DEFAULT 'True Crime. Real Drama.',
  	"brand_logo_id" integer,
  	"brand_favicon_id" integer,
  	"colors_background" varchar DEFAULT '#070708',
  	"colors_foreground" varchar DEFAULT '#F5F0EB',
  	"colors_rfe_red" varchar DEFAULT '#8B1A1A',
  	"colors_rfe_rose" varchar DEFAULT '#C4A0A0',
  	"colors_rfe_gold" varchar DEFAULT '#B5975A',
  	"section_tones_deep" varchar DEFAULT '#050506',
  	"section_tones_charcoal" varchar DEFAULT '#0a0a0c',
  	"section_tones_slate" varchar DEFAULT '#0c0d10',
  	"section_tones_warm" varchar DEFAULT '#0b0908',
  	"section_tones_cool" varchar DEFAULT '#080a0d',
  	"section_tones_ember" varchar DEFAULT '#0d0907',
  	"section_tones_dusk" varchar DEFAULT '#090810',
  	"typography_brand_font" varchar DEFAULT 'Sackers Gothic',
  	"typography_sans_font" varchar DEFAULT 'Inter',
  	"typography_serif_font" varchar DEFAULT 'Fraunces',
  	"typography_radius_base" varchar DEFAULT '0.25rem',
  	"easings_emerge" varchar DEFAULT 'cubic-bezier(0.16, 1, 0.3, 1)',
  	"easings_quiet" varchar DEFAULT 'cubic-bezier(0.87, 0, 0.13, 1)',
  	"easings_sharp" varchar DEFAULT 'cubic-bezier(0.76, 0, 0.24, 1)',
  	"seo_title_template" varchar DEFAULT '%s | RFE',
  	"seo_default_title" varchar DEFAULT 'RFE — a cinematic female gaze studio',
  	"seo_default_description" varchar DEFAULT 'stories that refuse to stay quiet.',
  	"seo_keywords" varchar DEFAULT 'female gaze cinema, feminist film production, independent film studio, female director, women in film',
  	"seo_og_image_id" integer,
  	"seo_site_url" varchar DEFAULT 'https://www.rohmfeiferentertainment.com',
  	"contact_email" varchar DEFAULT 'elisabeth@rohmfeiferentertainment.com',
  	"contact_phone" varchar,
  	"contact_address" varchar DEFAULT 'Los Angeles, California',
  	"social_instagram" varchar DEFAULT 'https://www.instagram.com/elisabethrohm/',
  	"social_linkedin" varchar,
  	"social_vimeo" varchar,
  	"social_tiktok" varchar,
  	"social_imdb" varchar DEFAULT 'https://www.imdb.com/name/nm0738400/',
  	"about_hero_headline" varchar DEFAULT 'There''s always more to the story.',
  	"about_hero_subheadline" varchar DEFAULT 'True Crime / Real Drama',
  	"about_hero_paragraph" varchar DEFAULT 'Launched in 2023, RFE is a woman-owned film and television production company committed to telling inspirational, empowering stories steeped in true crime and true stories.',
  	"legal_title" varchar DEFAULT 'Legal notice',
  	"legal_subtitle" varchar DEFAULT 'Publisher information, hosting, and terms of use.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "navigation_header_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"is_external" boolean DEFAULT false
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"footer_legal_label" varchar DEFAULT 'Legal notice',
  	"footer_copyright_text" varchar DEFAULT '© 2026 RFE. All rights reserved.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "pages_blocks_content_columns" ADD CONSTRAINT "pages_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_columns_locales" ADD CONSTRAINT "pages_blocks_content_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_content_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content" ADD CONSTRAINT "pages_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_block" ADD CONSTRAINT "pages_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_block" ADD CONSTRAINT "pages_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_block_locales" ADD CONSTRAINT "pages_blocks_media_block_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_media_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_links" ADD CONSTRAINT "pages_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_links_locales" ADD CONSTRAINT "pages_blocks_cta_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_locales" ADD CONSTRAINT "pages_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_two_column_layout" ADD CONSTRAINT "pages_blocks_two_column_layout_left_media_id_media_id_fk" FOREIGN KEY ("left_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_two_column_layout" ADD CONSTRAINT "pages_blocks_two_column_layout_right_media_id_media_id_fk" FOREIGN KEY ("right_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_two_column_layout" ADD CONSTRAINT "pages_blocks_two_column_layout_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_two_column_layout_locales" ADD CONSTRAINT "pages_blocks_two_column_layout_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_two_column_layout"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_works_grid" ADD CONSTRAINT "pages_blocks_works_grid_works_group_id_works_groups_id_fk" FOREIGN KEY ("works_group_id") REFERENCES "public"."works_groups"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_works_grid" ADD CONSTRAINT "pages_blocks_works_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_works_grid_locales" ADD CONSTRAINT "pages_blocks_works_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_works_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_works_scroll_items" ADD CONSTRAINT "pages_blocks_works_scroll_items_work_id_works_id_fk" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_works_scroll_items" ADD CONSTRAINT "pages_blocks_works_scroll_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_works_scroll_items" ADD CONSTRAINT "pages_blocks_works_scroll_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_works_scroll"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_works_scroll_items_locales" ADD CONSTRAINT "pages_blocks_works_scroll_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_works_scroll_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_works_scroll" ADD CONSTRAINT "pages_blocks_works_scroll_works_group_id_works_groups_id_fk" FOREIGN KEY ("works_group_id") REFERENCES "public"."works_groups"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_works_scroll" ADD CONSTRAINT "pages_blocks_works_scroll_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_works_scroll_locales" ADD CONSTRAINT "pages_blocks_works_scroll_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_works_scroll"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_featured_work" ADD CONSTRAINT "pages_blocks_featured_work_work_id_works_id_fk" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_featured_work" ADD CONSTRAINT "pages_blocks_featured_work_override_poster_id_media_id_fk" FOREIGN KEY ("override_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_featured_work" ADD CONSTRAINT "pages_blocks_featured_work_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_featured_work_locales" ADD CONSTRAINT "pages_blocks_featured_work_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_featured_work"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_showcase" ADD CONSTRAINT "pages_blocks_team_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_showcase_locales" ADD CONSTRAINT "pages_blocks_team_showcase_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_team_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_press_list" ADD CONSTRAINT "pages_blocks_press_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_press_list_locales" ADD CONSTRAINT "pages_blocks_press_list_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_press_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_info" ADD CONSTRAINT "pages_blocks_contact_info_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_info_locales" ADD CONSTRAINT "pages_blocks_contact_info_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_contact_info"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_form" ADD CONSTRAINT "pages_blocks_contact_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_form_locales" ADD CONSTRAINT "pages_blocks_contact_form_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_contact_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_legal_sections_sections" ADD CONSTRAINT "pages_blocks_legal_sections_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_legal_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_legal_sections_sections_locales" ADD CONSTRAINT "pages_blocks_legal_sections_sections_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_legal_sections_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_legal_sections" ADD CONSTRAINT "pages_blocks_legal_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_works_fk" FOREIGN KEY ("works_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_columns" ADD CONSTRAINT "_pages_v_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_columns_locales" ADD CONSTRAINT "_pages_v_blocks_content_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_content_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content" ADD CONSTRAINT "_pages_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_block" ADD CONSTRAINT "_pages_v_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_block" ADD CONSTRAINT "_pages_v_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_block_locales" ADD CONSTRAINT "_pages_v_blocks_media_block_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_media_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_links" ADD CONSTRAINT "_pages_v_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_links_locales" ADD CONSTRAINT "_pages_v_blocks_cta_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_locales" ADD CONSTRAINT "_pages_v_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_two_column_layout" ADD CONSTRAINT "_pages_v_blocks_two_column_layout_left_media_id_media_id_fk" FOREIGN KEY ("left_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_two_column_layout" ADD CONSTRAINT "_pages_v_blocks_two_column_layout_right_media_id_media_id_fk" FOREIGN KEY ("right_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_two_column_layout" ADD CONSTRAINT "_pages_v_blocks_two_column_layout_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_two_column_layout_locales" ADD CONSTRAINT "_pages_v_blocks_two_column_layout_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_two_column_layout"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_works_grid" ADD CONSTRAINT "_pages_v_blocks_works_grid_works_group_id_works_groups_id_fk" FOREIGN KEY ("works_group_id") REFERENCES "public"."works_groups"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_works_grid" ADD CONSTRAINT "_pages_v_blocks_works_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_works_grid_locales" ADD CONSTRAINT "_pages_v_blocks_works_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_works_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_works_scroll_items" ADD CONSTRAINT "_pages_v_blocks_works_scroll_items_work_id_works_id_fk" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_works_scroll_items" ADD CONSTRAINT "_pages_v_blocks_works_scroll_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_works_scroll_items" ADD CONSTRAINT "_pages_v_blocks_works_scroll_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_works_scroll"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_works_scroll_items_locales" ADD CONSTRAINT "_pages_v_blocks_works_scroll_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_works_scroll_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_works_scroll" ADD CONSTRAINT "_pages_v_blocks_works_scroll_works_group_id_works_groups_id_fk" FOREIGN KEY ("works_group_id") REFERENCES "public"."works_groups"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_works_scroll" ADD CONSTRAINT "_pages_v_blocks_works_scroll_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_works_scroll_locales" ADD CONSTRAINT "_pages_v_blocks_works_scroll_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_works_scroll"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_featured_work" ADD CONSTRAINT "_pages_v_blocks_featured_work_work_id_works_id_fk" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_featured_work" ADD CONSTRAINT "_pages_v_blocks_featured_work_override_poster_id_media_id_fk" FOREIGN KEY ("override_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_featured_work" ADD CONSTRAINT "_pages_v_blocks_featured_work_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_featured_work_locales" ADD CONSTRAINT "_pages_v_blocks_featured_work_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_featured_work"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team_showcase" ADD CONSTRAINT "_pages_v_blocks_team_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team_showcase_locales" ADD CONSTRAINT "_pages_v_blocks_team_showcase_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_team_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_press_list" ADD CONSTRAINT "_pages_v_blocks_press_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_press_list_locales" ADD CONSTRAINT "_pages_v_blocks_press_list_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_press_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_info" ADD CONSTRAINT "_pages_v_blocks_contact_info_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_info_locales" ADD CONSTRAINT "_pages_v_blocks_contact_info_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_contact_info"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_form" ADD CONSTRAINT "_pages_v_blocks_contact_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_form_locales" ADD CONSTRAINT "_pages_v_blocks_contact_form_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_contact_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_legal_sections_sections" ADD CONSTRAINT "_pages_v_blocks_legal_sections_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_legal_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_legal_sections_sections_locales" ADD CONSTRAINT "_pages_v_blocks_legal_sections_sections_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_legal_sections_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_legal_sections" ADD CONSTRAINT "_pages_v_blocks_legal_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_media_id_media_id_fk" FOREIGN KEY ("version_hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_works_fk" FOREIGN KEY ("works_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "works_groups_rels" ADD CONSTRAINT "works_groups_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."works_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "works_groups_rels" ADD CONSTRAINT "works_groups_rels_works_fk" FOREIGN KEY ("works_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "works_tags" ADD CONSTRAINT "works_tags_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "works" ADD CONSTRAINT "works_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team_members" ADD CONSTRAINT "team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_works_groups_fk" FOREIGN KEY ("works_groups_id") REFERENCES "public"."works_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_works_fk" FOREIGN KEY ("works_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_members_fk" FOREIGN KEY ("team_members_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_press_items_fk" FOREIGN KEY ("press_items_id") REFERENCES "public"."press_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_config_about_paragraphs" ADD CONSTRAINT "site_config_about_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_config"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_config_legal_sections_paragraphs" ADD CONSTRAINT "site_config_legal_sections_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_config_legal_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_config_legal_sections" ADD CONSTRAINT "site_config_legal_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_config"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_config" ADD CONSTRAINT "site_config_brand_logo_id_media_id_fk" FOREIGN KEY ("brand_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_config" ADD CONSTRAINT "site_config_brand_favicon_id_media_id_fk" FOREIGN KEY ("brand_favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_config" ADD CONSTRAINT "site_config_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_header_items" ADD CONSTRAINT "navigation_header_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_content_columns_order_idx" ON "pages_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_columns_parent_id_idx" ON "pages_blocks_content_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_content_columns_locales_locale_parent_id_unique" ON "pages_blocks_content_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_content_order_idx" ON "pages_blocks_content" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_parent_id_idx" ON "pages_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_path_idx" ON "pages_blocks_content" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_block_order_idx" ON "pages_blocks_media_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_media_block_parent_id_idx" ON "pages_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_media_block_path_idx" ON "pages_blocks_media_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_block_media_idx" ON "pages_blocks_media_block" USING btree ("media_id");
  CREATE UNIQUE INDEX "pages_blocks_media_block_locales_locale_parent_id_unique" ON "pages_blocks_media_block_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_cta_links_order_idx" ON "pages_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_links_parent_id_idx" ON "pages_blocks_cta_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_cta_links_locales_locale_parent_id_unique" ON "pages_blocks_cta_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_cta_locales_locale_parent_id_unique" ON "pages_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_two_column_layout_order_idx" ON "pages_blocks_two_column_layout" USING btree ("_order");
  CREATE INDEX "pages_blocks_two_column_layout_parent_id_idx" ON "pages_blocks_two_column_layout" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_two_column_layout_path_idx" ON "pages_blocks_two_column_layout" USING btree ("_path");
  CREATE INDEX "pages_blocks_two_column_layout_left_media_idx" ON "pages_blocks_two_column_layout" USING btree ("left_media_id");
  CREATE INDEX "pages_blocks_two_column_layout_right_media_idx" ON "pages_blocks_two_column_layout" USING btree ("right_media_id");
  CREATE UNIQUE INDEX "pages_blocks_two_column_layout_locales_locale_parent_id_uniq" ON "pages_blocks_two_column_layout_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_works_grid_order_idx" ON "pages_blocks_works_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_works_grid_parent_id_idx" ON "pages_blocks_works_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_works_grid_path_idx" ON "pages_blocks_works_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_works_grid_works_group_idx" ON "pages_blocks_works_grid" USING btree ("works_group_id");
  CREATE UNIQUE INDEX "pages_blocks_works_grid_locales_locale_parent_id_unique" ON "pages_blocks_works_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_works_scroll_items_order_idx" ON "pages_blocks_works_scroll_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_works_scroll_items_parent_id_idx" ON "pages_blocks_works_scroll_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_works_scroll_items_work_idx" ON "pages_blocks_works_scroll_items" USING btree ("work_id");
  CREATE INDEX "pages_blocks_works_scroll_items_media_idx" ON "pages_blocks_works_scroll_items" USING btree ("media_id");
  CREATE UNIQUE INDEX "pages_blocks_works_scroll_items_locales_locale_parent_id_uni" ON "pages_blocks_works_scroll_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_works_scroll_order_idx" ON "pages_blocks_works_scroll" USING btree ("_order");
  CREATE INDEX "pages_blocks_works_scroll_parent_id_idx" ON "pages_blocks_works_scroll" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_works_scroll_path_idx" ON "pages_blocks_works_scroll" USING btree ("_path");
  CREATE INDEX "pages_blocks_works_scroll_works_group_idx" ON "pages_blocks_works_scroll" USING btree ("works_group_id");
  CREATE UNIQUE INDEX "pages_blocks_works_scroll_locales_locale_parent_id_unique" ON "pages_blocks_works_scroll_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_featured_work_order_idx" ON "pages_blocks_featured_work" USING btree ("_order");
  CREATE INDEX "pages_blocks_featured_work_parent_id_idx" ON "pages_blocks_featured_work" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_featured_work_path_idx" ON "pages_blocks_featured_work" USING btree ("_path");
  CREATE INDEX "pages_blocks_featured_work_work_idx" ON "pages_blocks_featured_work" USING btree ("work_id");
  CREATE INDEX "pages_blocks_featured_work_override_poster_idx" ON "pages_blocks_featured_work" USING btree ("override_poster_id");
  CREATE UNIQUE INDEX "pages_blocks_featured_work_locales_locale_parent_id_unique" ON "pages_blocks_featured_work_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_team_showcase_order_idx" ON "pages_blocks_team_showcase" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_showcase_parent_id_idx" ON "pages_blocks_team_showcase" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_showcase_path_idx" ON "pages_blocks_team_showcase" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_team_showcase_locales_locale_parent_id_unique" ON "pages_blocks_team_showcase_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_press_list_order_idx" ON "pages_blocks_press_list" USING btree ("_order");
  CREATE INDEX "pages_blocks_press_list_parent_id_idx" ON "pages_blocks_press_list" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_press_list_path_idx" ON "pages_blocks_press_list" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_press_list_locales_locale_parent_id_unique" ON "pages_blocks_press_list_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_contact_info_order_idx" ON "pages_blocks_contact_info" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_info_parent_id_idx" ON "pages_blocks_contact_info" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_info_path_idx" ON "pages_blocks_contact_info" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_contact_info_locales_locale_parent_id_unique" ON "pages_blocks_contact_info_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_contact_form_order_idx" ON "pages_blocks_contact_form" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_form_parent_id_idx" ON "pages_blocks_contact_form" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_form_path_idx" ON "pages_blocks_contact_form" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_contact_form_locales_locale_parent_id_unique" ON "pages_blocks_contact_form_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_legal_sections_sections_order_idx" ON "pages_blocks_legal_sections_sections" USING btree ("_order");
  CREATE INDEX "pages_blocks_legal_sections_sections_parent_id_idx" ON "pages_blocks_legal_sections_sections" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_legal_sections_sections_locales_locale_parent_i" ON "pages_blocks_legal_sections_sections_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_legal_sections_order_idx" ON "pages_blocks_legal_sections" USING btree ("_order");
  CREATE INDEX "pages_blocks_legal_sections_parent_id_idx" ON "pages_blocks_legal_sections" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_legal_sections_path_idx" ON "pages_blocks_legal_sections" USING btree ("_path");
  CREATE INDEX "pages_hero_hero_media_idx" ON "pages" USING btree ("hero_media_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_works_id_idx" ON "pages_rels" USING btree ("works_id");
  CREATE INDEX "_pages_v_blocks_content_columns_order_idx" ON "_pages_v_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_columns_parent_id_idx" ON "_pages_v_blocks_content_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_content_columns_locales_locale_parent_id_uni" ON "_pages_v_blocks_content_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_content_order_idx" ON "_pages_v_blocks_content" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_parent_id_idx" ON "_pages_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_path_idx" ON "_pages_v_blocks_content" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_block_order_idx" ON "_pages_v_blocks_media_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_media_block_parent_id_idx" ON "_pages_v_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_media_block_path_idx" ON "_pages_v_blocks_media_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_block_media_idx" ON "_pages_v_blocks_media_block" USING btree ("media_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_media_block_locales_locale_parent_id_unique" ON "_pages_v_blocks_media_block_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_links_order_idx" ON "_pages_v_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_links_parent_id_idx" ON "_pages_v_blocks_cta_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_cta_links_locales_locale_parent_id_unique" ON "_pages_v_blocks_cta_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_order_idx" ON "_pages_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_parent_id_idx" ON "_pages_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_path_idx" ON "_pages_v_blocks_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_cta_locales_locale_parent_id_unique" ON "_pages_v_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_two_column_layout_order_idx" ON "_pages_v_blocks_two_column_layout" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_two_column_layout_parent_id_idx" ON "_pages_v_blocks_two_column_layout" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_two_column_layout_path_idx" ON "_pages_v_blocks_two_column_layout" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_two_column_layout_left_media_idx" ON "_pages_v_blocks_two_column_layout" USING btree ("left_media_id");
  CREATE INDEX "_pages_v_blocks_two_column_layout_right_media_idx" ON "_pages_v_blocks_two_column_layout" USING btree ("right_media_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_two_column_layout_locales_locale_parent_id_u" ON "_pages_v_blocks_two_column_layout_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_works_grid_order_idx" ON "_pages_v_blocks_works_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_works_grid_parent_id_idx" ON "_pages_v_blocks_works_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_works_grid_path_idx" ON "_pages_v_blocks_works_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_works_grid_works_group_idx" ON "_pages_v_blocks_works_grid" USING btree ("works_group_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_works_grid_locales_locale_parent_id_unique" ON "_pages_v_blocks_works_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_works_scroll_items_order_idx" ON "_pages_v_blocks_works_scroll_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_works_scroll_items_parent_id_idx" ON "_pages_v_blocks_works_scroll_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_works_scroll_items_work_idx" ON "_pages_v_blocks_works_scroll_items" USING btree ("work_id");
  CREATE INDEX "_pages_v_blocks_works_scroll_items_media_idx" ON "_pages_v_blocks_works_scroll_items" USING btree ("media_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_works_scroll_items_locales_locale_parent_id_" ON "_pages_v_blocks_works_scroll_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_works_scroll_order_idx" ON "_pages_v_blocks_works_scroll" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_works_scroll_parent_id_idx" ON "_pages_v_blocks_works_scroll" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_works_scroll_path_idx" ON "_pages_v_blocks_works_scroll" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_works_scroll_works_group_idx" ON "_pages_v_blocks_works_scroll" USING btree ("works_group_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_works_scroll_locales_locale_parent_id_unique" ON "_pages_v_blocks_works_scroll_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_featured_work_order_idx" ON "_pages_v_blocks_featured_work" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_featured_work_parent_id_idx" ON "_pages_v_blocks_featured_work" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_featured_work_path_idx" ON "_pages_v_blocks_featured_work" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_featured_work_work_idx" ON "_pages_v_blocks_featured_work" USING btree ("work_id");
  CREATE INDEX "_pages_v_blocks_featured_work_override_poster_idx" ON "_pages_v_blocks_featured_work" USING btree ("override_poster_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_featured_work_locales_locale_parent_id_uniqu" ON "_pages_v_blocks_featured_work_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_team_showcase_order_idx" ON "_pages_v_blocks_team_showcase" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_team_showcase_parent_id_idx" ON "_pages_v_blocks_team_showcase" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_team_showcase_path_idx" ON "_pages_v_blocks_team_showcase" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_team_showcase_locales_locale_parent_id_uniqu" ON "_pages_v_blocks_team_showcase_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_press_list_order_idx" ON "_pages_v_blocks_press_list" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_press_list_parent_id_idx" ON "_pages_v_blocks_press_list" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_press_list_path_idx" ON "_pages_v_blocks_press_list" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_press_list_locales_locale_parent_id_unique" ON "_pages_v_blocks_press_list_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_info_order_idx" ON "_pages_v_blocks_contact_info" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_info_parent_id_idx" ON "_pages_v_blocks_contact_info" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_info_path_idx" ON "_pages_v_blocks_contact_info" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_contact_info_locales_locale_parent_id_unique" ON "_pages_v_blocks_contact_info_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_form_order_idx" ON "_pages_v_blocks_contact_form" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_form_parent_id_idx" ON "_pages_v_blocks_contact_form" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_form_path_idx" ON "_pages_v_blocks_contact_form" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_contact_form_locales_locale_parent_id_unique" ON "_pages_v_blocks_contact_form_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_legal_sections_sections_order_idx" ON "_pages_v_blocks_legal_sections_sections" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_legal_sections_sections_parent_id_idx" ON "_pages_v_blocks_legal_sections_sections" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_legal_sections_sections_locales_locale_paren" ON "_pages_v_blocks_legal_sections_sections_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_legal_sections_order_idx" ON "_pages_v_blocks_legal_sections" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_legal_sections_parent_id_idx" ON "_pages_v_blocks_legal_sections" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_legal_sections_path_idx" ON "_pages_v_blocks_legal_sections" USING btree ("_path");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_hero_version_hero_media_idx" ON "_pages_v" USING btree ("version_hero_media_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_works_id_idx" ON "_pages_v_rels" USING btree ("works_id");
  CREATE UNIQUE INDEX "works_groups_slug_idx" ON "works_groups" USING btree ("slug");
  CREATE INDEX "works_groups_updated_at_idx" ON "works_groups" USING btree ("updated_at");
  CREATE INDEX "works_groups_created_at_idx" ON "works_groups" USING btree ("created_at");
  CREATE INDEX "works_groups_rels_order_idx" ON "works_groups_rels" USING btree ("order");
  CREATE INDEX "works_groups_rels_parent_idx" ON "works_groups_rels" USING btree ("parent_id");
  CREATE INDEX "works_groups_rels_path_idx" ON "works_groups_rels" USING btree ("path");
  CREATE INDEX "works_groups_rels_works_id_idx" ON "works_groups_rels" USING btree ("works_id");
  CREATE INDEX "works_tags_order_idx" ON "works_tags" USING btree ("order");
  CREATE INDEX "works_tags_parent_idx" ON "works_tags" USING btree ("parent_id");
  CREATE UNIQUE INDEX "works_slug_idx" ON "works" USING btree ("slug");
  CREATE INDEX "works_poster_idx" ON "works" USING btree ("poster_id");
  CREATE INDEX "works_updated_at_idx" ON "works" USING btree ("updated_at");
  CREATE INDEX "works_created_at_idx" ON "works" USING btree ("created_at");
  CREATE INDEX "team_members_photo_idx" ON "team_members" USING btree ("photo_id");
  CREATE INDEX "team_members_updated_at_idx" ON "team_members" USING btree ("updated_at");
  CREATE INDEX "team_members_created_at_idx" ON "team_members" USING btree ("created_at");
  CREATE INDEX "press_items_updated_at_idx" ON "press_items" USING btree ("updated_at");
  CREATE INDEX "press_items_created_at_idx" ON "press_items" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_poster_sizes_poster_filename_idx" ON "media" USING btree ("sizes_poster_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_works_groups_id_idx" ON "payload_locked_documents_rels" USING btree ("works_groups_id");
  CREATE INDEX "payload_locked_documents_rels_works_id_idx" ON "payload_locked_documents_rels" USING btree ("works_id");
  CREATE INDEX "payload_locked_documents_rels_team_members_id_idx" ON "payload_locked_documents_rels" USING btree ("team_members_id");
  CREATE INDEX "payload_locked_documents_rels_press_items_id_idx" ON "payload_locked_documents_rels" USING btree ("press_items_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_config_about_paragraphs_order_idx" ON "site_config_about_paragraphs" USING btree ("_order");
  CREATE INDEX "site_config_about_paragraphs_parent_id_idx" ON "site_config_about_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "site_config_legal_sections_paragraphs_order_idx" ON "site_config_legal_sections_paragraphs" USING btree ("_order");
  CREATE INDEX "site_config_legal_sections_paragraphs_parent_id_idx" ON "site_config_legal_sections_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "site_config_legal_sections_order_idx" ON "site_config_legal_sections" USING btree ("_order");
  CREATE INDEX "site_config_legal_sections_parent_id_idx" ON "site_config_legal_sections" USING btree ("_parent_id");
  CREATE INDEX "site_config_brand_brand_logo_idx" ON "site_config" USING btree ("brand_logo_id");
  CREATE INDEX "site_config_brand_brand_favicon_idx" ON "site_config" USING btree ("brand_favicon_id");
  CREATE INDEX "site_config_seo_seo_og_image_idx" ON "site_config" USING btree ("seo_og_image_id");
  CREATE INDEX "navigation_header_items_order_idx" ON "navigation_header_items" USING btree ("_order");
  CREATE INDEX "navigation_header_items_parent_id_idx" ON "navigation_header_items" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_content_columns" CASCADE;
  DROP TABLE "pages_blocks_content_columns_locales" CASCADE;
  DROP TABLE "pages_blocks_content" CASCADE;
  DROP TABLE "pages_blocks_media_block" CASCADE;
  DROP TABLE "pages_blocks_media_block_locales" CASCADE;
  DROP TABLE "pages_blocks_cta_links" CASCADE;
  DROP TABLE "pages_blocks_cta_links_locales" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages_blocks_cta_locales" CASCADE;
  DROP TABLE "pages_blocks_two_column_layout" CASCADE;
  DROP TABLE "pages_blocks_two_column_layout_locales" CASCADE;
  DROP TABLE "pages_blocks_works_grid" CASCADE;
  DROP TABLE "pages_blocks_works_grid_locales" CASCADE;
  DROP TABLE "pages_blocks_works_scroll_items" CASCADE;
  DROP TABLE "pages_blocks_works_scroll_items_locales" CASCADE;
  DROP TABLE "pages_blocks_works_scroll" CASCADE;
  DROP TABLE "pages_blocks_works_scroll_locales" CASCADE;
  DROP TABLE "pages_blocks_featured_work" CASCADE;
  DROP TABLE "pages_blocks_featured_work_locales" CASCADE;
  DROP TABLE "pages_blocks_team_showcase" CASCADE;
  DROP TABLE "pages_blocks_team_showcase_locales" CASCADE;
  DROP TABLE "pages_blocks_press_list" CASCADE;
  DROP TABLE "pages_blocks_press_list_locales" CASCADE;
  DROP TABLE "pages_blocks_contact_info" CASCADE;
  DROP TABLE "pages_blocks_contact_info_locales" CASCADE;
  DROP TABLE "pages_blocks_contact_form" CASCADE;
  DROP TABLE "pages_blocks_contact_form_locales" CASCADE;
  DROP TABLE "pages_blocks_legal_sections_sections" CASCADE;
  DROP TABLE "pages_blocks_legal_sections_sections_locales" CASCADE;
  DROP TABLE "pages_blocks_legal_sections" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_blocks_content_columns" CASCADE;
  DROP TABLE "_pages_v_blocks_content_columns_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_content" CASCADE;
  DROP TABLE "_pages_v_blocks_media_block" CASCADE;
  DROP TABLE "_pages_v_blocks_media_block_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_links" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_links_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_cta" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_two_column_layout" CASCADE;
  DROP TABLE "_pages_v_blocks_two_column_layout_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_works_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_works_grid_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_works_scroll_items" CASCADE;
  DROP TABLE "_pages_v_blocks_works_scroll_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_works_scroll" CASCADE;
  DROP TABLE "_pages_v_blocks_works_scroll_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_featured_work" CASCADE;
  DROP TABLE "_pages_v_blocks_featured_work_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_team_showcase" CASCADE;
  DROP TABLE "_pages_v_blocks_team_showcase_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_press_list" CASCADE;
  DROP TABLE "_pages_v_blocks_press_list_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_info" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_info_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_form" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_form_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_legal_sections_sections" CASCADE;
  DROP TABLE "_pages_v_blocks_legal_sections_sections_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_legal_sections" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "works_groups" CASCADE;
  DROP TABLE "works_groups_rels" CASCADE;
  DROP TABLE "works_tags" CASCADE;
  DROP TABLE "works" CASCADE;
  DROP TABLE "team_members" CASCADE;
  DROP TABLE "press_items" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_config_about_paragraphs" CASCADE;
  DROP TABLE "site_config_legal_sections_paragraphs" CASCADE;
  DROP TABLE "site_config_legal_sections" CASCADE;
  DROP TABLE "site_config" CASCADE;
  DROP TABLE "navigation_header_items" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_pages_blocks_content_columns_size";
  DROP TYPE "public"."enum_pages_blocks_content_section_tone";
  DROP TYPE "public"."enum_pages_blocks_media_block_size";
  DROP TYPE "public"."enum_pages_blocks_cta_links_appearance";
  DROP TYPE "public"."enum_pages_blocks_cta_section_tone";
  DROP TYPE "public"."enum_pages_blocks_two_column_layout_section_tone";
  DROP TYPE "public"."enum_pages_blocks_works_grid_source_type";
  DROP TYPE "public"."enum_pages_blocks_works_grid_category";
  DROP TYPE "public"."enum_pages_blocks_works_grid_section_tone";
  DROP TYPE "public"."enum_pages_blocks_works_scroll_items_size";
  DROP TYPE "public"."enum_pages_blocks_works_scroll_source_type";
  DROP TYPE "public"."enum_pages_blocks_works_scroll_section_tone";
  DROP TYPE "public"."enum_pages_blocks_featured_work_layout";
  DROP TYPE "public"."enum_pages_blocks_featured_work_section_tone";
  DROP TYPE "public"."enum_pages_blocks_team_showcase_section_tone";
  DROP TYPE "public"."enum_pages_blocks_press_list_section_tone";
  DROP TYPE "public"."enum_pages_hero_type";
  DROP TYPE "public"."enum_pages_meta_json_ld_type";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_size";
  DROP TYPE "public"."enum__pages_v_blocks_content_section_tone";
  DROP TYPE "public"."enum__pages_v_blocks_media_block_size";
  DROP TYPE "public"."enum__pages_v_blocks_cta_links_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_cta_section_tone";
  DROP TYPE "public"."enum__pages_v_blocks_two_column_layout_section_tone";
  DROP TYPE "public"."enum__pages_v_blocks_works_grid_source_type";
  DROP TYPE "public"."enum__pages_v_blocks_works_grid_category";
  DROP TYPE "public"."enum__pages_v_blocks_works_grid_section_tone";
  DROP TYPE "public"."enum__pages_v_blocks_works_scroll_items_size";
  DROP TYPE "public"."enum__pages_v_blocks_works_scroll_source_type";
  DROP TYPE "public"."enum__pages_v_blocks_works_scroll_section_tone";
  DROP TYPE "public"."enum__pages_v_blocks_featured_work_layout";
  DROP TYPE "public"."enum__pages_v_blocks_featured_work_section_tone";
  DROP TYPE "public"."enum__pages_v_blocks_team_showcase_section_tone";
  DROP TYPE "public"."enum__pages_v_blocks_press_list_section_tone";
  DROP TYPE "public"."enum__pages_v_version_hero_type";
  DROP TYPE "public"."enum__pages_v_version_meta_json_ld_type";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum_works_tags";
  DROP TYPE "public"."enum_works_category";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";`)
}
