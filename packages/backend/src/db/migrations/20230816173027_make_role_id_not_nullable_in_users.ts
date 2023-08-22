import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const role = await knex('roles')
    .select('id')
    .whereIn('key', ['user', 'admin'])
    .orderBy('key', 'desc')
    .limit(1)
    .first();

  if (role) {
    // backfill nulls
    await knex('users').whereNull('role_id').update({ role_id: role.id });
  }

  return await knex.schema.alterTable('users', (table) => {
    table.uuid('role_id').notNullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.alterTable('users', (table) => {
    table.uuid('role_id').nullable().alter();
  });
}
