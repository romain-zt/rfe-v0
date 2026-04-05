import * as migration_20260405_075055_initial from './20260405_075055_initial';

export const migrations = [
  {
    up: migration_20260405_075055_initial.up,
    down: migration_20260405_075055_initial.down,
    name: '20260405_075055_initial'
  },
];
