import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('flows', (table) => {
    table.string('remote_webhook_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('flows', (table) => {
    table.dropColumn('remote_webhook_id');
  });
}
