export async function up(knex) {
  return knex.schema.table('steps', (table) => {
    table.integer('position').notNullable();
  });
}

export async function down(knex) {
  return knex.schema.table('steps', (table) => {
    table.dropColumn('position');
  });
}
