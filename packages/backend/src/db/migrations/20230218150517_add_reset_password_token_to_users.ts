import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('users', (table) => {
    table.string('reset_password_token');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('users', (table) => {
    table.dropColumn('reset_password_token');
  });
}
