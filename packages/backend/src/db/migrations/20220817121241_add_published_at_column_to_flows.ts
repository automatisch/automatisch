import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('flows', (table) => {
    table.timestamp('published_at').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('flows', (table) => {
    table.dropColumn('published_at');
  });
}
