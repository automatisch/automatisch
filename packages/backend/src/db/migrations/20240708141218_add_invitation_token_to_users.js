export async function up(knex) {
  return knex.schema.table('users', (table) => {
    table.string('invitation_token');
    table.timestamp('invitation_token_sent_at');
  });
}

export async function down(knex) {
  return knex.schema.table('users', (table) => {
    table.dropColumn('invitation_token');
    table.dropColumn('invitation_token_sent_at');
  });
}
