export async function up(knex) {
  return await knex.schema.alterTable('forms', (table) => {
    table.jsonb('fields');
  });
}

export async function down(knex) {
  return await knex.schema.alterTable('forms', (table) => {
    table.dropColumn('fields');
  });
}
