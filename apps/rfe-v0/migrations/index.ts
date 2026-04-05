import * as migration_20260405_075055_initial from './20260405_075055_initial';
import * as migration_20260405_104752_form_builder_forms from './20260405_104752_form_builder_forms';

export const migrations = [
  {
    up: migration_20260405_075055_initial.up,
    down: migration_20260405_075055_initial.down,
    name: '20260405_075055_initial',
  },
  {
    up: migration_20260405_104752_form_builder_forms.up,
    down: migration_20260405_104752_form_builder_forms.down,
    name: '20260405_104752_form_builder_forms'
  },
];
