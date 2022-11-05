import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('flows', (table) => {
    table.boolean('active').defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('flows', (table) => {
    table.dropColumn('active');
  });
}
