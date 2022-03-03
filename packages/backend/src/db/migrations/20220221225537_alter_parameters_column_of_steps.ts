import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('steps', (table) => {
    table.jsonb('parameters').defaultTo('{}').alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('steps', (table) => {
    table.text('parameters').alter();
  });
}
