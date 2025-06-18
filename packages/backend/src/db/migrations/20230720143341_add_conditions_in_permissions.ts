import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('permissions', (table) => {
    table.jsonb('conditions').notNullable().defaultTo([]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('permissions', (table) => {
    table.dropColumn('conditions');
  });
}
