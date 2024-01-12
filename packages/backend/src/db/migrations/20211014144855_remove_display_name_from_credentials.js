export async function up(knex) {
  return knex.schema.table('credentials', (table) => {
    table.dropColumn('display_name');
  });
}

export async function down(knex) {
  return knex.schema.table('credentials', (table) => {
    table.string('display_name');
  });
}
