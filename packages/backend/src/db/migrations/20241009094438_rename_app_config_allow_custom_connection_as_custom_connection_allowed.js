export async function up(knex) {
  return knex.schema.alterTable('app_configs', (table) => {
    table.renameColumn('allow_custom_connection', 'custom_connection_allowed');
  });
}

export async function down(knex) {
  return knex.schema.alterTable('app_configs', (table) => {
    table.renameColumn('custom_connection_allowed', 'allow_custom_connection');
  });
}
