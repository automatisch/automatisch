export async function up(knex) {
  return knex.schema.table('users', async (table) => {
    table.string('role');

    await knex('users').update({ role: 'admin' });
  });
}

export async function down(knex) {
  return knex.schema.table('users', (table) => {
    table.dropColumn('role');
  });
}
