export async function up(knex) {
  await knex.schema.table('app_configs', (table) => {
    table.boolean('can_connect').defaultTo(false);
  });
}

export async function down(knex) {
  await knex.schema.table('app_configs', (table) => {
    table.dropColumn('can_connect');
  });
}
