import { Knex } from 'knex';
import appConfig from '../../config/app';

export async function up(knex: Knex): Promise<void> {
  if (!appConfig.isCloud) return;

  return knex.schema.table('usage_data', (table) => {
    table.uuid('subscription_id').references('id').inTable('subscriptions');
  });
}

export async function down(knex: Knex): Promise<void> {
  if (!appConfig.isCloud) return;

  return knex.schema.table('usage_data', (table) => {
    table.dropColumn('subscription_id');
  });
}
