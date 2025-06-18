import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('users', async (table) => {
    table.uuid('role_id').references('id').inTable('roles');
  });

  const theRole = await knex('roles').select('id').limit(1).first();
  const roles = await knex('roles').select('id', 'key');

  for (const role of roles) {
    await knex('users')
      .where({
        role: role.key
      })
      .update({
        role_id: role.id
      });
  }

  // backfill not-migratables
  await knex('users').whereNull('role_id').update({ role_id: theRole.id });
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.table('users', (table) => {
    table.dropColumn('role_id');
  });
}
