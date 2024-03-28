export async function up(knex) {
  await knex.schema.table('app_auth_clients', (table) => {
    table.dropColumn('app_config_id');
  });
}

export async function down(knex) {
  await knex.schema.table('app_auth_clients', (table) => {
    table.uuid('app_config_id').references('id').inTable('app_configs');
  });
}
