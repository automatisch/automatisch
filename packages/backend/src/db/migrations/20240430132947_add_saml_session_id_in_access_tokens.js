export async function up(knex) {
  return knex.schema.table('access_tokens', (table) => {
    table.string('saml_session_id').nullable();
  });
}

export async function down(knex) {
  return knex.schema.table('access_tokens', (table) => {
    table.dropColumn('saml_session_id');
  });
}
