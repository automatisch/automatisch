export async function up(knex) {
  await knex.schema.table('connections', async (table) => {
    table
      .uuid('app_auth_client_id')
      .references('id')
      .inTable('app_auth_clients');
  });
}

export async function down(knex) {
  return await knex.schema.table('connections', (table) => {
    table.dropColumn('app_auth_client_id');
  });
}
