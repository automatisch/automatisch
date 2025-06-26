export async function up(knex) {
  return await knex.schema.alterTable('forms', (table) => {
    table.text('display_name');
  });
}

export async function down(knex) {
  return await knex.schema.alterTable('forms', (table) => {
    table.dropColumn('display_name');
  });
}
