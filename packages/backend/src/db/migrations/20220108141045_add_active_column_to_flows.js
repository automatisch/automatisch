export async function up(knex) {
  return knex.schema.table('flows', (table) => {
    table.boolean('active').defaultTo(false);
  });
}

export async function down(knex) {
  return knex.schema.table('flows', (table) => {
    table.dropColumn('active');
  });
}
