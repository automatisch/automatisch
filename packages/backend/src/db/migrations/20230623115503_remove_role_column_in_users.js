export async function up(knex) {
  await knex.schema.table('users', async (table) => {
    table.dropColumn('role');
  });
}

export async function down(knex) {
  return await knex.schema.table('users', (table) => {
    table.string('role').defaultTo('user');
  });
}
