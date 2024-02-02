export async function up(knex) {
  return knex.schema.table('users', async (table) => {
    table.string('full_name');

    await knex('users').update({ full_name: 'Initial admin' });
  });
}

export async function down(knex) {
  return knex.schema.table('users', (table) => {
    table.dropColumn('full_name');
  });
}
