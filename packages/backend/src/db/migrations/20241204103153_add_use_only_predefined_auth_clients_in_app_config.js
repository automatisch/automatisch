export async function up(knex) {
  return await knex.schema.alterTable('app_configs', (table) => {
    table.boolean('use_only_predefined_auth_clients').defaultTo(false);
  });
}

export async function down(knex) {
  return await knex.schema.alterTable('app_configs', (table) => {
    table.dropColumn('use_only_predefined_auth_clients');
  });
}
