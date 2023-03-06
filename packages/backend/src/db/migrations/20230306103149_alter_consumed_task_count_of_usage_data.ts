import { Knex } from 'knex';
import appConfig from '../../config/app';

export async function up(knex: Knex): Promise<void> {
  if (!appConfig.isCloud) return;

  return knex.schema.alterTable('usage_data', (table) => {
    table.integer('consumed_task_count').notNullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  if (!appConfig.isCloud) return;

  return knex.schema.alterTable('usage_data', (table) => {
    table.string('consumed_task_count').notNullable().alter();
  });
}
