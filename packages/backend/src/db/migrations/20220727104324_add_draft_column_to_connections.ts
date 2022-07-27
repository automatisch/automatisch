import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('connections', (table) => {
    table.boolean('draft').defaultTo(true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('connections', (table) => {
    table.dropColumn('draft');
  });
}
