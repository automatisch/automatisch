import { Knex } from 'knex';
import appConfig from '../../config/app';

export async function up(knex: Knex): Promise<void> {
  if (!appConfig.isCloud) return;

  return knex.schema.table('subscriptions', (table) => {
    table.date('cancellation_effective_date');
  });
}

export async function down(knex: Knex): Promise<void> {
  if (!appConfig.isCloud) return;

  return knex.schema.table('subscriptions', (table) => {
    table.dropColumn('cancellation_effective_date');
  });
}
