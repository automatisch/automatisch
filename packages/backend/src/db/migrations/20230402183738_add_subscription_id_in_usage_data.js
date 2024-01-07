import appConfig from '../../config/app.js';

export async function up(knex) {
  if (!appConfig.isCloud) return;

  return knex.schema.table('usage_data', (table) => {
    table.uuid('subscription_id').references('id').inTable('subscriptions');
  });
}

export async function down(knex) {
  if (!appConfig.isCloud) return;

  return knex.schema.table('usage_data', (table) => {
    table.dropColumn('subscription_id');
  });
}
