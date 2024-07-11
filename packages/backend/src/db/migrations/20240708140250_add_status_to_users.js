export async function up(knex) {
  return knex.schema.table('users', (table) => {
    table.string('status').defaultTo('active');
  });
}

export async function down(knex) {
  return knex.schema.table('users', (table) => {
    table.dropColumn('status');
  });
}
