export async function up(knex) {
  return knex.schema.alterTable('app_configs', function (table) {
    table.dropPrimary();
    table.primary('key');
  });
}

export async function down(knex) {
  return knex.schema.alterTable('app_configs', function (table) {
    table.dropPrimary();
    table.primary('id');
  });
}
