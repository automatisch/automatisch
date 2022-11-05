import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('steps', (table) => {
    table.uuid('flow_id').references('id').inTable('flows');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('steps', (table) => {
    table.dropColumn('flow_id');
  });
}
