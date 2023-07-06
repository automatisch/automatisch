import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.alterTable('users', (table) => {
    table.string('password').nullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.alterTable('users', table => {
    // what do we do? passwords cannot be left empty
    // table.string('password').notNullable().alter();
  });
}
