import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.renameTable('credentials', 'connections');
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.renameTable('connections', 'credentials');
}
