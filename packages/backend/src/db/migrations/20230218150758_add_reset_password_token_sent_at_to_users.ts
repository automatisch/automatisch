import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('users', (table) => {
    table.timestamp('reset_password_token_sent_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('users', (table) => {
    table.dropColumn('reset_password_token_sent_at');
  });
}
