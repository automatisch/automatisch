import appConfig from '../../config/app.js';

export async function up(knex) {
  if (!appConfig.isCloud) return;

  return knex.schema.alterTable('subscriptions', (table) => {
    table.timestamp('deleted_at').nullable();
  });
}

export async function down(knex) {
  if (!appConfig.isCloud) return;

  return knex.schema.alterTable('subscriptions', (table) => {
    table.dropColumn('deleted_at');
  });
}
