export async function up(knex) {
  await knex.schema.table('config', (table) => {
    table.string('default_ai_provider_key');
  });
}

export async function down(knex) {
  await knex.schema.table('config', (table) => {
    table.dropColumn('default_ai_provider_key');
  });
}
