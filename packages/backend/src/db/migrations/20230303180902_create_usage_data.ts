import { Knex } from 'knex';
import appConfig from '../../config/app';

export async function up(knex: Knex): Promise<void> {
  if (!appConfig.isCloud) return;

  return knex.schema.createTable('usage_data', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users');
    table.string('consumed_task_count').notNullable();
    table.timestamp('next_reset_at').nullable();
    table.timestamp('deleted_at').nullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  if (!appConfig.isCloud) return;
  return knex.schema.dropTable('usage_data');
}
