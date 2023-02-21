import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('users', (table) => {
    table.string('role').notNullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('users', (table) => {
    table.string('role').nullable().alter();
  });
}
