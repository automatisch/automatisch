export async function up(knex) {
  return knex.schema.table('access_tokens', (table) => {
    table.index('token');
    table.index('user_id');
  });
}

export async function down(knex) {
  return knex.schema.table('access_tokens', (table) => {
    table.dropIndex('token');
    table.dropIndex('user_id');
  });
}
