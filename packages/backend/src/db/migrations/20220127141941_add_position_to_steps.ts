import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('steps', (table) => {
    table.integer('position').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('steps', (table) => {
    table.dropColumn('position');
  });
}
