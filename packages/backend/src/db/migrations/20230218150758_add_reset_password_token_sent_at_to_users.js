export async function up(knex) {
  return knex.schema.table('users', (table) => {
    table.timestamp('reset_password_token_sent_at');
  });
}

export async function down(knex) {
  return knex.schema.table('users', (table) => {
    table.dropColumn('reset_password_token_sent_at');
  });
}
