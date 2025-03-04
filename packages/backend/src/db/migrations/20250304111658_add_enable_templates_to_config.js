export async function up(knex) {
  return await knex.schema.alterTable('config', (table) => {
    table.boolean('enable_templates');
  });
}

export async function down(knex) {
  return await knex.schema.alterTable('config', (table) => {
    table.dropColumn('enable_templates');
  });
}
