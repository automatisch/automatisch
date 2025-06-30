import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('users', async (table) => {
    table.dropColumn('role');
  });
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.table('users', (table) => {
    table.string('role').defaultTo('user');
  });
}
