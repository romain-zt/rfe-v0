import * as migration_20260405_075055_initial from './20260405_075055_initial';
import * as migration_20260405_104752_form_builder_forms from './20260405_104752_form_builder_forms';
import * as migration_20260405_114654_add_site_config_ui_labels from './20260405_114654_add_site_config_ui_labels';
import * as migration_20260405_144134_add_ai_conversations from './20260405_144134_add_ai_conversations';
import * as migration_20260407_064546_add_missing_admin_columns from './20260407_064546_add_missing_admin_columns';

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
];
