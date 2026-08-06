import * as migration_20260405_075055_initial from './20260405_075055_initial';
import * as migration_20260405_104752_form_builder_forms from './20260405_104752_form_builder_forms';
import * as migration_20260405_114654_add_site_config_ui_labels from './20260405_114654_add_site_config_ui_labels';
import * as migration_20260405_144134_add_ai_conversations from './20260405_144134_add_ai_conversations';
import * as migration_20260407_064546_add_missing_admin_columns from './20260407_064546_add_missing_admin_columns';
import * as migration_20260418_120000_works_production_stage from './20260418_120000_works_production_stage';
import * as migration_20260422_140000_works_credits from './20260422_140000_works_credits';
import * as migration_20260501_094424_media_block_image_position from './20260501_094424_media_block_image_position';
import * as migration_20260501_100105_hero_and_media_block_responsive from './20260501_100105_hero_and_media_block_responsive';
import * as migration_20260501_103854_hero_and_media_block_image_fit from './20260501_103854_hero_and_media_block_image_fit';
import * as migration_20260501_134738_image_position_select from './20260501_134738_image_position_select';
import * as migration_20260611_000000_works_seen_on from './20260611_000000_works_seen_on';
import * as migration_20260611_120000_site_config_secondary_email from './20260611_120000_site_config_secondary_email';
import * as migration_20260626_120000_platforms_and_rich_description from './20260626_120000_platforms_and_rich_description';
import * as migration_20260806_180000_media_title from './20260806_180000_media_title';

export const migrations = [
  {
    up: migration_20260405_075055_initial.up,
    down: migration_20260405_075055_initial.down,
    name: '20260405_075055_initial',
  },
  {
    up: migration_20260405_104752_form_builder_forms.up,
    down: migration_20260405_104752_form_builder_forms.down,
    name: '20260405_104752_form_builder_forms',
  },
  {
    up: migration_20260405_114654_add_site_config_ui_labels.up,
    down: migration_20260405_114654_add_site_config_ui_labels.down,
    name: '20260405_114654_add_site_config_ui_labels',
  },
  {
    up: migration_20260405_144134_add_ai_conversations.up,
    down: migration_20260405_144134_add_ai_conversations.down,
    name: '20260405_144134_add_ai_conversations',
  },
  {
    up: migration_20260407_064546_add_missing_admin_columns.up,
    down: migration_20260407_064546_add_missing_admin_columns.down,
    name: '20260407_064546_add_missing_admin_columns',
  },
  {
    up: migration_20260418_120000_works_production_stage.up,
    down: migration_20260418_120000_works_production_stage.down,
    name: '20260418_120000_works_production_stage',
  },
  {
    up: migration_20260422_140000_works_credits.up,
    down: migration_20260422_140000_works_credits.down,
    name: '20260422_140000_works_credits',
  },
  {
    up: migration_20260501_094424_media_block_image_position.up,
    down: migration_20260501_094424_media_block_image_position.down,
    name: '20260501_094424_media_block_image_position',
  },
  {
    up: migration_20260501_100105_hero_and_media_block_responsive.up,
    down: migration_20260501_100105_hero_and_media_block_responsive.down,
    name: '20260501_100105_hero_and_media_block_responsive',
  },
  {
    up: migration_20260501_103854_hero_and_media_block_image_fit.up,
    down: migration_20260501_103854_hero_and_media_block_image_fit.down,
    name: '20260501_103854_hero_and_media_block_image_fit',
  },
  {
    up: migration_20260501_134738_image_position_select.up,
    down: migration_20260501_134738_image_position_select.down,
    name: '20260501_134738_image_position_select'
  },
  {
    up: migration_20260611_000000_works_seen_on.up,
    down: migration_20260611_000000_works_seen_on.down,
    name: '20260611_000000_works_seen_on',
  },
  {
    up: migration_20260611_120000_site_config_secondary_email.up,
    down: migration_20260611_120000_site_config_secondary_email.down,
    name: '20260611_120000_site_config_secondary_email',
  },
  {
    up: migration_20260626_120000_platforms_and_rich_description.up,
    down: migration_20260626_120000_platforms_and_rich_description.down,
    name: '20260626_120000_platforms_and_rich_description',
  },
  {
    up: migration_20260806_180000_media_title.up,
    down: migration_20260806_180000_media_title.down,
    name: '20260806_180000_media_title',
  },
];
