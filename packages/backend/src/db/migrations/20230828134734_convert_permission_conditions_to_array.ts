import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex('permissions')
    .where(knex.raw('conditions::text'), '=', knex.raw("'{}'::text"))
    .update('conditions', JSON.stringify([]));
}

export async function down(): Promise<void> {
  // void
}
