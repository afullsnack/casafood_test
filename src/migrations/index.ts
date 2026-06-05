import * as migration_20260531_182007 from './20260531_182007';

export const migrations = [
  {
    up: migration_20260531_182007.up,
    down: migration_20260531_182007.down,
    name: '20260531_182007'
  },
];
