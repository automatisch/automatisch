import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex('users')
    .whereRaw('email != LOWER(email)')
    .update({
      email: knex.raw('LOWER(email)'),
    });
}

export async function down(): Promise<void> {
  // void
}
