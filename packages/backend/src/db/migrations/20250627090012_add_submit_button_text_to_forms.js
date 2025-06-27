export async function up(knex) {
  return await knex.schema.alterTable('forms', (table) => {
    table.string('submit_button_text');
  });
}

export async function down(knex) {
  return await knex.schema.alterTable('forms', (table) => {
    table.dropColumn('submit_button_text');
  });
}
