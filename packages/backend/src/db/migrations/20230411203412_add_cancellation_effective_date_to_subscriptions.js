import appConfig from '../../config/app.js';

export async function up(knex) {
  if (!appConfig.isCloud) return;

  return knex.schema.table('subscriptions', (table) => {
    table.date('cancellation_effective_date');
  });
}

export async function down(knex) {
  if (!appConfig.isCloud) return;

  return knex.schema.table('subscriptions', (table) => {
    table.dropColumn('cancellation_effective_date');
  });
}
