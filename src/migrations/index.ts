import * as migration_20260605_190622_initial from './20260605_190622_initial';

export const migrations = [
  {
    up: migration_20260605_190622_initial.up,
    down: migration_20260605_190622_initial.down,
    name: '20260605_190622_initial'
  },
];
