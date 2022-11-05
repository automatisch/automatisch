import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('steps', (table) => {
    table.string('key').nullable().alter();
    table.string('app_key').nullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('steps', (table) => {
    table.string('key').notNullable().alter();
    table.string('app_key').notNullable().alter();
  });
}
