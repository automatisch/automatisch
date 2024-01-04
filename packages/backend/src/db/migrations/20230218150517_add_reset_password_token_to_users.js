export async function up(knex) {
  return knex.schema.table('users', (table) => {
    table.string('reset_password_token');
  });
}

export async function down(knex) {
  return knex.schema.table('users', (table) => {
    table.dropColumn('reset_password_token');
  });
}
