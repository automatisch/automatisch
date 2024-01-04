export async function up(knex) {
  return knex.schema.table('flows', (table) => {
    table.timestamp('published_at').nullable();
  });
}

export async function down(knex) {
  return knex.schema.table('flows', (table) => {
    table.dropColumn('published_at');
  });
}
