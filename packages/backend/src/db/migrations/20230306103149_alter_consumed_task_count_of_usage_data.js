import appConfig from '../../config/app.js';

export async function up(knex) {
  if (!appConfig.isCloud) return;

  return knex.schema.alterTable('usage_data', (table) => {
    table.integer('consumed_task_count').notNullable().alter();
  });
}

export async function down(knex) {
  if (!appConfig.isCloud) return;

  return knex.schema.alterTable('usage_data', (table) => {
    table.string('consumed_task_count').notNullable().alter();
  });
}
