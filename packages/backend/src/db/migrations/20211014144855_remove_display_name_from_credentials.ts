import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('credentials', (table) => {
    table.dropColumn('display_name');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('credentials', (table) => {
    table.string('display_name');
  });
}
