import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('executions', (table) => {
    table.string('internal_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('executions', (table) => {
    table.dropColumn('internal_id');
  });
}
