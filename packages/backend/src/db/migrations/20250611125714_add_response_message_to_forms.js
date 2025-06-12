export async function up(knex) {
  return await knex.schema.alterTable('forms', (table) => {
    table.text('response_message');
  });
}

export async function down(knex) {
  return await knex.schema.alterTable('forms', (table) => {
    table.dropColumn('response_message');
  });
}
