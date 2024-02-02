export async function up(knex) {
  return knex.schema.table('flows', (table) => {
    table.string('remote_webhook_id');
  });
}

export async function down(knex) {
  return knex.schema.table('flows', (table) => {
    table.dropColumn('remote_webhook_id');
  });
}
