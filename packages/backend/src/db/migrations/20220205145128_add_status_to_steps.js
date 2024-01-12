export async function up(knex) {
  return knex.schema.table('steps', (table) => {
    table.string('status').notNullable().defaultTo('incomplete');
  });
}

export async function down(knex) {
  return knex.schema.table('steps', (table) => {
    table.dropColumn('status');
  });
}
