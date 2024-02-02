export async function up(knex) {
  return knex.schema.table('steps', (table) => {
    table.string('webhook_path');
  });
}

export async function down(knex) {
  return knex.schema.table('steps', (table) => {
    table.dropColumn('webhook_path');
  });
}
