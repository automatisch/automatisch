import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('executions', (table) => {
    table.index('updated_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('executions', (table) => {
    table.dropIndex('updated_at');
  });
}
