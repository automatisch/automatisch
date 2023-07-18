import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.alterTable('users', (table) => {
    table.string('password').nullable().alter();
  });
}

export async function down(): Promise<void> {
  // void
}
