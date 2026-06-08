import * as migration_20260605_190622_initial from './20260605_190622_initial';
import * as migration_20260607_115725_add_ngn_currency_and_unit from './20260607_115725_add_ngn_currency_and_unit';

export const migrations = [
  {
    up: migration_20260605_190622_initial.up,
    down: migration_20260605_190622_initial.down,
    name: '20260605_190622_initial',
  },
  {
    up: migration_20260607_115725_add_ngn_currency_and_unit.up,
    down: migration_20260607_115725_add_ngn_currency_and_unit.down,
    name: '20260607_115725_add_ngn_currency_and_unit'
  },
];
