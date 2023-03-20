import { Knex } from 'knex';
import appConfig from '../../config/app';

export async function up(knex: Knex): Promise<void> {
  if (!appConfig.isCloud) return;

  return knex.schema.table('users', (table) => {
    table.date('trial_expiry_date');
  });
}

export async function down(knex: Knex): Promise<void> {
  if (!appConfig.isCloud) return;

  return knex.schema.table('users', (table) => {
    table.dropColumn('trial_expiry_date');
  });
}
