export async function up(knex) {
  return knex.schema.alterTable('app_configs', function (table) {
    table.dropColumn('id');
  });
}

export async function down(knex) {
  return knex.schema.alterTable('app_configs', function (table) {
    table.increments('id').primary();
  });
}
