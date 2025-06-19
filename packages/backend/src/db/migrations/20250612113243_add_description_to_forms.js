export async function up(knex) {
  return await knex.schema.alterTable('forms', (table) => {
    table.text('description');
  });
}

export async function down(knex) {
  return await knex.schema.alterTable('forms', (table) => {
    table.dropColumn('description');
  });
}
