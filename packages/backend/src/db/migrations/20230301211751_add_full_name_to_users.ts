import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('users', async (table) => {
    table.string('full_name');

    await knex('users').update({ full_name: 'Initial admin' });
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('users', (table) => {
    table.dropColumn('full_name');
  });
}
