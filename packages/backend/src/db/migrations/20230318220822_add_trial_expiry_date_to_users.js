import appConfig from '../../config/app.js';

export async function up(knex) {
  if (!appConfig.isCloud) return;

  return knex.schema.table('users', (table) => {
    table.date('trial_expiry_date');
  });
}

export async function down(knex) {
  if (!appConfig.isCloud) return;

  return knex.schema.table('users', (table) => {
    table.dropColumn('trial_expiry_date');
  });
}
